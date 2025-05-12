
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Problema, RelatoriosStats, FiltrosRelatorios } from '@/hooks/relatorios/types';

// Componentes refatorados
import RelatoriosStatusCards from '@/components/RelatoriosStatusCards';
import RelatoriosGrafico from '@/components/RelatoriosGrafico';
import RelatoriosResolvidosPrazo from '@/components/RelatoriosResolvidosPrazo';
import RelatoriosTabela from '@/components/RelatoriosTabela';

interface RelatoriosContentProps {
  problemas: Problema[];
  stats: RelatoriosStats;
  isLoading: boolean;
}

const RelatoriosContent: React.FC<RelatoriosContentProps> = ({ 
  problemas, 
  stats, 
  isLoading 
}) => {
  return (
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
  );
};

export default RelatoriosContent;
