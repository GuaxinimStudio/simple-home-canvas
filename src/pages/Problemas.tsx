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
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Título e subtítulo */}
          <ProblemHeader totalProblems={totalProblems} />
          
          {/* Mensagem específica para vereadores */}
          {userProfile?.role === 'vereador'}

          {/* Filtros */}
          <ProblemFilters selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} totalProblems={totalProblems} />

          {/* Tabela de problemas */}
          <ProblemTable problems={filteredProblems} isLoading={isLoading} />
        </div>
      </div>
    </div>;
};
export default Problemas;