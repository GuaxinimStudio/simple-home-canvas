
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TableRow, TableCell } from '@/components/ui/table';
import { ProblemStatusBadge } from './ProblemStatusBadge';
import { ProblemDeadlineBadge } from './ProblemDeadlineBadge';
import { calculateElapsedTime } from '@/utils/dateUtils';
import { ProblemItem } from './types';
import { ProblemImageModal } from './ProblemImageModal';

type ProblemRowProps = {
  problem: ProblemItem;
};

export const ProblemRow: React.FC<ProblemRowProps> = ({ problem }) => {
  const navigate = useNavigate();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', {
        locale: ptBR
      });
    } catch (e) {
      return dateString;
    }
  };

  // Método para formatar o tempo para problemas resolvidos
  const getTimeDisplay = () => {
    if (problem.status === 'Resolvido') {
      return (
        <span className="text-green-500">
          Resolvido após {calculateElapsedTime(problem.created_at, problem.updated_at)}
        </span>
      );
    }
    return (
      <span className="text-red-500">
        Em andamento há {calculateElapsedTime(problem.created_at)}
      </span>
    );
  };

  const handleViewProblem = (id: string) => {
    navigate(`/detalhes-ocorrencia/${id}`);
  };

  const getShortDescription = (desc: string) => {
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  const getInitials = (description: string) => {
    const words = description.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return description.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <TableRow>
        <TableCell className="w-16">
          <div 
            className="w-16 h-16 rounded-md overflow-hidden cursor-pointer"
            onClick={() => problem.foto_url && setIsImageModalOpen(true)}
          >
            {problem.foto_url ? (
              <img 
                src={problem.foto_url} 
                alt={problem.descricao.substring(0, 20)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-500">
                  {getInitials(problem.descricao)}
                </span>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="font-medium">{getShortDescription(problem.descricao)}</TableCell>
        <TableCell>
          <ProblemStatusBadge status={problem.status} />
        </TableCell>
        <TableCell className="text-sm">
          {getTimeDisplay()}
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

      {problem.foto_url && (
        <ProblemImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={problem.foto_url}
          description={problem.descricao}
        />
      )}
    </>
  );
};
