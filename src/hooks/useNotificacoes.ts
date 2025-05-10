
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
  gabinete?: {
    gabinete: string;
    municipio: string | null;
  };
}

export const useNotificacoes = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

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

  // Criar nova notificação
  const { mutate: criarNotificacao, isPending: isCreating } = useMutation({
    mutationFn: async (novaNotificacao: Omit<Notificacao, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('notificacao')
        .insert(novaNotificacao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Notificação criada com sucesso!');
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
    isCreating
  };
};
