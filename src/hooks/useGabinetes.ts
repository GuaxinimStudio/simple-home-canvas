
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      const { data, error } = await supabase
        .from('gabinetes')
        .select('*, profiles(id, nome)')
        .order('gabinete');
        
      if (error) {
        toast.error('Erro ao carregar gabinetes: ' + error.message);
        console.error('Erro ao carregar gabinetes:', error);
        return [];
      }
      
      return data || [];
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
