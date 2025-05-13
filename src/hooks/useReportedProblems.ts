
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatISO, subDays, startOfDay, endOfDay } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export interface ReportedProblems {
  today: number;
  week: number;
  month: number;
  total: number;
}

export const useReportedProblems = () => {
  const [stats, setStats] = useState<ReportedProblems>({
    today: 0,
    week: 0,
    month: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{role: string, gabinete_id: string | null} | null>(null);

  // Buscamos o perfil do usuário uma única vez quando o componente é montado
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
        console.log('Perfil do usuário carregado:', data);
      } catch (err: any) {
        console.error('Erro ao buscar perfil do usuário:', err);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Usamos useCallback para memorizar a função e evitar recriações
  const fetchReportedProblems = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const now = new Date();
      
      // Início e fim do dia atual
      const todayStart = formatISO(startOfDay(now));
      const todayEnd = formatISO(endOfDay(now));
      
      // Início da semana (7 dias atrás)
      const weekStart = formatISO(startOfDay(subDays(now, 7)));
      
      // Início do mês (30 dias atrás)
      const monthStart = formatISO(startOfDay(subDays(now, 30)));

      // Definir queries baseadas no papel do usuário
      let totalQuery = supabase.from('problemas').select('*', { count: 'exact', head: true });
      let todayQuery = supabase.from('problemas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart)
        .lte('created_at', todayEnd);
      let weekQuery = supabase.from('problemas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart);
      let monthQuery = supabase.from('problemas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart);
      
      // Apenas para vereadores (não administradores) filtramos por gabinete
      if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
        totalQuery = totalQuery.eq('gabinete_id', userProfile.gabinete_id);
        todayQuery = todayQuery.eq('gabinete_id', userProfile.gabinete_id);
        weekQuery = weekQuery.eq('gabinete_id', userProfile.gabinete_id);
        monthQuery = monthQuery.eq('gabinete_id', userProfile.gabinete_id);
        console.log('Filtrando estatísticas pelo gabinete:', userProfile.gabinete_id);
      } else {
        console.log('Não filtrando estatísticas por gabinete, papel do usuário:', userProfile?.role);
      }

      // Executamos as queries em paralelo para melhor performance
      const [totalResult, todayResult, weekResult, monthResult] = await Promise.all([
        totalQuery,
        todayQuery,
        weekQuery,
        monthQuery
      ]);

      // Verificamos erros em qualquer uma das queries
      if (totalResult.error) throw totalResult.error;
      if (todayResult.error) throw todayResult.error;
      if (weekResult.error) throw weekResult.error;
      if (monthResult.error) throw monthResult.error;

      console.log('Estatísticas de problemas:', {
        total: totalResult.count,
        hoje: todayResult.count,
        semana: weekResult.count,
        mes: monthResult.count
      });

      setStats({
        today: todayResult.count || 0,
        week: weekResult.count || 0,
        month: monthResult.count || 0,
        total: totalResult.count || 0
      });

    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de problemas reportados:', error);
      toast.error(`Erro ao carregar estatísticas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile]);

  // Efeito para buscar os problemas reportados quando temos o perfil do usuário
  useEffect(() => {
    if (user && userProfile !== null) {
      fetchReportedProblems();
    } else if (!user) {
      // Se não houver usuário, definimos valores padrão
      setStats({
        today: 0,
        week: 0,
        month: 0,
        total: 0
      });
      setIsLoading(false);
    }
  }, [user, userProfile, fetchReportedProblems]);

  return { stats, isLoading };
};
