
import React from 'react';
import Sidebar from '../components/Sidebar';
import { ProblemHeader } from '../components/problemas/ProblemHeader';
import { ProblemFilters } from '../components/problemas/ProblemFilters';
import { ProblemTable } from '../components/problemas/ProblemTable';
import { useProblemData } from '../hooks/problemas/useProblemData';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-resolve-blue" />
                <p className="text-sm text-gray-600">
                  Você está visualizando apenas os problemas vinculados ao seu gabinete.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Filtros */}
          <ProblemFilters selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} totalProblems={totalProblems} />

          {/* Tabela de problemas */}
          <ProblemTable problems={filteredProblems} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Problemas;
