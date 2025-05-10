
import React from 'react';

interface ProblemHeaderProps {
  totalProblems: number;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ totalProblems }) => {
  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800">Problemas Reportados</h1>
      <div className="flex items-center mt-1">
        <span className="text-gray-600 text-sm bg-green-100 px-2 py-0.5 rounded-full mr-2">
          {totalProblems} problemas
        </span>
        <p className="text-gray-600">
          Gerencie todos os problemas reportados pelos cidadãos na cidade de Uruaçu, GO
        </p>
      </div>
    </div>
  );
};
