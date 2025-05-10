
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Sidebar from '../components/Sidebar';

// Componentes refatorados
import RelatoriosFiltros from '../components/RelatoriosFiltros';
import RelatoriosStatusCards from '../components/RelatoriosStatusCards';
import RelatoriosGrafico from '../components/RelatoriosGrafico';
import RelatoriosResolvidosPrazo from '../components/RelatoriosResolvidosPrazo';
import RelatoriosTabela from '../components/RelatoriosTabela';

const Relatorios: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Seção de Filtros */}
          <RelatoriosFiltros />
          
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
              <RelatoriosStatusCards />
              
              {/* Gráficos e Estatísticas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RelatoriosGrafico />
                <RelatoriosResolvidosPrazo />
              </div>
            </TabsContent>
            
            <TabsContent value="detalhada">
              <RelatoriosTabela />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
