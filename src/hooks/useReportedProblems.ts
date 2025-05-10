
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatISO, subDays, startOfDay, endOfDay } from 'date-fns';

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

  useEffect(() => {
    const fetchReportedProblems = async () => {
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

        // Buscar total
        const { count: total, error: totalError } = await supabase
          .from('problemas')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) throw totalError;

        // Buscar problemas de hoje
        const { count: today, error: todayError } = await supabase
          .from('problemas')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd);
        
        if (todayError) throw todayError;

        // Buscar problemas da semana
        const { count: week, error: weekError } = await supabase
          .from('problemas')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekStart);
        
        if (weekError) throw weekError;

        // Buscar problemas do mês
        const { count: month, error: monthError } = await supabase
          .from('problemas')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart);
        
        if (monthError) throw monthError;

        setStats({
          today: today || 0,
          week: week || 0,
          month: month || 0,
          total: total || 0
        });

      } catch (error: any) {
        console.error('Erro ao buscar estatísticas de problemas reportados:', error);
        toast.error(`Erro ao carregar estatísticas: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedProblems();
  }, []);

  return { stats, isLoading };
};
