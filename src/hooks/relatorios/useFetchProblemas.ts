
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Problema, FiltrosRelatorios } from './types';
import { formatarData, aplicarFiltroPorData } from './utils';
import { useAuth } from '@/contexts/AuthContext';

export const useFetchProblemas = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  const fetchProblemas = async (filtros: FiltrosRelatorios, gabineteId?: string): Promise<Problema[]> => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('problemas')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Aplicar filtro por gabinete se o ID for fornecido
      if (gabineteId) {
        query = query.eq('gabinete_id', gabineteId);
      }
      
      // Aplicar filtros de texto
      if (filtros.textoBusca && filtros.textoBusca.trim() !== '') {
        query = query.or(`descricao.ilike.%${filtros.textoBusca}%,municipio.ilike.%${filtros.textoBusca}%`);
      }
      
      // Aplicar filtros de status
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) {
        return [];
      }
      
      // Aplicar filtro por data (mês/ano ou intervalo) em memória
      const problemasFiltrados = data
        .filter(problema => aplicarFiltroPorData(
          problema,
          filtros.tipoFiltro,
          filtros.mes,
          filtros.ano,
          filtros.dataInicio,
          filtros.dataFim
        ))
        .map((problema) => ({
          ...problema,
          data: formatarData(problema.created_at),
        }));
      
      return problemasFiltrados as Problema[];
      
    } catch (error: any) {
      console.error('Erro ao buscar problemas:', error);
      toast.error('Não foi possível carregar os problemas');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchProblemas,
    isLoading
  };
};
