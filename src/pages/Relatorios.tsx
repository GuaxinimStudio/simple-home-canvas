
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Sidebar from '../components/Sidebar';

// Componentes refatorados
import RelatoriosFiltros from '../components/RelatoriosFiltros';
import RelatoriosStatusCards from '../components/RelatoriosStatusCards';
import RelatoriosGrafico from '../components/RelatoriosGrafico';
import RelatoriosResolvidosPrazo from '../components/RelatoriosResolvidosPrazo';
import RelatoriosTabela from '../components/RelatoriosTabela';

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

  const handleFiltrosChange = (novosFiltros: FiltrosRelatorios) => {
    setFiltros(novosFiltros);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
          
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
    </div>
  );
};

export default Relatorios;
