
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TableRow, TableCell } from '@/components/ui/table';
import { ProblemStatusBadge } from './ProblemStatusBadge';
import { ProblemDeadlineBadge } from './ProblemDeadlineBadge';
import { ProblemItem } from './types';

type ProblemRowProps = {
  problem: ProblemItem;
};

export const ProblemRow: React.FC<ProblemRowProps> = ({ problem }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', {
        locale: ptBR
      });
    } catch (e) {
      return dateString;
    }
  };

  const calculateTimeElapsed = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        locale: ptBR,
        addSuffix: true
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const handleViewProblem = (id: string) => {
    navigate(`/detalhes-ocorrencia/${id}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{problem.descricao}</TableCell>
      <TableCell>
        <ProblemStatusBadge status={problem.status} />
      </TableCell>
      <TableCell className="text-sm">
        {calculateTimeElapsed(problem.created_at)}
      </TableCell>
      <TableCell>
        <ProblemDeadlineBadge deadline={problem.prazo_estimado} />
      </TableCell>
      <TableCell className="text-sm">{formatDate(problem.created_at)}</TableCell>
      <TableCell className="text-sm">
        {problem.gabinete?.gabinete || 'Não atribuído'}
      </TableCell>
      <TableCell>
        <button 
          className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
          onClick={() => handleViewProblem(problem.id)}
        >
          <span className="sr-only">Ver detalhes</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </TableCell>
    </TableRow>
  );
};
