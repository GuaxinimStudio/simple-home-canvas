
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RelatoriosStats } from '@/hooks/useRelatoriosData';

interface RelatoriosResolvidosPrazoProps {
  stats: RelatoriosStats;
  isLoading: boolean;
}

const RelatoriosResolvidosPrazo: React.FC<RelatoriosResolvidosPrazoProps> = ({ stats, isLoading }) => {
  const porcentagem = stats && stats.totalResolvidos > 0 
    ? Math.round((stats.resolvidosNoPrazo / stats.totalResolvidos) * 100) 
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Resolvidos no Prazo</h3>
          <div className="flex flex-col items-center justify-center h-64 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
            <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Resolvidos no Prazo</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500">Nenhum dado disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Resolvidos no Prazo</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-5xl font-bold text-gray-800">{porcentagem}%</div>
          <p className="text-gray-500 mt-2">
            {stats.resolvidosNoPrazo} de {stats.totalResolvidos} problemas
          </p>
          <div className="w-full max-w-xs mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${porcentagem}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosResolvidosPrazo;
