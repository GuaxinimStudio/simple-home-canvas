
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface ProblemStats {
  total: number;
  pendentes: number;
  emAndamento: number;
  resolvidos: number;
  insuficientes: number;
}

export const useProblemsStats = () => {
  const [stats, setStats] = useState<ProblemStats>({
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    resolvidos: 0,
    insuficientes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Usando useCallback para evitar recriações desnecessárias da função
  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats({
        total: 0,
        pendentes: 0,
        emAndamento: 0,
        resolvidos: 0,
        insuficientes: 0
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Primeiro buscamos o perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, gabinete_id')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Preparar query com base no papel do usuário
      let query = supabase.from('problemas').select('status');
      
      // Se for vereador com gabinete_id, filtrar por gabinete
      if (profileData?.role === 'vereador' && profileData?.gabinete_id) {
        query = query.eq('gabinete_id', profileData.gabinete_id);
      }
      
      // Executar a consulta
      const { data: problems, error: problemsError } = await query;
      
      if (problemsError) throw problemsError;
      
      // Inicializar contadores
      let pendentes = 0;
      let emAndamento = 0;
      let resolvidos = 0;
      let insuficientes = 0;
      
      // Contar problemas por status
      if (problems && problems.length > 0) {
        problems.forEach(problem => {
          switch (problem.status) {
            case 'Pendente':
              pendentes++;
              break;
            case 'Em andamento':
              emAndamento++;
              break;
            case 'Resolvido':
              resolvidos++;
              break;
            case 'Informações Insuficientes':
              insuficientes++;
              break;
          }
        });
      }
      
      // Atualizar estatísticas
      setStats({
        total: problems ? problems.length : 0,
        pendentes,
        emAndamento,
        resolvidos,
        insuficientes
      });
      
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      toast.error(`Erro ao carregar estatísticas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Usar um único useEffect que chama a função fetchStats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading };
};
