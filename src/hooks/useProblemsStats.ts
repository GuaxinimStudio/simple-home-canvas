
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

  // Buscar o perfil do usuário para verificar seu papel e gabinete
  useEffect(() => {
    if (!user) {
      setFetchingProfile(false);
      return;
    }
    
    const fetchUserProfile = async () => {
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

  // Buscar estatísticas apenas quando o perfil do usuário estiver carregado
  useEffect(() => {
    if (fetchingProfile) return;
    
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        let totalProblemas = 0;
        let problemasData: any[] = [];
        
        // Preparar a query com base no papel do usuário
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          // Para vereadores, buscamos apenas problemas do gabinete associado
          const { data, error } = await supabase
            .from('problemas')
            .select('status')
            .eq('gabinete_id', userProfile.gabinete_id);
            
          if (error) throw error;
          problemasData = data || [];
          totalProblemas = problemasData.length;
        } else {
          // Para administradores ou outros papéis, buscamos todos os problemas
          const { data, error } = await supabase
            .from('problemas')
            .select('status');
            
          if (error) throw error;
          problemasData = data || [];
          totalProblemas = problemasData.length;
        }
        
        // Calcular contagem para cada status
        let pendentes = 0;
        let emAndamento = 0;
        let resolvidos = 0;
        let insuficientes = 0;

        problemasData.forEach(problem => {
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
          total: totalProblemas,
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
  }, [userProfile, fetchingProfile]);

  return { stats, isLoading };
};
