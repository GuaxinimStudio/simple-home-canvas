
import { useState, useEffect } from 'react';
import { Problema, RelatoriosStats, FiltrosRelatorios } from './relatorios/types';
import { calcularEstatisticas } from './relatorios/utils';
import { useFetchProblemas } from './relatorios/useFetchProblemas';

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
      const problemasData = await fetchProblemas(filtros);
      setProblemas(problemasData);
      
      // Calcular estatísticas
      const estatisticas = calcularEstatisticas(problemasData);
      setStats(estatisticas);
    };
    
    buscarDados();
  }, [filtros]);

  return {
    problemas,
    stats,
    isLoading,
    filtros,
    setFiltros,
    limparFiltros,
  };
};
