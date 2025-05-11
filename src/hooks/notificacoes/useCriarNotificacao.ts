
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useArquivoUpload } from './useArquivoUpload';
import { useWebhookEnvio } from './useWebhookEnvio';
import { NovaNotificacaoDto } from './types';

export const useCriarNotificacao = () => {
  const queryClient = useQueryClient();
  const { uploadArquivo, isUploading } = useArquivoUpload();
  const { enviarParaWebhook } = useWebhookEnvio();

  const { mutate: criarNotificacao, isPending: isCreating } = useMutation({
    mutationFn: async ({
      novaNotificacao,
      arquivo
    }: {
      novaNotificacao: NovaNotificacaoDto;
      arquivo?: File;
    }) => {
      let arquivoInfo = null;
      
      // Se tem arquivo, faz upload
      if (arquivo) {
        arquivoInfo = await uploadArquivo(arquivo);
      }
      
      // Obter contatos do gabinete
      let todosTelefones: string[] = [];
      
      if (novaNotificacao.gabinete_id) {
        try {
          const { data: contatos } = await supabase
            .from('contatos_cidadaos')
            .select('telefone')
            .contains('gabinetes_ids', [novaNotificacao.gabinete_id]);
            
          if (contatos && contatos.length > 0) {
            todosTelefones = contatos.map(c => c.telefone);
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

  return {
    criarNotificacao,
    isCreating,
    isUploading
  };
};
