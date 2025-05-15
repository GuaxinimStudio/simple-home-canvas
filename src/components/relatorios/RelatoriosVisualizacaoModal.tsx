
import React from 'react';
import { Problema, RelatoriosStats } from '@/hooks/relatorios/types';
import VisualizacaoRelatorio from './visualizacao/VisualizacaoRelatorio';
import { toast } from 'sonner';
import { FiltrosRelatorios } from '@/hooks/relatorios/types';
import { gerarRelatorioPDF } from '@/services/pdfService';

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
  const handleGerarRelatorio = async () => {
    // Verificar se há dados antes de gerar o relatório
    if (problemas.length === 0) {
      toast.warning("Não há dados para gerar o relatório");
      return;
    }

    toast.success("Gerando relatório...");
    
    try {
      // Usar o serviço de geração de PDF
      await gerarRelatorioPDF(problemas, stats, filtros);
      
      // Fechar o modal e mostrar mensagem de sucesso
      onOpenChange(false);
      toast.success("Relatório baixado com sucesso!");
      
    } catch (error: any) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório: " + error.message);
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
