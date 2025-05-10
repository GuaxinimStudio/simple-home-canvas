
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  role: string;
  gabinete_id: string | null;
  gabinetes: {
    gabinete: string;
  } | null;
}

const useUsuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Usando a abordagem dividida para evitar recursão RLS
  const { data: usuarios, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      try {
        // Primeiro buscamos os IDs e dados básicos dos perfis
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            nome,
            email,
            telefone,
            role,
            gabinete_id
          `)
          .order('nome');

        if (profilesError) {
          throw profilesError;
        }

        // Agora obtemos os dados dos gabinetes em uma consulta separada
        const gabineteIds = profilesData
          .filter(profile => profile.gabinete_id)
          .map(profile => profile.gabinete_id);

        let gabinetesMap = {};
        
        if (gabineteIds.length > 0) {
          const { data: gabinetesData, error: gabinetesError } = await supabase
            .from('gabinetes')
            .select('id, gabinete')
            .in('id', gabineteIds);

          if (gabinetesError) {
            console.error('Erro ao buscar gabinetes:', gabinetesError);
          } else if (gabinetesData) {
            // Criar um mapa de ID para objeto de gabinete
            gabinetesMap = gabinetesData.reduce((acc, gabinete) => {
              acc[gabinete.id] = gabinete;
              return acc;
            }, {});
          }
        }

        // Combinar os dados de perfis com os dados de gabinetes
        const usuariosCompletos = profilesData.map(profile => ({
          ...profile,
          gabinetes: profile.gabinete_id ? gabinetesMap[profile.gabinete_id] : null
        }));

        console.log('Usuários carregados com sucesso:', usuariosCompletos.length);
        return usuariosCompletos || [];
      } catch (err) {
        console.error('Erro na consulta de usuários:', err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: err.message
        });
        return [];
      }
    }
  });

  // Buscar gabinetes para o select
  const { data: gabinetes } = useQuery({
    queryKey: ['gabinetes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gabinetes')
        .select('id, gabinete')
        .order('gabinete');

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar gabinetes",
          description: error.message
        });
        return [];
      }

      return data || [];
    }
  });

  // Filtrar usuários baseado no termo de busca
  const usuariosFiltrados = usuarios?.filter(user => 
    !searchTerm || 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    usuarios: usuariosFiltrados,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    gabinetes
  };
};

export default useUsuarios;
