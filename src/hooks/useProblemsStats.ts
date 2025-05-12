
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

  // Buscar o perfil do usuário para verificar seu papel e gabinete
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (error: any) {
        console.error('Erro ao buscar perfil do usuário:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Se o perfil do usuário ainda não foi carregado e o usuário existe, aguardar
        if (!userProfile && user) return;
        
        setIsLoading(true);
        
        // Preparar a consulta base para problemas
        let query = supabase.from('problemas');
        
        // Se o usuário for vereador e tiver um gabinete associado, filtrar os problemas desse gabinete
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          // Importante: primeiro definimos a tabela, depois aplicamos o filtro
          query = query.eq('gabinete_id', userProfile.gabinete_id);
        }
        
        // Buscar total de problemas (usando .count() em vez de select com head: true)
        const { count: total, error: totalError } = await query.count();

        if (totalError) throw totalError;
        
        // Preparar a consulta para contagem por status
        let statusQuery = supabase.from('problemas');
        
        // Aplicar o mesmo filtro de gabinete
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          // Primeiro definimos a tabela, depois aplicamos o filtro
          statusQuery = statusQuery.eq('gabinete_id', userProfile.gabinete_id);
        }
        
        // E só então selecionamos os dados que queremos
        const { data: statusData, error: statusError } = await statusQuery.select('status');
        
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
  }, [userProfile, user]);

  return { stats, isLoading };
};
