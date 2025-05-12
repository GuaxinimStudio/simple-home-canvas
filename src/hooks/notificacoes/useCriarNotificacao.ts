
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useArquivoUpload } from './useArquivoUpload';
import { useWebhookEnvio } from './useWebhookEnvio';
import { NovaNotificacaoDto } from './types';
import { useAuth } from '@/contexts/AuthContext';

export const useCriarNotificacao = () => {
  const queryClient = useQueryClient();
  const { uploadArquivo, isUploading } = useArquivoUpload();
  const { enviarParaWebhook } = useWebhookEnvio();
  const { user } = useAuth();

  const { mutate: criarNotificacao, isPending: isCreating } = useMutation({
    mutationFn: async ({
      novaNotificacao,
      arquivo
    }: {
      novaNotificacao: NovaNotificacaoDto;
      arquivo?: File;
    }) => {
      let arquivoInfo = null;
      let gabineteId = novaNotificacao.gabinete_id;
      
      // Se tem arquivo, faz upload
      if (arquivo) {
        arquivoInfo = await uploadArquivo(arquivo);
      }
      
      // Se o usuário for vereador, verificar se o gabinete_id corresponde ao dele
      if (user?.id) {
        const { data: perfil, error: perfilError } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user?.id)
          .single();
          
        if (perfilError) throw perfilError;
        
        // Se for vereador, só pode criar notificação para o próprio gabinete
        if (perfil.role === 'vereador' && perfil.gabinete_id) {
          if (gabineteId !== perfil.gabinete_id) {
            throw new Error('Você só pode criar notificações para o seu próprio gabinete');
          }
        }
      }
      
      // Obter contatos do gabinete
      let todosTelefones: string[] = [];
      
      if (gabineteId) {
        try {
          const { data: contatos } = await supabase
            .from('contatos_cidadaos')
            .select('telefone')
            .contains('gabinetes_ids', [gabineteId]);
            
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
          // Usando o valor padrão para o delay (não precisamos passar o parâmetro)
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
    onError: (error: any) => {
      console.error('Erro ao criar notificação:', error);
      toast.error(error.message || 'Erro ao criar notificação');
    }
  });

  return {
    criarNotificacao,
    isCreating,
    isUploading
  };
};
