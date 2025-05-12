
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface RelatoriosHeaderProps {
  isLoading: boolean;
  problemaCount: number;
  onVisualizarRelatorio: () => void;
}

const RelatoriosHeader: React.FC<RelatoriosHeaderProps> = ({ 
  isLoading, 
  problemaCount, 
  onVisualizarRelatorio 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      
      <Button 
        onClick={onVisualizarRelatorio}
        className="bg-resolve-green hover:bg-green-600"
        disabled={isLoading || problemaCount === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        Gerar Relatório
      </Button>
    </div>
  );
};

export default RelatoriosHeader;
