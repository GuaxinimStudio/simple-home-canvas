
import React from 'react';
import { Problema, RelatoriosStats } from '@/hooks/relatorios/types';
import { FiltrosRelatorios } from '@/components/relatorios/types';

interface RelatorioImpressaoProps {
  problemas: Problema[];
  stats: RelatoriosStats;
  filtros: FiltrosRelatorios;
  dataGeracao: string;
}

// Função para gerar o HTML do relatório (mantida para compatibilidade)
const RelatorioImpressao = ({ problemas, stats, filtros, dataGeracao }: RelatorioImpressaoProps) => {
  // Formatar texto de período para exibição
  const obterTextoPeriodo = () => {
    if (filtros.tipoFiltro === 'mes_ano') {
      if (!filtros.mes || !filtros.ano) return 'Todo o período';
      
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      const mesIndex = parseInt(filtros.mes, 10) - 1;
      const nomeMes = meses[mesIndex];
      
      return `${nomeMes} de ${filtros.ano}`;
    } else {
      if (!filtros.dataInicio && !filtros.dataFim) return 'Todo o período';
      
      if (filtros.dataInicio && !filtros.dataFim) {
        return `A partir de ${filtros.dataInicio.toLocaleDateString('pt-BR')}`;
      }
      
      if (!filtros.dataInicio && filtros.dataFim) {
        return `Até ${filtros.dataFim.toLocaleDateString('pt-BR')}`;
      }
      
      return `De ${filtros.dataInicio?.toLocaleDateString('pt-BR')} até ${filtros.dataFim?.toLocaleDateString('pt-BR')}`;
    }
  };

  // Calcular porcentagens
  const calculaPorcentagem = (valor: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((valor / total) * 100)}%`;
  };

  // Calcular média de atraso
  const calculaMediaAtraso = () => {
    const problemasComAtraso = problemas.filter(p => p.dias_atraso_resolucao !== null && p.dias_atraso_resolucao > 0);
    
    if (problemasComAtraso.length === 0) return 0;
    
    const somaAtrasos = problemasComAtraso.reduce((soma, p) => soma + (p.dias_atraso_resolucao || 0), 0);
    return Math.round(somaAtrasos / problemasComAtraso.length);
  };

  // Este componente agora retorna apenas o string vazio, pois a geração do relatório é feita diretamente via jsPDF
  return '';
};

export default RelatorioImpressao;
