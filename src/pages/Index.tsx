
import React from 'react';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import StatusCardsSection from '../components/StatusCardsSection';
import RecentProblemsTable from '../components/RecentProblemsTable';

const Index = () => {
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
          <StatusCardsSection />

          {/* Problemas Recentes Table - agora apenas passamos o limite */}
          <RecentProblemsTable limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Index;
