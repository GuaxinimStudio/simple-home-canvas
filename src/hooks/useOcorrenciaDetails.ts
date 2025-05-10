
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

  const handleSalvar = async () => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      if (currentStatus !== problemData?.status && !prazoEstimado) {
        toast.error('É necessário definir um prazo antes de alterar o status.');
        return;
      }

      const updateData: Record<string, any> = {
        status: currentStatus,
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
          status: currentStatus,
          prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : problemData.prazo_estimado,
          updated_at: currentStatus === 'Resolvido' && problemData.status !== 'Resolvido' 
            ? new Date().toISOString() 
            : problemData.updated_at
        };
        setProblemData(updatedProblem);
      }

      toast.success('Alterações salvas com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      toast.error(`Erro ao salvar: ${err.message}`);
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
    setImageModalOpen,
    handleStatusChange,
    handlePrazoChange,
    handleSalvar,
    setSelectedDepartamento
  };
};
