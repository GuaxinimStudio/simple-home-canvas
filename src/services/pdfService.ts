
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Problema, RelatoriosStats, FiltrosRelatorios } from '@/hooks/relatorios/types';

// Função para calcular porcentagens
const calculaPorcentagem = (valor: number, total: number) => {
  if (total === 0) return '0%';
  return `${Math.round((valor / total) * 100)}%`;
};

// Calcular média de atraso
const calculaMediaAtraso = (problemas: Problema[]) => {
  const problemasComAtraso = problemas.filter(p => p.dias_atraso_resolucao !== null && p.dias_atraso_resolucao > 0);
  
  if (problemasComAtraso.length === 0) return 0;
  
  const somaAtrasos = problemasComAtraso.reduce((soma, p) => soma + (p.dias_atraso_resolucao || 0), 0);
  return Math.round(somaAtrasos / problemasComAtraso.length);
};

// Formatar texto de período para exibição
const obterTextoPeriodo = (filtros: FiltrosRelatorios) => {
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

export const gerarRelatorioPDF = (problemas: Problema[], stats: RelatoriosStats, filtros: FiltrosRelatorios): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Verificar se há dados antes de gerar o relatório
      if (problemas.length === 0) {
        throw new Error("Não há dados para gerar o relatório");
      }
      
      // Preparar dados para exportação
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      
      // Criar instância do jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Adicionar título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Problemas', 105, 20, { align: 'center' });
      
      // Obter texto do período
      const textoPeriodo = obterTextoPeriodo(filtros);
      doc.setFontSize(12);
      doc.text(`Período: ${textoPeriodo}`, 105, 30, { align: 'center' });
      doc.text(`Gerado em: ${dataAtual}`, 105, 35, { align: 'center' });
      
      // Adicionar estatísticas de status
      doc.setFontSize(14);
      doc.text('Estatísticas por Status', 20, 45);
      
      // Tabela de estatísticas
      const statusHeaders = [['Status', 'Quantidade', 'Porcentagem']];
      const statusRows = [
        ['Pendentes', stats.pendentes.toString(), calculaPorcentagem(stats.pendentes, stats.total)],
        ['Em Andamento', stats.emAndamento.toString(), calculaPorcentagem(stats.emAndamento, stats.total)],
        ['Resolvidos', stats.resolvidos.toString(), calculaPorcentagem(stats.resolvidos, stats.total)],
        ['Info. Insuficientes', stats.informacoesInsuficientes.toString(), calculaPorcentagem(stats.informacoesInsuficientes, stats.total)],
        ['Total', stats.total.toString(), '100%']
      ];
      
      (doc as any).autoTable({
        head: statusHeaders,
        body: statusRows,
        startY: 50,
        theme: 'grid',
        headStyles: {
          fillColor: [76, 175, 80],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      // Métricas de desempenho
      const lastY = (doc as any).lastAutoTable.finalY || 50;
      doc.text('Métricas de Desempenho', 20, lastY + 15);
      
      // Calcular métricas
      const resolvidosNoPrazoPercent = stats.totalResolvidos > 0 
        ? Math.round((stats.resolvidosNoPrazo / stats.totalResolvidos) * 100)
        : 0;
      
      const mediaAtraso = calculaMediaAtraso(problemas);
      
      const metricsHeaders = [['Métrica', 'Valor']];
      const metricsRows = [
        ['Resolvidos no Prazo', `${resolvidosNoPrazoPercent}% (${stats.resolvidosNoPrazo} de ${stats.totalResolvidos})`],
        ['Média de Atraso', `${mediaAtraso} dias`]
      ];
      
      (doc as any).autoTable({
        head: metricsHeaders,
        body: metricsRows,
        startY: lastY + 20,
        theme: 'grid',
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: 255
        }
      });
      
      // Detalhes dos problemas - um por página
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Detalhes dos Problemas', 105, 20, { align: 'center' });
      
      // Adicionar cada problema em páginas separadas
      let currentY = 30;
      let problemIndex = 1;
      
      for (const problema of problemas) {
        // Se não há espaço suficiente para o problema atual, adicionar nova página
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 101, 52); // Verde escuro
        doc.text(`Problema #${problemIndex} - ${problema.status}`, 20, currentY);
        currentY += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Data de registro: ${problema.data}`, 20, currentY);
        currentY += 10;
        
        // Tabela com os detalhes do problema
        const problemData = [
          ['Município', problema.municipio || '-'],
          ['Telefone', problema.telefone || '-'],
          ['Prazo estimado', problema.prazo_estimado 
            ? new Date(problema.prazo_estimado).toLocaleDateString('pt-BR') 
            : '-']
        ];
        
        if (problema.status === 'Resolvido') {
          problemData.push(
            ['Última atualização', problema.updated_at ? new Date(problema.updated_at).toLocaleDateString('pt-BR') : '-'],
            ['Resolvido no prazo', problema.resolvido_no_prazo ? 'Sim' : 'Não']
          );
        }
        
        (doc as any).autoTable({
          body: problemData,
          startY: currentY,
          theme: 'plain',
          styles: {
            cellPadding: 3,
            fontSize: 10
          },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
            1: { cellWidth: 140 }
          }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 10;
        
        // Descrição do problema
        doc.setFont('helvetica', 'bold');
        doc.text('Descrição:', 20, currentY);
        currentY += 7;
        
        doc.setFont('helvetica', 'normal');
        const descricaoSplit = doc.splitTextToSize(problema.descricao || 'Sem descrição', 170);
        doc.text(descricaoSplit, 20, currentY);
        currentY += descricaoSplit.length * 5 + 10;
        
        // Solução (se resolvido)
        if (problema.status === 'Resolvido' && problema.descricao_resolvido) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(34, 197, 94); // Verde
          doc.text('Solução Implementada:', 20, currentY);
          currentY += 7;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const solucaoSplit = doc.splitTextToSize(problema.descricao_resolvido, 170);
          doc.text(solucaoSplit, 20, currentY);
          currentY += solucaoSplit.length * 5 + 15;
        }
        
        // Adicionar espaço ou nova página entre problemas
        if (problemIndex < problemas.length) {
          if (currentY > 250) {
            doc.addPage();
            currentY = 20;
          } else {
            doc.line(20, currentY, 190, currentY);
            currentY += 15;
          }
        }
        
        problemIndex++;
      }
      
      // Adicionar rodapé
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Relatório gerado automaticamente pelo sistema de gestão de problemas em ${dataAtual}`, 105, 285, { align: 'center' });
      
      // Salvar o PDF
      doc.save(`Relatório_${dataAtual.replace(/\//g, '-')}.pdf`);
      
      resolve();
    } catch (error: any) {
      console.error("Erro ao gerar relatório:", error);
      reject(error);
    }
  });
};
