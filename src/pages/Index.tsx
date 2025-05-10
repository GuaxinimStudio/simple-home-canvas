
import React from 'react';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import StatusCard from '../components/StatusCard';
import DonutChart from '../components/DonutChart';
import { ListFilter, PieChart } from 'lucide-react';

const Index = () => {
  // Data for problem status chart
  const problemStatusData = [
    { name: 'Pendentes', value: 3, color: '#F5B74F' },
    { name: 'Resolvidos', value: 3, color: '#3BA676' },
  ];

  // Data for secretary distribution chart
  const secretaryDistributionData = [
    { name: 'Secretaria de Saúde', value: 70, color: '#FF8585' },
    { name: 'Secretaria de Obras', value: 30, color: '#9061F9' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusCard 
              icon={<ListFilter className="h-5 w-5" />}
              title="Status dos Problemas"
              count="6"
              badge={{ text: "Total: 6", color: "bg-resolve-lightgreen text-resolve-green" }}
            >
              <DonutChart 
                data={problemStatusData} 
                centerText="6" 
                centerSubtext="Total"
              />
            </StatusCard>

            <StatusCard 
              icon={<PieChart className="h-5 w-5" />}
              title="Distribuição por Secretaria"
              count="100%"
              badge={{ text: "2 Secretarias", color: "bg-resolve-lightgreen text-resolve-green" }}
            >
              <DonutChart 
                data={secretaryDistributionData} 
                centerText="100%" 
                centerSubtext="Total"
              />
            </StatusCard>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Problemas Recentes</h3>
              <button className="text-sm text-resolve-green font-medium">Ver todos</button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">Buraco na Avenida Principal</h4>
                    <p className="text-sm text-gray-500">Registrado em: 10/05/2025</p>
                  </div>
                  <div className={`px-2.5 py-1 text-xs rounded-full ${
                    index === 1 ? "bg-resolve-lightgreen text-resolve-green" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {index === 1 ? "Resolvido" : "Pendente"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Secretarias Mais Ativas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Secretaria de Obras</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-resolve-teal h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>

                <div className="flex justify-between">
                  <span>Secretaria de Saúde</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-resolve-coral h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Atividade Recente</h3>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-green"></div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Secretaria de Obras</span> 
                        {' '}respondeu ao problema <span className="text-resolve-green">#{index + 1000}</span>
                      </p>
                      <p className="text-xs text-gray-500">Há 2 horas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
