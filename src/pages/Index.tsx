
import React from 'react';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import StatusCard from '../components/StatusCard';
import DonutChart from '../components/DonutChart';
import { 
  ListFilter, 
  PieChart, 
  ArrowUp, 
  ArrowDown,
  Clock, 
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const Index = () => {
  // Data for problem status chart
  const problemStatusData = [
    { name: 'Pendentes', value: 3, color: '#F5B74F' },
    { name: 'Resolvidos', value: 3, color: '#3BA676' },
  ];

  // Data for secretary distribution chart
  const secretaryDistributionData = [
    { name: 'Secretaria de Saúde', value: 30, color: '#FF8585' },
    { name: 'Secretaria de Obras', value: 50, color: '#9061F9' },
    { name: 'Secretaria de Educação', value: 20, color: '#37A2B2' },
  ];

  // Data for recent activities
  const recentActivities = [
    { 
      id: 1, 
      description: 'Visita Valdei', 
      status: 'Resolvido', 
      date: '9 mai 2025, 08:39',
      secretary: 'Secretaria de Saúde',
      timeElapsed: '13:01:22',
      dueDate: '14/05/25'
    },
    { 
      id: 2, 
      description: 'Carros lá fora', 
      status: 'Resolvido', 
      date: '7 mai 2025, 16:31',
      secretary: 'Secretaria de Obras',
      timeElapsed: '2d 05:09:30',
      dueDate: '14/05/25'
    },
    { 
      id: 3, 
      description: 'Solucionar', 
      status: 'Pendente', 
      date: '7 mai 2025, 11:47',
      secretary: 'Secretaria de Obras',
      timeElapsed: '2d 09:55:41',
      dueDate: '15/05/25'
    },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard 
              icon={<ListFilter className="h-5 w-5" />}
              title="Status dos Problemas"
              count="6"
              badge={{ text: "Total: 6", color: "bg-resolve-lightgreen text-resolve-green" }}
            >
              <div className="flex flex-col items-center">
                <DonutChart 
                  data={problemStatusData} 
                  centerText="6" 
                  centerSubtext="Total"
                  size={140}
                />
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-resolve-green mr-2"></div>
                    <span className="text-xs">3 Resolvidos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-resolve-yellow mr-2"></div>
                    <span className="text-xs">3 Pendentes</span>
                  </div>
                </div>
              </div>
            </StatusCard>

            <StatusCard 
              icon={<PieChart className="h-5 w-5" />}
              title="Distribuição por Secretaria"
              count="3"
              badge={{ text: "3 Secretarias", color: "bg-resolve-lightgreen text-resolve-green" }}
            >
              <div className="flex flex-col items-center">
                <DonutChart 
                  data={secretaryDistributionData} 
                  centerText="100%" 
                  centerSubtext="Total"
                  size={140}
                />
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#FF8585] mr-1"></div>
                    <span className="text-xs">Saúde (30%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#9061F9] mr-1"></div>
                    <span className="text-xs">Obras (50%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#37A2B2] mr-1"></div>
                    <span className="text-xs">Educação (20%)</span>
                  </div>
                </div>
              </div>
            </StatusCard>

            <StatusCard 
              icon={<Clock className="h-5 w-5" />}
              title="Tempo Médio de Resolução"
              count="1.5 dias"
              badge={{ text: "Melhorou 15%", color: "bg-resolve-lightgreen text-resolve-green" }}
            >
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-sm">Esta semana</span>
                  <div className="flex items-center text-resolve-green">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">1.5 dias</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-resolve-green h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <div className="flex items-center justify-between w-full mb-2 mt-4">
                  <span className="text-sm">Semana passada</span>
                  <div className="flex items-center text-resolve-red">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">1.8 dias</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-resolve-yellow h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </StatusCard>

            <StatusCard 
              icon={<Calendar className="h-5 w-5" />}
              title="Problemas Reportados"
              count="21"
              badge={{ text: "Neste mês", color: "bg-resolve-lightgreen text-resolve-green" }}
            >
              <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-2 w-full gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Hoje</p>
                    <p className="text-xl font-medium mt-1">3</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Semana</p>
                    <p className="text-xl font-medium mt-1">12</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Mês</p>
                    <p className="text-xl font-medium mt-1">21</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-medium mt-1">54</p>
                  </div>
                </div>
              </div>
            </StatusCard>
          </div>

          {/* Problemas Recentes Table */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-lg">Problemas Recentes</h3>
              </div>
              <button className="text-sm text-resolve-green font-medium">Ver todos</button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Tempo</TableHead>
                    <TableHead className="w-[120px]">Prazo</TableHead>
                    <TableHead className="w-[180px]">Data</TableHead>
                    <TableHead className="w-[180px]">Secretaria</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.description}</TableCell>
                      <TableCell>
                        <Badge className={`px-2.5 py-1 rounded-full text-xs ${
                          activity.status === 'Resolvido' 
                            ? "bg-resolve-lightgreen text-resolve-green" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{activity.timeElapsed}</TableCell>
                      <TableCell>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center justify-center">
                          {activity.dueDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{activity.date}</TableCell>
                      <TableCell className="text-sm">{activity.secretary}</TableCell>
                      <TableCell>
                        <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
                          <span className="sr-only">Ver detalhes</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Secretarias Mais Ativas</h3>
              </div>
              <div className="space-y-4">
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
                
                <div className="flex justify-between">
                  <span>Secretaria de Educação</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-resolve-purple h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Atividade Recente</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-green"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Secretaria de Obras</span> 
                      {' '}respondeu ao problema <span className="text-resolve-green">#1001</span>
                    </p>
                    <p className="text-xs text-gray-500">Há 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-yellow"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Novo problema</span> 
                      {' '}registrado na <span className="text-resolve-green">Secretaria de Saúde</span>
                    </p>
                    <p className="text-xs text-gray-500">Há 3 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-green"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Problema #1002</span> 
                      {' '}marcado como <span className="text-resolve-green">Resolvido</span>
                    </p>
                    <p className="text-xs text-gray-500">Há 4 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-coral"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Prazo atualizado</span> 
                      {' '}para o problema <span className="text-resolve-green">#1003</span>
                    </p>
                    <p className="text-xs text-gray-500">Há 5 horas</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-sm text-resolve-green">Ver todas as atividades</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
