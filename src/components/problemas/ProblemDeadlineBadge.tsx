
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X } from 'lucide-react'; // Importamos os ícones

type ProblemDeadlineProps = {
  deadline: string | null;
  isResolved?: boolean;
  resolvedOnTime?: boolean;
};

export const ProblemDeadlineBadge: React.FC<ProblemDeadlineProps> = ({ 
  deadline, 
  isResolved = false,
  resolvedOnTime
}) => {
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

  // Renderiza o ícone apropriado com base se foi resolvido no prazo ou não
  const renderStatusIcon = () => {
    // Só exibe ícones para problemas resolvidos
    if (!isResolved) return null;
    
    if (resolvedOnTime === true) {
      return <Check className="w-4 h-4 text-green-600 ml-1" />;
    } else if (resolvedOnTime === false) {
      return <X className="w-4 h-4 text-red-600 ml-1" />;
    }
    
    return null;
  };

  return (
    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center justify-center">
      <span>{formatDeadline(deadline)}</span>
      {renderStatusIcon()}
    </div>
  );
};
