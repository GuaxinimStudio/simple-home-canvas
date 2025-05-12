
import { useState, useEffect } from 'react';
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
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Buscar o perfil do usuário para verificar seu papel e gabinete - apenas uma vez
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setFetchingProfile(false);
        return;
      }
      
      try {
        setFetchingProfile(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (error: any) {
        console.error('Erro ao buscar perfil do usuário:', error);
      } finally {
        setFetchingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Buscar estatísticas apenas quando o perfil do usuário for carregado ou quando não houver usuário
  useEffect(() => {
    // Não fazer nada se ainda estamos buscando o perfil
    if (fetchingProfile) return;
    
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Primeiro criamos a query básica de seleção
        const baseQuery = supabase.from('problemas').select('*');
        
        // Se o usuário for vereador e tiver um gabinete associado, preparar a condição de filtro
        let queryWithFilter;
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          queryWithFilter = baseQuery.eq('gabinete_id', userProfile.gabinete_id);
        } else {
          queryWithFilter = baseQuery;
        }
        
        // Buscar total de problemas
        const { count: total, error: totalError } = await queryWithFilter.count();

        if (totalError) throw totalError;
        
        // Buscar dados para contagem por status - criamos novamente a query para evitar problemas de tipagem
        const statusQuery = supabase.from('problemas').select('status');
        
        // Aplicar o mesmo filtro se necessário
        let statusQueryWithFilter;
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          statusQueryWithFilter = statusQuery.eq('gabinete_id', userProfile.gabinete_id);
        } else {
          statusQueryWithFilter = statusQuery;
        }
        
        const { data: statusData, error: statusError } = await statusQueryWithFilter;
        
        if (statusError) throw statusError;

        // Calcular contagem para cada status
        let pendentes = 0;
        let emAndamento = 0;
        let resolvidos = 0;
        let insuficientes = 0;

        statusData.forEach(problem => {
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

        setStats({
          total: total || 0,
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
    };

    fetchStats();
  }, [userProfile, fetchingProfile]); // Dependência apenas no userProfile e fetchingProfile

  return { stats, isLoading };
};
