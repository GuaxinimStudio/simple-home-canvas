
import { useState, useEffect } from 'react';
import { Problema, RelatoriosStats, FiltrosRelatorios } from './relatorios/types';
import { calcularEstatisticas } from './relatorios/utils';
import { useFetchProblemas } from './relatorios/useFetchProblemas';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Exportar os tipos para manter a compatibilidade com código existente
export type { Problema, RelatoriosStats, FiltrosRelatorios };

export const useRelatoriosData = () => {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [stats, setStats] = useState<RelatoriosStats>({
    pendentes: 0,
    emAndamento: 0,
    resolvidos: 0,
    informacoesInsuficientes: 0,
    total: 0,
    resolvidosNoPrazo: 0,
    totalResolvidos: 0,
  });
  
  const { fetchProblemas, isLoading } = useFetchProblemas();
  const { user } = useAuth();
  const [gabineteId, setGabineteId] = useState<string | null>(null);
  const [carregandoGabinete, setCarregandoGabinete] = useState<boolean>(true);
  
  const [filtros, setFiltros] = useState<FiltrosRelatorios>({
    textoBusca: '',
    secretaria: null,
    status: null,
    tipoFiltro: 'mes_ano',
    mes: new Date().getMonth() + 1 + '',
    ano: new Date().getFullYear() + '',
    dataInicio: undefined,
    dataFim: undefined,
  });

  // Buscar o gabinete_id do usuário logado
  useEffect(() => {
    const buscarGabineteUsuario = async () => {
      if (!user?.id) return;
      
      try {
        setCarregandoGabinete(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Para vereadores, filtramos apenas pelo gabinete deles
        // Para administradores, não filtramos por gabinete (mostramos todos)
        if (data.role === 'vereador' && data.gabinete_id) {
          setGabineteId(data.gabinete_id);
        } else if (data.role === 'administrador') {
          // Não definimos gabineteId, indicando que todos os gabinetes devem ser mostrados
          setGabineteId(null);
        }
      } catch (error) {
        console.error('Erro ao buscar gabinete do usuário:', error);
      } finally {
        setCarregandoGabinete(false);
      }
    };
    
    buscarGabineteUsuario();
  }, [user?.id]);

  const limparFiltros = () => {
    setFiltros({
      textoBusca: '',
      secretaria: null,
      status: null,
      tipoFiltro: 'mes_ano',
      mes: new Date().getMonth() + 1 + '',
      ano: new Date().getFullYear() + '',
      dataInicio: undefined,
      dataFim: undefined,
    });
  };

  useEffect(() => {
    const buscarDados = async () => {
      if (carregandoGabinete) return; // Não buscar até sabermos o gabinete
      
      const problemasData = await fetchProblemas(filtros, gabineteId || undefined);
      setProblemas(problemasData);
      
      // Calcular estatísticas
      const estatisticas = calcularEstatisticas(problemasData);
      setStats(estatisticas);
    };
    
    buscarDados();
  }, [filtros, gabineteId, carregandoGabinete]);

  return {
    problemas,
    stats,
    isLoading: isLoading || carregandoGabinete,
    filtros,
    setFiltros,
    limparFiltros,
    gabineteId
  };
};
