
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

// Hook customizado para gerenciar dados dos relatórios
import { useRelatoriosData } from '@/hooks/useRelatoriosData';
import { FiltrosRelatorios } from '@/components/relatorios/types';

// Componentes refatorados
import RelatoriosFiltros from '@/components/RelatoriosFiltros';
import RelatoriosHeader from '@/components/relatorios/RelatoriosHeader';
import RelatoriosContent from '@/components/relatorios/RelatoriosContent';
import RelatoriosVisualizacaoModal from '@/components/relatorios/RelatoriosVisualizacaoModal';

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho da página */}
          <RelatoriosHeader 
            isLoading={isLoading}
            problemaCount={problemas.length}
            onVisualizarRelatorio={handleVisualizarRelatorio}
          />
          
          {/* Seção de Filtros */}
          <RelatoriosFiltros 
            filtros={filtros} 
            onFiltrosChange={handleFiltrosChange}
            onLimparFiltros={limparFiltros}
          />
          
          {/* Conteúdo principal com tabs */}
          <RelatoriosContent 
            problemas={problemas}
            stats={stats}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Modal de visualização do relatório */}
      <RelatoriosVisualizacaoModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        problemas={problemas}
        stats={stats}
        filtros={filtros}
      />
    </div>
  );
};

export default Relatorios;
