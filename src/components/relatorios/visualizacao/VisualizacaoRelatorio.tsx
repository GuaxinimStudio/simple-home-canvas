
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Problema, RelatoriosStats, FiltrosRelatorios } from '@/hooks/relatorios/types';

// Componentes menores
import FiltrosAplicados from './FiltrosAplicados';
import EstatisticasRelatorio from './EstatisticasRelatorio';
import ListaProblemas from './ListaProblemas';

interface VisualizacaoRelatorioProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  problemas: Problema[];
  stats: RelatoriosStats;
  filtros: FiltrosRelatorios;
  onConfirmarExportacao: () => void;
}

const VisualizacaoRelatorio: React.FC<VisualizacaoRelatorioProps> = ({ 
  isOpen, 
  onOpenChange, 
  problemas, 
  stats, 
  filtros,
  onConfirmarExportacao 
}) => {
  const [activeTab, setActiveTab] = useState<string>("resumo");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualização do Relatório</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="resumo" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="resumo" className="text-center">
              Resumo
            </TabsTrigger>
            <TabsTrigger value="problemas" className="text-center">
              Problemas ({problemas.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumo" className="space-y-6">
            <FiltrosAplicados filtros={filtros} />
            <EstatisticasRelatorio stats={stats} />
          </TabsContent>
          
          <TabsContent value="problemas" className="space-y-4">
            <ListaProblemas problemas={problemas} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={onConfirmarExportacao} 
            className="bg-green-500 hover:bg-green-600"
          >
            Confirmar Exportação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizacaoRelatorio;
