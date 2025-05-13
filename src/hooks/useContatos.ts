
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
      // Verificar se já existe um contato com este telefone neste gabinete
      const { data: contatosExistentes, error: errorBusca } = await supabase
        .from('contatos_cidadaos')
        .select('*')
        .contains('gabinetes_ids', [gabineteId])
        .eq('telefone', telefone);

      if (errorBusca) {
        console.error('Erro ao verificar contatos existentes:', errorBusca);
        toast({
          variant: "destructive",
          title: "Erro ao verificar contatos existentes",
          description: errorBusca.message
        });
        return null;
      }

      // Se já existe um contato com este telefone neste gabinete, não permitir
      if (contatosExistentes && contatosExistentes.length > 0) {
        toast({
          variant: "destructive",
          title: "Telefone já cadastrado",
          description: "Este número de telefone já está cadastrado neste gabinete."
        });
        return null;
      }

      // Caso não exista, criar o novo contato
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
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar contato",
          description: error.message
        });
        console.error('Erro ao criar contato:', error);
        return null;
      }

      toast({
        title: "Contato cadastrado com sucesso!",
        description: "O contato foi vinculado ao gabinete."
      });
      refetch();
      return data?.[0];
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar contato",
        description: err.message
      });
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
