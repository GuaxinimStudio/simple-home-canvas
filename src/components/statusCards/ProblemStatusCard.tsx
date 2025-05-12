
import React from 'react';
import StatusCard from '../StatusCard';
import DonutChart from '../DonutChart';
import { ListFilter } from 'lucide-react';
import { ProblemStats } from '@/hooks/useProblemsStats';

type ProblemStatusCardProps = {
  stats: ProblemStats;
  isLoading: boolean;
};

const ProblemStatusCard: React.FC<ProblemStatusCardProps> = ({ stats, isLoading }) => {
  // Transformar dados para o gráfico de status
  const problemStatusData = [
    { name: 'Pendentes', value: stats.pendentes, color: '#F5B74F' },
    { name: 'Em andamento', value: stats.emAndamento, color: '#5D5FEF' },
    { name: 'Resolvidos', value: stats.resolvidos, color: '#3BA676' },
    { name: 'Insuficientes', value: stats.insuficientes, color: '#FF8585' },
  ].filter(item => item.value > 0);

  return (
    <StatusCard 
      icon={<ListFilter className="h-5 w-5" />}
      title="Status dos Problemas"
      count={stats.total.toString()}
      badge={{ 
        text: `Total: ${stats.total}`, 
        color: "bg-resolve-lightgreen text-resolve-green" 
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : problemStatusData.length > 0 ? (
        <div className="flex flex-col items-center">
          <DonutChart 
            data={problemStatusData} 
            centerText={stats.total.toString()} 
            centerSubtext="Total"
            size={140}
          />
          <div className="flex gap-4 mt-3 flex-wrap justify-center">
            {stats.pendentes > 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#F5B74F] mr-2"></div>
                <span className="text-xs">{stats.pendentes} Pendentes</span>
              </div>
            )}
            {stats.emAndamento > 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#5D5FEF] mr-2"></div>
                <span className="text-xs">{stats.emAndamento} Em andamento</span>
              </div>
            )}
            {stats.resolvidos > 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3BA676] mr-2"></div>
                <span className="text-xs">{stats.resolvidos} Resolvidos</span>
              </div>
            )}
            {stats.insuficientes > 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FF8585] mr-2"></div>
                <span className="text-xs">{stats.insuficientes} Insuf.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Nenhum problema registrado</p>
        </div>
      )}
    </StatusCard>
  );
};

export default ProblemStatusCard;
