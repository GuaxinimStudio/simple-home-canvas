
import React from 'react';
import { Clock } from 'lucide-react';

interface ProblemTableHeaderProps {
  title?: string;
}

export const ProblemTableHeader: React.FC<ProblemTableHeaderProps> = ({ 
  title = "Problemas Recentes" 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <button className="text-sm text-resolve-green font-medium">Ver todos</button>
    </div>
  );
};
