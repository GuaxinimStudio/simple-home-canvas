
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Notificacao } from './types';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useBuscarNotificacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const { data: notificacoes, isLoading, error } = useQuery({
    queryKey: ['notificacoes', user?.id],
    queryFn: async () => {
      try {
        // Primeiro, buscar o perfil do usuário para verificar o role e gabinete_id
        const { data: perfil, error: perfilError } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user?.id)
          .single();

        if (perfilError) throw perfilError;

        // Construir a consulta base
        let query = supabase
          .from('notificacao')
          .select(`
            *,
            gabinete:gabinetes(gabinete, municipio)
          `);

        // Se o usuário for vereador, filtrar apenas as notificações do gabinete dele
        if (perfil.role === 'vereador' && perfil.gabinete_id) {
          query = query.eq('gabinete_id', perfil.gabinete_id);
        }
        // Se for administrador, não aplica filtro (mostra todas)

        // Ordenar por data de criação (mais recentes primeiro)
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;
        return data as Notificacao[];
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        toast.error('Erro ao carregar notificações');
        return [];
      }
    },
    enabled: !!user?.id // Só executa a query se o usuário estiver logado
  });

  // Filtrar notificações com base no termo de busca
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
