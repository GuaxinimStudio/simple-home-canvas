
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProblemItem } from '@/components/problemas/types';
import { useAuth } from '@/contexts/AuthContext';

export const useProblemData = () => {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchProblemas = async () => {
      try {
        setIsLoading(true);
        
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
            gabinete_id
          `);
          
        // Se o usuário for do tipo vereador e tiver um gabinete associado, filtrar os problemas desse gabinete
        if (userProfile?.role === 'vereador' && userProfile.gabinete_id) {
          query = query.eq('gabinete_id', userProfile.gabinete_id);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
          
        if (error) throw error;
        
        console.log("Problemas carregados (filtrados por perfil):", data);

        // Processamos os dados para manter a mesma estrutura
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
    
    // Só buscar problemas quando tivermos informação do perfil do usuário
    if (userProfile || !user) {
      fetchProblemas();
    }
  }, [userProfile, user]);

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
    error,
    userProfile
  };
};
