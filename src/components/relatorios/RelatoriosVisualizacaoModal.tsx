
import React from 'react';
import { Problema, RelatoriosStats, FiltrosRelatorios } from '@/hooks/relatorios/types';
import VisualizacaoRelatorio from './visualizacao/VisualizacaoRelatorio';
import { toast } from 'sonner';
import RelatorioImpressao from './RelatorioImpressao';

interface RelatoriosVisualizacaoModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  problemas: Problema[];
  stats: RelatoriosStats;
  filtros: FiltrosRelatorios;
}

const RelatoriosVisualizacaoModal: React.FC<RelatoriosVisualizacaoModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  problemas, 
  stats, 
  filtros 
}) => {
  const handleGerarRelatorio = () => {
    toast.success("Gerando relatório...");
    
    try {
      // Preparar dados para exportação
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      
      // Abrir nova janela com layout de impressão
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error("Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativado.");
        return;
      }
      
      // Gerar o conteúdo HTML para impressão
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Problemas - ${dataAtual}</title>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .date {
              color: #666;
              font-size: 14px;
            }
            .status-cards {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              flex-wrap: wrap;
            }
            .status-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              width: calc(25% - 15px);
              box-sizing: border-box;
              position: relative;
            }
            .status-card.pendente { border-left: 4px solid #fbbf24; }
            .status-card.andamento { border-left: 4px solid #3b82f6; }
            .status-card.resolvido { border-left: 4px solid #34d399; }
            .status-card.insuficiente { border-left: 4px solid #a855f7; }
            .status-title {
              font-size: 14px;
              font-weight: normal;
              color: #555;
              margin: 0 0 10px 0;
            }
            .status-count {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .status-percent {
              font-size: 12px;
              color: #666;
              margin: 5px 0 0 0;
            }
            h2 {
              font-size: 18px;
              margin: 30px 0 15px 0;
              color: #444;
            }
            .metrics {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .metric-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              width: calc(50% - 10px);
            }
            .metric-title {
              font-size: 14px;
              margin: 0 0 10px 0;
              color: #555;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
              color: #22c55e;
            }
            .metric-info {
              font-size: 12px;
              color: #666;
              margin: 5px 0 0 0;
            }
            .problema-title {
              background-color: #e6f7ef;
              padding: 10px 15px;
              border-radius: 6px 6px 0 0;
              margin: 40px 0 0 0;
              font-size: 16px;
              font-weight: 500;
              color: #166534;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .problema-status {
              font-size: 12px;
              padding: 3px 10px;
              border-radius: 12px;
              background-color: #dcfce7;
              color: #166534;
            }
            .problema-data {
              color: #666;
              font-size: 12px;
              font-weight: normal;
            }
            .problema-content {
              border: 1px solid #ddd;
              border-radius: 0 0 6px 6px;
              padding: 15px;
              margin-top: 0;
            }
            .problema-row {
              display: flex;
              margin-bottom: 10px;
            }
            .problema-label {
              width: 150px;
              color: #666;
              font-size: 14px;
            }
            .problema-value {
              flex: 1;
              font-size: 14px;
            }
            .problema-descricao {
              margin-top: 15px;
              font-size: 14px;
            }
            .problema-descricao-label {
              color: #666;
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .solucao-box {
              border: 1px solid #22c55e;
              border-radius: 6px;
              padding: 15px;
              margin-top: 15px;
            }
            .solucao-titulo {
              color: #22c55e;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .page-break {
              page-break-after: always;
            }
            @media print {
              body {
                padding: 0;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div id="report-content"></div>
        </body>
        </html>
      `);
      
      // Renderizar o componente RelatorioImpressao para o documento
      const contentDiv = printWindow.document.getElementById('report-content');
      if (contentDiv && printWindow.document) {
        contentDiv.innerHTML = RelatorioImpressao({ 
          problemas, 
          stats, 
          filtros,
          dataGeracao: dataAtual
        });
        
        // Executar a impressão após carregar tudo
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      onOpenChange(false);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório. Tente novamente.");
    }
  };

  return (
    <VisualizacaoRelatorio
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      problemas={problemas}
      stats={stats}
      filtros={filtros}
      onConfirmarExportacao={handleGerarRelatorio}
    />
  );
};

export default RelatoriosVisualizacaoModal;
