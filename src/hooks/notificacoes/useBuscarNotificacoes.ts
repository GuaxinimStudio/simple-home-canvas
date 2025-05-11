
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Notificacao } from './types';
import { useState } from 'react';

export const useBuscarNotificacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
  };
};
