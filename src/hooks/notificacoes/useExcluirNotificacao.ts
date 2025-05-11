
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExcluirNotificacao = () => {
  const queryClient = useQueryClient();

  const { mutate: excluirNotificacao } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notificacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Notificação excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
    onError: (error) => {
      console.error('Erro ao excluir notificação:', error);
      toast.error('Erro ao excluir notificação');
    }
  });

  return { excluirNotificacao };
};
