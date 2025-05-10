
import React from 'react';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import StatusCardsSection from '../components/StatusCardsSection';
import RecentProblemsTable from '../components/RecentProblemsTable';
import ActivitySections from '../components/ActivitySections';

const Index = () => {
  // Data for problem status chart
  const problemStatusData = [
    { name: 'Pendentes', value: 3, color: '#F5B74F' },
    { name: 'Resolvidos', value: 3, color: '#3BA676' },
  ];

  // Data for secretary distribution chart
  const secretaryDistributionData = [
    { name: 'Gabinete do Vereador Rafael Miguel', value: 30, color: '#FF8585' },
    { name: 'Gabinete do Vereador Lucas', value: 50, color: '#9061F9' },
    { name: 'Gabinete de Educação', value: 20, color: '#37A2B2' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeroBanner 
            title="Transformando Problemas em Soluções" 
            subtitle="Conectando cidadãos e gestão municipal em tempo real"
            backgroundImage="https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          />

          {/* Status Summary Cards */}
          <StatusCardsSection 
            problemStatusData={problemStatusData} 
            secretaryDistributionData={secretaryDistributionData} 
          />

          {/* Problemas Recentes Table - agora apenas passamos o limite */}
          <RecentProblemsTable limit={5} />

          {/* Activity Sections */}
          <ActivitySections />
        </div>
      </div>
    </div>
  );
};

export default Index;
