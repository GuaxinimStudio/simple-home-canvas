
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProblemItem } from './types';

export const useProblemData = () => {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemas = async () => {
      try {
        setIsLoading(true);
        
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
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        console.log("Todos os problemas carregados:", data);

        // Processamos os dados para incluir gabinete_id
        const processedData = data?.map(problem => ({
          ...problem,
          gabinete_id: problem.gabinete_id,
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
  }, []);

  const filteredProblems = selectedStatus === 'todos'
    ? problems
    : problems.filter(problem => problem.status === selectedStatus);
  
  const totalProblems = filteredProblems.length;
  
  return { 
    filteredProblems, 
    problems,
    selectedStatus, 
    setSelectedStatus, 
    totalProblems,
    isLoading,
    error
  };
};
