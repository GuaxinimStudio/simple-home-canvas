
import React from 'react';
import { Problema, RelatoriosStats } from '@/hooks/relatorios/types';
import { FiltrosRelatorios } from '@/components/relatorios/types';

interface RelatorioImpressaoProps {
  problemas: Problema[];
  stats: RelatoriosStats;
  filtros: FiltrosRelatorios;
  dataGeracao: string;
}

// Função para gerar o HTML do relatório
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

  // Gerar o conteúdo do relatório
  return `
    <div class="header">
      <h1>Relatório de Problemas</h1>
      <p>Período: ${obterTextoPeriodo()}</p>
      <p class="date">Gerado em: ${dataGeracao}</p>
    </div>

    <div class="status-cards">
      <div class="status-card pendente">
        <h3 class="status-title">Pendentes</h3>
        <p class="status-count">${stats.pendentes}</p>
        <p class="status-percent">${calculaPorcentagem(stats.pendentes, stats.total)} do total</p>
      </div>
      
      <div class="status-card andamento">
        <h3 class="status-title">Em Andamento</h3>
        <p class="status-count">${stats.emAndamento}</p>
        <p class="status-percent">${calculaPorcentagem(stats.emAndamento, stats.total)} do total</p>
      </div>
      
      <div class="status-card resolvido">
        <h3 class="status-title">Resolvidos</h3>
        <p class="status-count">${stats.resolvidos}</p>
        <p class="status-percent">${calculaPorcentagem(stats.resolvidos, stats.total)} do total</p>
      </div>
      
      <div class="status-card insuficiente">
        <h3 class="status-title">Inf. Insuf.</h3>
        <p class="status-count">${stats.informacoesInsuficientes}</p>
        <p class="status-percent">${calculaPorcentagem(stats.informacoesInsuficientes, stats.total)} do total</p>
      </div>
    </div>

    <h2>Métricas de Desempenho</h2>
    
    <div class="metrics">
      <div class="metric-card">
        <h3 class="metric-title">Resolvidos no Prazo</h3>
        <p class="metric-value">${
          stats.totalResolvidos > 0 
            ? `${Math.round((stats.resolvidosNoPrazo / stats.totalResolvidos) * 100)}%` 
            : '0%'
        }</p>
        <p class="metric-info">${stats.resolvidosNoPrazo} de ${stats.totalResolvidos} problemas</p>
      </div>
      
      <div class="metric-card">
        <h3 class="metric-title">Média de Atraso</h3>
        <p class="metric-value">${calculaMediaAtraso()}</p>
        <p class="metric-info">dias em média</p>
      </div>
    </div>

    <h2>Detalhes dos Problemas</h2>
    
    ${problemas.map((problema, index) => `
      ${index > 0 && (index % 2 === 0) ? '<div class="page-break"></div>' : ''}
      
      <div class="problema-title">
        Problema #${index + 1}
        <span class="problema-status">${problema.status}</span>
        <span class="problema-data">Data de registro: ${problema.data}</span>
      </div>
      
      <div class="problema-content">
        <div class="problema-row">
          <div class="problema-label">Município:</div>
          <div class="problema-value">${problema.municipio || '-'}</div>
        </div>
        
        <div class="problema-row">
          <div class="problema-label">Telefone:</div>
          <div class="problema-value">${problema.telefone || '-'}</div>
        </div>
        
        <div class="problema-row">
          <div class="problema-label">Prazo estimado:</div>
          <div class="problema-value">${
            problema.prazo_estimado 
              ? new Date(problema.prazo_estimado).toLocaleDateString('pt-BR') 
              : '-'
          }</div>
        </div>
        
        <div class="problema-row">
          <div class="problema-label">Alterações de prazo:</div>
          <div class="problema-value">${problema.prazo_alteracoes || '0'}</div>
        </div>
        
        ${problema.status === 'Resolvido' ? `
          <div class="problema-row">
            <div class="problema-label">Última atualização:</div>
            <div class="problema-value">${problema.updated_at ? new Date(problema.updated_at).toLocaleDateString('pt-BR') : '-'}</div>
          </div>
          
          <div class="problema-row">
            <div class="problema-label">Resolvido no prazo:</div>
            <div class="problema-value">${problema.resolvido_no_prazo ? 'Sim' : 'Não'}</div>
          </div>
        ` : ''}
        
        <div class="problema-descricao">
          <div class="problema-descricao-label">Descrição:</div>
          <div>${problema.descricao || 'Sem descrição'}</div>
        </div>
        
        ${problema.status === 'Resolvido' && problema.descricao_resolvido ? `
          <div class="solucao-box">
            <div class="solucao-titulo">Solução Implementada</div>
            <div>${problema.descricao_resolvido}</div>
          </div>
        ` : ''}
      </div>
    `).join('')}
    
    <div class="footer">
      <p>Relatório gerado automaticamente pelo sistema de gestão de problemas em ${dataGeracao}</p>
    </div>
  `;
};

export default RelatorioImpressao;
