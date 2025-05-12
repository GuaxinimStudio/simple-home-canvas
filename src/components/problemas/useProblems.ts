
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProblemItem } from './types';

export const useProblems = (limit = 5, forceRefresh = false) => {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        const { data, error } = await supabase
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
            gabinete_id
          `)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        
        // Verificamos se o componente ainda está montado antes de atualizar o estado
        if (!isMounted) return;
        
        console.log("Problemas carregados:", data);

        // Processamos os dados para incluir gabinete_id
        const processedData = data?.map(problem => ({
          ...problem,
          gabinete_id: problem.gabinete_id,
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
    
    fetchProblemas();
    
    return () => {
      isMounted = false;
    };
  }, [limit, lastRefresh, forceRefresh]);

  return { problems, isLoading, error, refreshData };
};
