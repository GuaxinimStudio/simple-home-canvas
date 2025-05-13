
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
      } catch (err: any) {
        console.error('Erro ao buscar perfil do usuário:', err);
      }
    };
    
    fetchUserProfile();
  }, [user]);

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
      
      // Preparar query base
      let query = supabase.from('problemas').select('status');
      
      // Apenas para vereadores (não administradores) filtramos por gabinete
      if (userProfile?.role === 'vereador' && userProfile?.gabinete_id) {
        query = query.eq('gabinete_id', userProfile.gabinete_id);
      }
      
      // Executar a consulta uma única vez
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
  }, [user, userProfile]);

  // Usamos um único useEffect que chama a função fetchStats apenas quando temos o perfil do usuário
  useEffect(() => {
    if (userProfile !== null || !user) {
      fetchStats();
    }
  }, [fetchStats, userProfile, user]);

  return { stats, isLoading };
};
