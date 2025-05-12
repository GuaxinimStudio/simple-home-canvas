
import React from 'react';
import StatusCard from '../StatusCard';
import { Calendar } from 'lucide-react';
import { ReportedProblems } from '@/hooks/useReportedProblems';

type ReportedProblemsCardProps = {
  stats: ReportedProblems;
  isLoading: boolean;
};

const ReportedProblemsCard: React.FC<ReportedProblemsCardProps> = ({ 
  stats, 
  isLoading 
}) => {
  return (
    <StatusCard 
      icon={<Calendar className="h-5 w-5" />}
      title="Problemas Reportados"
      count={stats.total.toString()}
      badge={{ text: "Estatísticas", color: "bg-resolve-lightgreen text-resolve-green" }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-2 w-full gap-3">
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Hoje</p>
              <p className="text-xl font-medium mt-1">{stats.today}</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Semana</p>
              <p className="text-xl font-medium mt-1">{stats.week}</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Mês</p>
              <p className="text-xl font-medium mt-1">{stats.month}</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-medium mt-1">{stats.total}</p>
            </div>
          </div>
        </div>
      )}
    </StatusCard>
  );
};

export default ReportedProblemsCard;
