import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { StatusType, OcorrenciaData } from '@/types/ocorrencia';

export const useOcorrenciaDetails = (id: string | undefined) => {
  const [currentStatus, setCurrentStatus] = useState<StatusType>('Pendente');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problemData, setProblemData] = useState<OcorrenciaData | null>(null);
  const [prazoEstimado, setPrazoEstimado] = useState<string>('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [descricaoResolvido, setDescricaoResolvido] = useState<string>('');
  const [imagemResolvido, setImagemResolvido] = useState<File | null>(null);
  const [imagemResolvidoPreview, setImagemResolvidoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          throw new Error('ID não fornecido');
        }

        // Tentamos primeiro buscar apenas dados básicos do problema, sem joins que podem causar recursão
        const { data: basicData, error: basicError } = await supabase
          .from('problemas')
          .select('*')
          .eq('id', id)
          .single();

        if (basicError) {
          // Se houver erro na consulta básica, não podemos continuar
          throw basicError;
        }

        // Se temos os dados básicos, podemos usá-los
        let fullData = basicData as OcorrenciaData;
        
        // Agora tentamos buscar o gabinete separadamente se temos um gabinete_id
        if (basicData.gabinete_id) {
          try {
            const { data: gabineteData, error: gabineteError } = await supabase
              .from('gabinetes')
              .select('gabinete, municipio')
              .eq('id', basicData.gabinete_id)
              .single();
              
            if (!gabineteError && gabineteData) {
              // Se conseguimos os dados do gabinete, adicionamos ao objeto de dados
              fullData = {
                ...basicData,
                gabinete: {
                  gabinete: gabineteData.gabinete,
                  municipio: gabineteData.municipio
                }
              } as OcorrenciaData;
            }
          } catch (gabErr) {
            console.warn('Erro ao buscar gabinete, continuando com dados básicos:', gabErr);
            // Não interrompemos o fluxo, continuamos com os dados básicos
          }
        }

        setProblemData(fullData);
        
        if (fullData) {
          setCurrentStatus(fullData.status as StatusType);
          
          if (fullData.gabinete_id && fullData.gabinete) {
            setSelectedDepartamento(fullData.gabinete.gabinete || '');
          }
          
          if (fullData.prazo_estimado) {
            setPrazoEstimado(format(new Date(fullData.prazo_estimado), 'yyyy-MM-dd'));
          }
          
          if (fullData.descricao_resolvido) {
            setDescricaoResolvido(fullData.descricao_resolvido);
          }
          
          if (fullData.imagem_resolvido) {
            setImagemResolvidoPreview(fullData.imagem_resolvido);
          }
        }
      } catch (err: any) {
        console.error('Erro ao buscar detalhes do problema:', err);
        
        // Verificamos se é o erro específico de recursão infinita
        if (err.message?.includes('infinite recursion detected')) {
          setError('Erro de permissão no banco de dados. Contate o administrador.');
          toast.error('Erro de permissão no banco de dados.');
        } else {
          setError(err.message || 'Erro ao carregar dados');
          toast.error(`Erro ao carregar dados: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemDetails();
  }, [id]);

  const handleStatusChange = (value: string) => {
    if (!prazoEstimado) {
      toast.error('É necessário definir um prazo antes de alterar o status.');
      return;
    }
    setCurrentStatus(value as StatusType);
  };

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrazoEstimado(e.target.value);
  };
  
  const handleDescricaoResolvidoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescricaoResolvido(e.target.value);
  };
  
  const handleImagemResolvidoChange = async (file: File | null) => {
    if (file) {
      // Criar uma URL temporária para preview
      const previewUrl = URL.createObjectURL(file);
      setImagemResolvidoPreview(previewUrl);
      setImagemResolvido(file);
    } else {
      // Se null, limpar o preview
      if (imagemResolvidoPreview && !imagemResolvidoPreview.startsWith('http')) {
        URL.revokeObjectURL(imagemResolvidoPreview);
      }
      setImagemResolvidoPreview(null);
      setImagemResolvido(null);
    }
  };

  const handleSalvar = async () => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      if (currentStatus !== problemData?.status && !prazoEstimado) {
        toast.error('É necessário definir um prazo antes de alterar o status.');
        return;
      }

      // Verifica se precisa de descrição detalhada para status de Resolvido ou Informações Insuficientes
      if ((currentStatus === 'Resolvido' || currentStatus === 'Informações Insuficientes') && !descricaoResolvido.trim()) {
        toast.error(`É necessário fornecer ${currentStatus === 'Resolvido' ? 'detalhes da resolução' : 'orientações para o cidadão'}.`);
        return;
      }

      const updateData: Record<string, any> = {
        status: currentStatus,
        descricao_resolvido: descricaoResolvido
      };

      if (prazoEstimado) {
        updateData.prazo_estimado = prazoEstimado;
      }
      
      // Se o status for alterado para Resolvido, atualizamos a data de resolução
      // automaticamente na data atual
      if (currentStatus === 'Resolvido' && problemData?.status !== 'Resolvido') {
        // A data de atualização (updated_at) será atualizada automaticamente pelo trigger do banco
        toast.success('Problema resolvido! O contador de tempo foi parado.');
      }
      
      // Se tiver uma nova imagem para upload
      if (imagemResolvido) {
        // Converter imagem para base64 para salvar no banco
        // Na prática, deveria ser feito upload da imagem para um bucket de storage
        // E armazenar apenas a URL no banco de dados
        const reader = new FileReader();
        reader.readAsDataURL(imagemResolvido);
        reader.onload = async () => {
          updateData.imagem_resolvido = reader.result;
          
          // Atualizar o banco de dados com todos os dados
          const { error } = await supabase
            .from('problemas')
            .update(updateData)
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Atualizar o problemData localmente para refletir mudanças imediatamente
          if (problemData) {
            const updatedProblem = {
              ...problemData,
              ...updateData,
              prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : problemData.prazo_estimado,
              updated_at: currentStatus === 'Resolvido' && problemData.status !== 'Resolvido' 
                ? new Date().toISOString() 
                : problemData.updated_at
            };
            setProblemData(updatedProblem);
          }

          toast.success('Alterações salvas com sucesso!');
        };
      } else {
        // Se não houver nova imagem, apenas atualizamos os outros dados
        const { error } = await supabase
          .from('problemas')
          .update(updateData)
          .eq('id', id);

        if (error) {
          throw error;
        }

        // Atualizar o problemData localmente para refletir mudanças imediatamente
        if (problemData) {
          const updatedProblem = {
            ...problemData,
            ...updateData,
            prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : problemData.prazo_estimado,
            updated_at: currentStatus === 'Resolvido' && problemData.status !== 'Resolvido' 
              ? new Date().toISOString() 
              : problemData.updated_at
          };
          setProblemData(updatedProblem);
        }

        toast.success('Alterações salvas com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      toast.error(`Erro ao salvar: ${err.message}`);
    }
  };
  
  const handleEnviarRespostaCidadao = async () => {
    try {
      if (!problemData) {
        throw new Error('Dados do problema não disponíveis');
      }
      
      // Exibir toast de loading
      toast.loading('Enviando resposta ao cidadão...');
      
      // Preparar os dados para enviar ao webhook
      const webhookUrl = 'https://hook.us1.make.com/4ktz9s09wo5kt8a4fhhsb46pudkwan6u';
      const webhookData = {
        id: problemData.id,
        telefone: problemData.telefone,
        descricao: problemData.descricao,
        descricao_resolvido: problemData.descricao_resolvido,
        municipio: problemData.municipio,
        created_at: problemData.created_at,
        updated_at: problemData.updated_at,
        imagem_resolvido: problemData.imagem_resolvido
      };
      
      // Enviar para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar resposta: ${response.statusText}`);
      }
      
      // Atualizar o status de resposta enviada no banco de dados
      const { error } = await supabase
        .from('problemas')
        .update({ resposta_enviada: true })
        .eq('id', problemData.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar localmente também
      if (problemData) {
        setProblemData({
          ...problemData,
          resposta_enviada: true
        });
      }
      
      // Exibir toast de sucesso
      toast.dismiss();
      toast.success('Resposta enviada com sucesso ao cidadão!');
      
    } catch (err: any) {
      console.error('Erro ao enviar resposta ao cidadão:', err);
      toast.dismiss();
      toast.error(`Erro ao enviar resposta: ${err.message}`);
    }
  };

  return {
    isLoading,
    error,
    problemData,
    currentStatus,
    selectedDepartamento,
    prazoEstimado,
    imageModalOpen,
    descricaoResolvido,
    imagemResolvidoPreview,
    setImageModalOpen,
    handleStatusChange,
    handlePrazoChange,
    handleSalvar,
    setSelectedDepartamento,
    handleDescricaoResolvidoChange,
    handleImagemResolvidoChange,
    handleEnviarRespostaCidadao
  };
};
