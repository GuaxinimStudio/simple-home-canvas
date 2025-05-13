
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GabineteProps {
  id: string;
  gabinete: string;
  estado: string | null;
  municipio: string | null;
  telefone: string | null;
  responsavel: string | null;
  profiles: { id: string; nome: string | null }[];
}

const useGabinetes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Buscar o perfil do usuário para verificar seu papel e gabinete
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile-for-gabinete-access', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, gabinete_id')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Buscar gabinetes com base no papel do usuário
  const { data: gabinetes, isLoading: isLoadingGabinetes, refetch } = useQuery({
    queryKey: ['gabinetes', userProfile?.role, userProfile?.gabinete_id],
    queryFn: async () => {
      try {
        let query = supabase
          .from('gabinetes')
          .select('*, profiles(id, nome)')
          .order('gabinete');
        
        // Se o usuário for vereador, filtrar apenas pelo gabinete ao qual está vinculado
        if (userProfile?.role === 'vereador' && userProfile?.gabinete_id) {
          query = query.eq('id', userProfile.gabinete_id);
        }
          
        const { data, error } = await query;
          
        if (error) {
          // Em caso de erro "infinite recursion detected in policy", retornamos array vazio
          if (error.message?.includes('infinite recursion detected in policy')) {
            console.error('Aviso: Erro nas políticas do Supabase (recursão infinita). Retornando lista vazia:', error);
            return [];
          }
          
          console.error('Erro ao carregar gabinetes:', error);
          return [];
        }
        
        // Processar os dados para garantir que profiles seja sempre um array
        return data?.map(gabinete => ({
          ...gabinete,
          profiles: gabinete.profiles || []
        })) || [];
      } catch (err) {
        console.error('Erro inesperado ao carregar gabinetes:', err);
        return [];
      }
    },
    enabled: !!userProfile
  });
  
  const filteredGabinetes = gabinetes?.filter(gabinete =>
    gabinete.gabinete.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gabinete.responsavel && gabinete.responsavel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (gabinete.municipio && gabinete.municipio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isLoading = isLoadingProfile || isLoadingGabinetes;

  return {
    gabinetes: filteredGabinetes,
    isLoading,
    refetch,
    searchTerm,
    setSearchTerm,
    userProfile
  };
};

export default useGabinetes;
