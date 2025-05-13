
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Contato {
  id: string;
  nome: string;
  telefone: string;
  created_at: string;
}

export const useContatos = (gabineteId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  // Buscar contatos por gabineteId
  const { data: contatos, refetch } = useQuery({
    queryKey: ['contatos', gabineteId],
    queryFn: async () => {
      try {
        console.log('Buscando contatos para o gabinete:', gabineteId);
        const { data, error } = await supabase
          .from('contatos_cidadaos')
          .select('*')
          .contains('gabinetes_ids', [gabineteId]);

        if (error) {
          console.error('Erro ao buscar contatos:', error);
          return [];
        }

        console.log('Contatos encontrados:', data?.length || 0);
        return data as Contato[] || [];
      } catch (err) {
        console.error('Erro inesperado ao buscar contatos:', err);
        return [];
      }
    }
  });

  // Criar novo contato
  const criarContato = async (nome: string, telefone: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('contatos_cidadaos')
        .insert([
          { 
            nome, 
            telefone, 
            gabinetes_ids: [gabineteId] 
          }
        ])
        .select();

      if (error) {
        toast.error('Erro ao cadastrar contato');
        console.error('Erro ao criar contato:', error);
        return null;
      }

      toast.success('Contato cadastrado com sucesso!');
      refetch();
      return data?.[0];
    } catch (err) {
      toast.error('Erro ao cadastrar contato');
      console.error('Erro inesperado ao criar contato:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contatos: contatos || [],
    isLoading,
    criarContato,
    refetch
  };
};
