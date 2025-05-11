
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
      
      // Criar string CSV
      let csv = 'Data,Município,Status,Prazo,Resolvido no Prazo,Dias de Atraso,Alterações de Prazo\n';
      
      problemas.forEach((problema) => {
        const linha = [
          problema.data,
          problema.municipio || '-',
          problema.status,
          problema.prazo_estimado ? new Date(problema.prazo_estimado).toLocaleDateString('pt-BR') : '-',
          problema.resolvido_no_prazo !== null ? (problema.resolvido_no_prazo ? 'Sim' : 'Não') : '-',
          problema.dias_atraso_resolucao !== null ? problema.dias_atraso_resolucao : '-',
          problema.prazo_alteracoes || '0'
        ].join(',');
        
        csv += linha + '\n';
      });
      
      // Criar blob e link para download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-problemas-${dataAtual}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
