
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notificacao {
  id: string;
  created_at: string;
  updated_at: string;
  gabinete_id: string | null;
  informacao: string;
  telefones: string[];
  arquivo_url?: string | null;
  arquivo_tipo?: string | null;
  gabinete?: {
    gabinete: string;
    municipio: string | null;
  };
}

export const useNotificacoes = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Buscar notificações
  const { data: notificacoes, isLoading, error } = useQuery({
    queryKey: ['notificacoes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('notificacao')
          .select(`
            *,
            gabinete:gabinetes(gabinete, municipio)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Notificacao[];
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        toast.error('Erro ao carregar notificações');
        return [];
      }
    }
  });

  // Upload de arquivo
  const uploadArquivo = async (file: File) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `notificacoes/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('arquivos')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('arquivos')
        .getPublicUrl(filePath);
        
      return {
        url: publicUrl,
        tipo: file.type
      };
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast.error('Erro ao fazer upload do arquivo');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Enviar para o webhook
  const enviarParaWebhook = async (telefones: string[], texto: string, temArquivo: boolean, tipoArquivo: string | null) => {
    const webhookUrl = 'https://hook.us1.make.com/4ktz9s09wo5kt8a4fhhsb46pudkwan6u';
    
    try {
      // Determinar os valores para os campos
      const notificacaoSimples = !temArquivo;
      const temImagem = temArquivo && tipoArquivo?.startsWith('image/');
      const temPdf = temArquivo && tipoArquivo === 'application/pdf';
      
      for (const telefone of telefones) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telefone,
            texto,
            notificacao: notificacaoSimples ? 'sim' : 'não',
            imagem: temImagem ? 'sim' : 'não',
            pdf: temPdf ? 'sim' : 'não'
          })
        });
        
        // Pequeno atraso para evitar sobrecarga do webhook
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log('Notificação enviada com sucesso para o webhook');
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      // Continuamos mesmo com erro no webhook para salvar no banco
    }
  };

  // Criar nova notificação
  const { mutate: criarNotificacao, isPending: isCreating } = useMutation({
    mutationFn: async ({
      novaNotificacao,
      arquivo
    }: {
      novaNotificacao: Omit<Notificacao, 'id' | 'created_at' | 'updated_at' | 'arquivo_url' | 'arquivo_tipo'>;
      arquivo?: File;
    }) => {
      let arquivoInfo = null;
      
      // Se tem arquivo, faz upload
      if (arquivo) {
        arquivoInfo = await uploadArquivo(arquivo);
      }
      
      // Obter contatos do gabinete se necessário
      let todosTelefones = [...novaNotificacao.telefones];
      
      if (novaNotificacao.gabinete_id) {
        try {
          const { data: contatos } = await supabase
            .from('contatos_cidadaos')
            .select('telefone')
            .contains('gabinetes_ids', [novaNotificacao.gabinete_id]);
            
          if (contatos && contatos.length > 0) {
            const telefonesDosContatos = contatos.map(c => c.telefone);
            todosTelefones = [...todosTelefones, ...telefonesDosContatos];
          }
        } catch (error) {
          console.error('Erro ao buscar contatos do gabinete:', error);
        }
      }
      
      // Enviar para o webhook se houver telefones
      if (todosTelefones.length > 0) {
        await enviarParaWebhook(
          todosTelefones, 
          novaNotificacao.informacao, 
          !!arquivoInfo, 
          arquivoInfo?.tipo || null
        );
      }
      
      // Salvar no banco de dados
      const { data, error } = await supabase
        .from('notificacao')
        .insert({
          ...novaNotificacao,
          telefones: todosTelefones,
          arquivo_url: arquivoInfo?.url || null,
          arquivo_tipo: arquivoInfo?.tipo || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Notificação criada e enviada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
    onError: (error) => {
      console.error('Erro ao criar notificação:', error);
      toast.error('Erro ao criar notificação');
    }
  });

  // Excluir notificação
  const { mutate: excluirNotificacao } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notificacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast.success('Notificação excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
    onError: (error) => {
      console.error('Erro ao excluir notificação:', error);
      toast.error('Erro ao excluir notificação');
    }
  });

  // Filtrar notificações
  const filteredNotificacoes = notificacoes?.filter(notificacao => 
    notificacao.informacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notificacao.gabinete?.gabinete && notificacao.gabinete.gabinete.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (notificacao.gabinete?.municipio && notificacao.gabinete.municipio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    notificacoes: filteredNotificacoes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    criarNotificacao,
    excluirNotificacao,
    isCreating,
    isUploading
  };
};
