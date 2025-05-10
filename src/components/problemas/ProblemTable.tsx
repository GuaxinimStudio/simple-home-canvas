
import React from 'react';
import { Table } from '@/components/ui/table';
import { ProblemsTableHeader } from './ProblemsTableHeader';
import { ProblemsTableBody } from './ProblemsTableBody';
import { ProblemItem } from './types';

interface ProblemTableProps {
  problems: ProblemItem[];
  isLoading?: boolean;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({ problems, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-center py-10 text-gray-500">Carregando problemas...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-center py-10 text-gray-500">Nenhum problema encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <ProblemsTableHeader />
          <ProblemsTableBody problems={problems} />
        </Table>
      </div>
    </div>
  );
};
