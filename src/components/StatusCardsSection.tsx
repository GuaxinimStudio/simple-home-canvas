
import React from 'react';
import StatusCard from './StatusCard';
import DonutChart from './DonutChart';
import { ListFilter, PieChart, Calendar } from 'lucide-react';

type StatusCardsSectionProps = {
  problemStatusData: Array<{ name: string; value: number; color: string }>;
  secretaryDistributionData: Array<{ name: string; value: number; color: string }>;
};

const StatusCardsSection: React.FC<StatusCardsSectionProps> = ({ 
  problemStatusData, 
  secretaryDistributionData 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatusCard 
        icon={<ListFilter className="h-5 w-5" />}
        title="Status dos Problemas"
        count="6"
        badge={{ text: "Total: 6", color: "bg-resolve-lightgreen text-resolve-green" }}
      >
        <div className="flex flex-col items-center">
          <DonutChart 
            data={problemStatusData} 
            centerText="6" 
            centerSubtext="Total"
            size={140}
          />
          <div className="flex gap-4 mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-resolve-green mr-2"></div>
              <span className="text-xs">3 Resolvidos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-resolve-yellow mr-2"></div>
              <span className="text-xs">3 Pendentes</span>
            </div>
          </div>
        </div>
      </StatusCard>

      <StatusCard 
        icon={<PieChart className="h-5 w-5" />}
        title="Distribuição por Gabinete"
        count="3"
        badge={{ text: "3 Gabinetes", color: "bg-resolve-lightgreen text-resolve-green" }}
      >
        <div className="flex flex-col items-center">
          <DonutChart 
            data={secretaryDistributionData} 
            centerText="100%" 
            centerSubtext="Total"
            size={140}
          />
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FF8585] mr-1"></div>
              <span className="text-xs">Saúde (30%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#9061F9] mr-1"></div>
              <span className="text-xs">Obras (50%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#37A2B2] mr-1"></div>
              <span className="text-xs">Educação (20%)</span>
            </div>
          </div>
        </div>
      </StatusCard>

      <StatusCard 
        icon={<Calendar className="h-5 w-5" />}
        title="Problemas Reportados"
        count="21"
        badge={{ text: "Neste mês", color: "bg-resolve-lightgreen text-resolve-green" }}
      >
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-2 w-full gap-3">
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Hoje</p>
              <p className="text-xl font-medium mt-1">3</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Semana</p>
              <p className="text-xl font-medium mt-1">12</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Mês</p>
              <p className="text-xl font-medium mt-1">21</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-medium mt-1">54</p>
            </div>
          </div>
        </div>
      </StatusCard>
    </div>
  );
};

export default StatusCardsSection;
