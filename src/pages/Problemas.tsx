
import React from 'react';
import Sidebar from '../components/Sidebar';
import { ProblemHeader } from '../components/problemas/ProblemHeader';
import { ProblemFilters } from '../components/problemas/ProblemFilters';
import { ProblemTable } from '../components/problemas/ProblemTable';
import { useProblemData } from '../hooks/problemas/useProblemData';

const Problemas: React.FC = () => {
  const { 
    filteredProblems, 
    selectedStatus, 
    setSelectedStatus, 
    totalProblems,
    isLoading,
    error,
    userProfile
  } = useProblemData();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Título e subtítulo */}
          <ProblemHeader totalProblems={totalProblems} />
          
          {/* Mensagem específica para vereadores */}
          {userProfile?.role === 'vereador' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Você está visualizando apenas os problemas vinculados ao seu gabinete.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <ProblemFilters 
            selectedStatus={selectedStatus} 
            setSelectedStatus={setSelectedStatus} 
            totalProblems={totalProblems}
          />

          {/* Tabela de problemas */}
          <ProblemTable 
            problems={filteredProblems} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Problemas;
