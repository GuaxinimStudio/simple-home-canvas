
import React from 'react';
import { Clock, Check, CircleHelp } from 'lucide-react';
import { RelatoriosStats } from '@/hooks/useRelatoriosData';

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
};

const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon, iconColor, bgColor }) => (
  <div className={`p-6 rounded-lg ${bgColor}`}>
    <div className="flex justify-between items-start mb-8">
      <span className="text-lg font-medium">{title}</span>
      <div className={`rounded-full p-2 ${iconColor}`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-semibold">{count}</div>
  </div>
);

interface RelatoriosStatusCardsProps {
  stats: RelatoriosStats;
  isLoading: boolean;
}

const RelatoriosStatusCards: React.FC<RelatoriosStatusCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-6 rounded-lg bg-gray-50 animate-pulse h-32"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard 
        title="Pendentes" 
        count={stats.pendentes} 
        icon={<Clock className="h-5 w-5 text-amber-600" />} 
        iconColor="bg-amber-100" 
        bgColor="bg-amber-50"
      />
      
      <StatusCard 
        title="Em Andamento" 
        count={stats.emAndamento} 
        icon={<Clock className="h-5 w-5 text-blue-600" />} 
        iconColor="bg-blue-100" 
        bgColor="bg-blue-50"
      />
      
      <StatusCard 
        title="Resolvidos" 
        count={stats.resolvidos} 
        icon={<Check className="h-5 w-5 text-green-600" />} 
        iconColor="bg-green-100" 
        bgColor="bg-green-50"
      />
      
      <StatusCard 
        title="Informações Insuficientes" 
        count={stats.informacoesInsuficientes} 
        icon={<CircleHelp className="h-5 w-5 text-purple-600" />} 
        iconColor="bg-purple-100" 
        bgColor="bg-purple-50"
      />
    </div>
  );
};

export default RelatoriosStatusCards;
