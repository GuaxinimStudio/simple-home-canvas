
import React from 'react';
import { Clock, Check, CircleHelp } from 'lucide-react';

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

const RelatoriosStatusCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard 
        title="Pendentes" 
        count={3} 
        icon={<Clock className="h-5 w-5 text-amber-600" />} 
        iconColor="bg-amber-100" 
        bgColor="bg-amber-50"
      />
      
      <StatusCard 
        title="Em Andamento" 
        count={0} 
        icon={<Clock className="h-5 w-5 text-blue-600" />} 
        iconColor="bg-blue-100" 
        bgColor="bg-blue-50"
      />
      
      <StatusCard 
        title="Resolvidos" 
        count={3} 
        icon={<Check className="h-5 w-5 text-green-600" />} 
        iconColor="bg-green-100" 
        bgColor="bg-green-50"
      />
      
      <StatusCard 
        title="Informações Insuficientes" 
        count={0} 
        icon={<CircleHelp className="h-5 w-5 text-purple-600" />} 
        iconColor="bg-purple-100" 
        bgColor="bg-purple-50"
      />
    </div>
  );
};

export default RelatoriosStatusCards;
