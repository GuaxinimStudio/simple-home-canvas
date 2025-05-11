
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

// Componentes refatorados
import RelatoriosFiltros from '../components/RelatoriosFiltros';
import RelatoriosStatusCards from '../components/RelatoriosStatusCards';
import RelatoriosGrafico from '../components/RelatoriosGrafico';
import RelatoriosResolvidosPrazo from '../components/RelatoriosResolvidosPrazo';
import RelatoriosTabela from '../components/RelatoriosTabela';
import VisualizacaoRelatorio from '../components/relatorios/VisualizacaoRelatorio';
import RelatorioImpressao from '../components/relatorios/RelatorioImpressao';

// Hook personalizado para gerenciar dados dos relatórios
import { useRelatoriosData } from '@/hooks/useRelatoriosData';
import { FiltrosRelatorios } from '@/components/relatorios/types';

const Relatorios: React.FC = () => {
  const { 
    problemas, 
    stats, 
    isLoading, 
    filtros, 
    setFiltros,
    limparFiltros 
  } = useRelatoriosData();
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFiltrosChange = (novosFiltros: FiltrosRelatorios) => {
    setFiltros(novosFiltros);
  };
  
  const handleVisualizarRelatorio = () => {
    setIsPreviewOpen(true);
  };
  
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
      
      setIsPreviewOpen(false);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório. Tente novamente.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Relatórios</h1>
            
            <Button 
              onClick={handleVisualizarRelatorio}
              className="bg-resolve-green hover:bg-green-600"
              disabled={isLoading || problemas.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
          
          {/* Seção de Filtros */}
          <RelatoriosFiltros 
            filtros={filtros} 
            onFiltrosChange={handleFiltrosChange}
            onLimparFiltros={limparFiltros}
          />
          
          {/* Tabs de navegação */}
          <Tabs defaultValue="resumo" className="mb-6">
            <TabsList className="bg-white border w-full justify-start p-0 h-auto">
              <TabsTrigger 
                value="resumo" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-resolve-green data-[state=active]:border-b-2 data-[state=active]:border-resolve-green rounded-none px-6 py-3"
              >
                Resumo
              </TabsTrigger>
              <TabsTrigger 
                value="detalhada" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-resolve-green data-[state=active]:border-b-2 data-[state=active]:border-resolve-green rounded-none px-6 py-3"
              >
                Tabela Detalhada
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="mt-4">
              {/* Cards de status */}
              <RelatoriosStatusCards stats={stats} isLoading={isLoading} />
              
              {/* Gráficos e Estatísticas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RelatoriosGrafico problemas={problemas} isLoading={isLoading} />
                <RelatoriosResolvidosPrazo stats={stats} isLoading={isLoading} />
              </div>
            </TabsContent>
            
            <TabsContent value="detalhada">
              <RelatoriosTabela problemas={problemas} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Modal de visualização do relatório */}
      <VisualizacaoRelatorio
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        problemas={problemas}
        stats={stats}
        filtros={filtros}
        onConfirmarExportacao={handleGerarRelatorio}
      />
    </div>
  );
};

export default Relatorios;
