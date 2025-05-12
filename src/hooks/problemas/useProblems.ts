
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProblemItem } from '@/components/problemas/types';
import { useAuth } from '@/contexts/AuthContext';

export const useProblems = (limit = 5, forceRefresh = false) => {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{role: string, gabinete_id: string | null} | null>(null);

  // Buscar o perfil do usuário atual
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
      } catch (err: any) {
        console.error('Erro ao buscar perfil do usuário:', err);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Usamos useCallback para evitar recriações desnecessárias da função
  const refreshData = useCallback(() => {
    // Evitamos múltiplas atualizações simultâneas
    if (!isRefreshing) {
      setLastRefresh(Date.now());
    }
  }, [isRefreshing]);

  useEffect(() => {
    let isMounted = true;
    setIsRefreshing(true);
    
    const fetchProblemas = async () => {
      try {
        setIsLoading(true);
        // Modificamos a consulta para não usar a política de segurança de profiles
        let query = supabase
          .from('problemas')
          .select(`
            id,
            descricao,
            status,
            created_at,
            updated_at,
            telefone,
            prazo_estimado,
            municipio,
            foto_url,
            resolvido_no_prazo,
            gabinete_id,
            secretaria
          `);
          
        // Se o usuário for do tipo vereador e tiver um gabinete associado, filtrar os problemas desse gabinete
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          query = query.eq('gabinete_id', userProfile.gabinete_id);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
          
        if (error) throw error;
        
        // Verificamos se o componente ainda está montado antes de atualizar o estado
        if (!isMounted) return;
        
        console.log("Problemas carregados (filtrados por perfil):", data);

        // Processamos os dados para manter a mesma estrutura, mas evitando a recursão infinita
        // Adicionamos um objeto gabinete nulo temporariamente
        const processedData = data?.map(problem => ({
          ...problem,
          gabinete: null
        })) || [];

        setProblems(processedData);
      } catch (err: any) {
        console.error('Erro ao buscar problemas:', err);
        if (isMounted) {
          setError(err.message || 'Erro ao carregar problemas');
          toast.error(`Erro ao carregar problemas: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };
    
    // Só buscar problemas quando tivermos informação do perfil do usuário
    if (userProfile || !user) {
      fetchProblemas();
    }
    
    return () => {
      isMounted = false;
    };
  }, [limit, lastRefresh, forceRefresh, userProfile, user]);

  return { problems, isLoading, error, refreshData };
};
