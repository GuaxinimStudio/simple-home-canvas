
import React from 'react';
import StatusCard from '../StatusCard';
import DonutChart from '../DonutChart';
import { PieChart } from 'lucide-react';
import { GabineteDistribution } from '@/hooks/useGabineteDistribution';

type GabineteDistributionCardProps = {
  distribution: GabineteDistribution[];
  isLoading: boolean;
};

const GabineteDistributionCard: React.FC<GabineteDistributionCardProps> = ({ 
  distribution, 
  isLoading 
}) => {
  return (
    <StatusCard 
      icon={<PieChart className="h-5 w-5" />}
      title="Distribuição por Gabinete"
      count={distribution.length.toString()}
      badge={{ 
        text: `${distribution.length} Gabinetes`, 
        color: "bg-resolve-lightgreen text-resolve-green" 
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : distribution.length > 0 ? (
        <div className="flex flex-col items-center">
          <DonutChart 
            data={distribution.map(item => ({
              name: item.gabinete,
              value: item.count,
              color: item.color
            }))} 
            centerText="100%" 
            centerSubtext="Total"
            size={140}
          />
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {distribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs ml-1">
                  {item.gabinete.length > 15 
                    ? `${item.gabinete.substring(0, 15)}... (${Math.round(item.percentage)}%)`
                    : `${item.gabinete} (${Math.round(item.percentage)}%)`
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Nenhum problema atribuído a gabinetes</p>
        </div>
      )}
    </StatusCard>
  );
};

export default GabineteDistributionCard;
