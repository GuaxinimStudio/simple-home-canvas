
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ProblemDeadlineProps = {
  deadline: string | null;
};

export const ProblemDeadlineBadge: React.FC<ProblemDeadlineProps> = ({ deadline }) => {
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'Não definido';
    
    try {
      return format(new Date(deadline), 'dd/MM/yy HH:mm', {
        locale: ptBR
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center justify-center">
      {formatDeadline(deadline)}
    </div>
  );
};
