
import React from 'react';
import { RelatoriosStats } from '@/hooks/relatorios/types';

interface EstatisticasRelatorioProps {
  stats: RelatoriosStats;
}

const EstatisticasRelatorio: React.FC<EstatisticasRelatorioProps> = ({ stats }) => {
  const calculaPorcentagem = (valor: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((valor / total) * 100)}%`;
  };
  
  return (
    <>
      <div>
        <h3 className="text-sm font-medium mb-3">Estatísticas do Relatório:</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-600 mb-1">Total de problemas:</p>
            <p className="text-2xl font-medium text-blue-600">{stats.total}</p>
          </div>
          
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-600 mb-1">Pendentes:</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-medium text-yellow-600 mr-2">{stats.pendentes}</p>
              <span className="text-sm text-gray-500">({calculaPorcentagem(stats.pendentes, stats.total)})</span>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-600 mb-1">Em Andamento:</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-medium text-blue-600 mr-2">{stats.emAndamento}</p>
              <span className="text-sm text-gray-500">({calculaPorcentagem(stats.emAndamento, stats.total)})</span>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <p className="text-sm text-gray-600 mb-1">Resolvidos:</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-medium text-green-600 mr-2">{stats.resolvidos}</p>
              <span className="text-sm text-gray-500">({calculaPorcentagem(stats.resolvidos, stats.total)})</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded-md p-3">
          <p className="text-sm text-gray-600 mb-1">Resolvidos no Prazo:</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-medium text-green-600 mr-2">
              {stats.totalResolvidos > 0 
                ? `${Math.round((stats.resolvidosNoPrazo / stats.totalResolvidos) * 100)}%` 
                : '0%'}
            </p>
            <span className="text-sm text-gray-500">
              ({stats.resolvidosNoPrazo} de {stats.totalResolvidos})
            </span>
          </div>
        </div>
        
        <div className="border rounded-md p-3">
          <p className="text-sm text-gray-600 mb-1">Média de Atraso:</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-medium text-red-600 mr-2">
              {calculaMediaAtraso(stats)}
            </p>
            <span className="text-sm text-gray-500">dias em média</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Função para calcular média de atraso
const calculaMediaAtraso = (stats: RelatoriosStats) => {
  if (stats.totalResolvidos === 0) return 0;
  
  // Esta função deve ser implementada com base na lógica existente
  // Normalmente seria calculada a partir dos problemas originais
  return stats.diasAtrasoMedio || 0;
};

export default EstatisticasRelatorio;
