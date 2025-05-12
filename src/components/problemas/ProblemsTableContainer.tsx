
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@/components/ui/table';
import { ProblemsTableHeader } from './ProblemsTableHeader';
import { ProblemsTableBody } from './ProblemsTableBody';
import { ProblemItem } from './types';

type ProblemsTableContainerProps = {
  problems: ProblemItem[];
  isLoading: boolean;
  error: string | null;
};

export const ProblemsTableContainer: React.FC<ProblemsTableContainerProps> = ({ 
  problems, 
  isLoading, 
  error 
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Problemas Recentes</h3>
          </div>
        </div>
        <div className="w-full text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mb-3"></div>
          <p className="text-gray-500">Carregando problemas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-lg">Problemas Recentes</h3>
          </div>
        </div>
        <div className="w-full text-center py-8 text-red-500">
          <p>Erro ao carregar problemas. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }
  
  if (problems.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Problemas Recentes</h3>
          </div>
        </div>
        <div className="w-full text-center py-8">
          <p className="text-gray-500">
            Nenhum problema vinculado ao seu gabinete foi registrado ainda.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-lg">Problemas Recentes</h3>
        </div>
        <button 
          className="text-sm text-resolve-green font-medium"
          onClick={() => navigate('/problemas')}
        >
          Ver todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <ProblemsTableHeader />
          <ProblemsTableBody problems={problems} />
        </Table>
      </div>
    </div>
  );
};
