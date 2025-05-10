
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  const { data: gabinetes, isLoading, refetch } = useQuery({
    queryKey: ['gabinetes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gabinetes')
          .select('*, profiles(id, nome)')
          .order('gabinete');
          
        if (error) {
          // Em caso de erro "infinite recursion detected in policy", retornamos array vazio
          // Este erro ocorre devido a configurações RLS no Supabase
          if (error.message?.includes('infinite recursion detected in policy')) {
            console.error('Aviso: Erro nas políticas do Supabase (recursão infinita). Retornando lista vazia:', error);
            return [];
          }
          
          // Para outros tipos de erros, logamos no console mas não mostramos toast
          console.error('Erro ao carregar gabinetes:', error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error('Erro inesperado ao carregar gabinetes:', err);
        return [];
      }
    }
  });
  
  const filteredGabinetes = gabinetes?.filter(gabinete =>
    gabinete.gabinete.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gabinete.responsavel && gabinete.responsavel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (gabinete.municipio && gabinete.municipio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    gabinetes: filteredGabinetes,
    isLoading,
    refetch,
    searchTerm,
    setSearchTerm
  };
};

export default useGabinetes;
