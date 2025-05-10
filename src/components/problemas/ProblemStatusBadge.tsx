
import React from 'react';
import { Badge } from '@/components/ui/badge';

type ProblemStatusProps = {
  status: string;
};

export const ProblemStatusBadge: React.FC<ProblemStatusProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'resolvido':
        return "bg-resolve-lightgreen text-resolve-green";
      case 'pendente':
        return "bg-yellow-100 text-yellow-700";
      case 'em andamento':
        return "bg-blue-100 text-blue-700";
      case 'informações insuficientes':
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'resolvido':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pendente':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case 'em andamento':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case 'informações insuficientes':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 8.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Badge className={`px-2.5 py-1 rounded-full text-xs flex items-center ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
};
