
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProblemItem } from './types';

export const useProblems = (limit = 5) => {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            telefone,
            prazo_estimado,
            municipio,
            foto_url
          `)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        
        console.log("Problemas carregados:", data);

        // Processamos os dados para manter a mesma estrutura, mas evitando a recursão infinita
        // Adicionamos um objeto gabinete nulo temporariamente
        const processedData = data?.map(problem => ({
          ...problem,
          gabinete: null
        })) || [];

        setProblems(processedData);
      } catch (err: any) {
        console.error('Erro ao buscar problemas:', err);
        setError(err.message || 'Erro ao carregar problemas');
        toast.error(`Erro ao carregar problemas: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblemas();
  }, [limit]);

  return { problems, isLoading, error };
};
