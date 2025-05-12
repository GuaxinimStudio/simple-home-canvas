
import React, { useEffect, useState } from 'react';
import { useProblemsStats } from '@/hooks/useProblemsStats';
import { useGabineteDistribution } from '@/hooks/useGabineteDistribution';
import { useReportedProblems } from '@/hooks/useReportedProblems';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProblemStatusCard from './statusCards/ProblemStatusCard';
import GabineteDistributionCard from './statusCards/GabineteDistributionCard';
import ReportedProblemsCard from './statusCards/ReportedProblemsCard';

const StatusCardsSection: React.FC = () => {
  const { stats: problemsStats, isLoading: problemsStatsLoading } = useProblemsStats();
  const { distribution: gabineteDistribution, isLoading: gabineteDistributionLoading } = useGabineteDistribution();
  const { stats: reportedProblems, isLoading: reportedProblemsLoading } = useReportedProblems();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Buscar o papel do usuário (vereador ou administrador)
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserRole(data.role);
      } catch (error) {
        console.error('Erro ao buscar papel do usuário:', error);
      }
    };
    
    fetchUserRole();
  }, [user]);

  // Função para renderizar cards com base no papel do usuário
  const renderCards = () => {
    // Se for administrador ou ainda não sabemos o papel, renderizar todos os cards
    if (userRole === 'administrador' || userRole === null) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProblemStatusCard stats={problemsStats} isLoading={problemsStatsLoading} />
          <GabineteDistributionCard distribution={gabineteDistribution} isLoading={gabineteDistributionLoading} />
          <ReportedProblemsCard stats={reportedProblems} isLoading={reportedProblemsLoading} />
        </div>
      );
    } else {
      // Se for vereador, renderizar apenas os cards relevantes (sem o de distribuição por gabinete)
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <ProblemStatusCard stats={problemsStats} isLoading={problemsStatsLoading} />
          <ReportedProblemsCard stats={reportedProblems} isLoading={reportedProblemsLoading} />
        </div>
      );
    }
  };

  return renderCards();
};

export default StatusCardsSection;
