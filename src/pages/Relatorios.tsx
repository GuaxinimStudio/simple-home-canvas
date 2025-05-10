
import React, { useState } from 'react';
import { ChevronDown, Clock, Check, CircleHelp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import Sidebar from '../components/Sidebar';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Dados de exemplo para o gráfico
const chartData = [
  { name: 'Jan', pendentes: 3, resolvidos: 2 },
  { name: 'Fev', pendentes: 2, resolvidos: 3 },
  { name: 'Mar', pendentes: 4, resolvidos: 2 },
  { name: 'Abr', pendentes: 1, resolvidos: 5 },
  { name: 'Mai', pendentes: 3, resolvidos: 3 },
  { name: 'Jun', pendentes: 2, resolvidos: 4 }
];

// Dados de exemplo para a tabela detalhada
const tabelaData = [
  { 
    id: 1, 
    data: '09/05/25', 
    municipio: 'Uruaçu', 
    secretaria: 'Secretaria de Saúde', 
    status: 'Resolvido', 
    prazo: '14/05/25', 
    resolvidoNoPrazo: 'Sim',
    diasDeAtraso: '-',
    alteracoesDePrazo: '1 vez' 
  },
  { 
    id: 2, 
    data: '07/05/25', 
    municipio: 'Uruaçu', 
    secretaria: 'Secretaria de Educação', 
    status: 'Resolvido', 
    prazo: '14/05/25', 
    resolvidoNoPrazo: 'Sim',
    diasDeAtraso: '-',
    alteracoesDePrazo: '1 vez' 
  },
  { 
    id: 3, 
    data: '07/05/25', 
    municipio: 'Uruaçu', 
    secretaria: 'Secretaria de Infraestrutura', 
    status: 'Pendente', 
    prazo: '15/05/25', 
    resolvidoNoPrazo: '-',
    diasDeAtraso: '-',
    alteracoesDePrazo: '1 vez' 
  },
  { 
    id: 4, 
    data: '07/05/25', 
    municipio: 'Uruaçu', 
    secretaria: 'Secretaria de Finanças', 
    status: 'Resolvido', 
    prazo: '12/05/25', 
    resolvidoNoPrazo: 'Sim',
    diasDeAtraso: '-',
    alteracoesDePrazo: '1 vez' 
  },
  { 
    id: 5, 
    data: '05/05/25', 
    municipio: 'Uruaçu', 
    secretaria: 'Secretaria de Cultura', 
    status: 'Pendente', 
    prazo: '15/05/25', 
    resolvidoNoPrazo: '-',
    diasDeAtraso: '-',
    alteracoesDePrazo: '1 vez' 
  },
  { 
    id: 6, 
    data: '05/05/25', 
    municipio: 'Uruaçu', 
    secretaria: 'Secretaria de Esportes', 
    status: 'Pendente', 
    prazo: '09/05/25', 
    resolvidoNoPrazo: '-',
    diasDeAtraso: '-',
    alteracoesDePrazo: '1 vez' 
  }
];

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
};

const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon, iconColor, bgColor }) => (
  <div className={`p-6 rounded-lg ${bgColor}`}>
    <div className="flex justify-between items-start mb-8">
      <span className="text-lg font-medium">{title}</span>
      <div className={`rounded-full p-2 ${iconColor}`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-semibold">{count}</div>
  </div>
);

const Relatorios: React.FC = () => {
  const [monthSelect, setMonthSelect] = useState<string>("Selecione o mês");
  const [yearSelect, setYearSelect] = useState<string>("2025");
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Seção de Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Filtros</h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 mb-1 block">Busca por texto</span>
                  <Input 
                    placeholder="Pesquisar por descrição ou secretaria..." 
                    className="max-w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <button
                        className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                      >
                        <span className="text-gray-700">Todas as secretarias</span>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                    >
                      <span className="text-gray-700">Todos os status</span>
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <Button variant="default" className="w-full bg-resolve-green hover:bg-green-600">
                        Mês/Ano
                      </Button>
                    </div>
                    <div className="flex-grow">
                      <Button variant="outline" className="w-full">
                        Intervalo
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <button
                        className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                      >
                        <span className="text-gray-700">{monthSelect}</span>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="relative">
                      <button
                        className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                      >
                        <span className="text-gray-700">{yearSelect}</span>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs de navegação */}
          <Tabs defaultValue="resumo" className="mb-6">
            <TabsList className="bg-white border w-full justify-start p-0 h-auto">
              <TabsTrigger 
                value="resumo" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-resolve-green data-[state=active]:border-b-2 data-[state=active]:border-resolve-green rounded-none px-6 py-3"
              >
                Resumo
              </TabsTrigger>
              <TabsTrigger 
                value="detalhada" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-resolve-green data-[state=active]:border-b-2 data-[state=active]:border-resolve-green rounded-none px-6 py-3"
              >
                Tabela Detalhada
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="mt-4">
              {/* Cards de status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatusCard 
                  title="Pendentes" 
                  count={3} 
                  icon={<Clock className="h-5 w-5 text-amber-600" />} 
                  iconColor="bg-amber-100" 
                  bgColor="bg-amber-50"
                />
                
                <StatusCard 
                  title="Em Andamento" 
                  count={0} 
                  icon={<Clock className="h-5 w-5 text-blue-600" />} 
                  iconColor="bg-blue-100" 
                  bgColor="bg-blue-50"
                />
                
                <StatusCard 
                  title="Resolvidos" 
                  count={3} 
                  icon={<Check className="h-5 w-5 text-green-600" />} 
                  iconColor="bg-green-100" 
                  bgColor="bg-green-50"
                />
                
                <StatusCard 
                  title="Informações Insuficientes" 
                  count={0} 
                  icon={<CircleHelp className="h-5 w-5 text-purple-600" />} 
                  iconColor="bg-purple-100" 
                  bgColor="bg-purple-50"
                />
              </div>
              
              {/* Gráficos e Estatísticas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Distribuição por Status</h3>
                    <div className="h-72">
                      <ChartContainer 
                        config={{
                          pendentes: { color: "#fbbf24" },
                          resolvidos: { color: "#34d399" }
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="pendentes" fill="var(--color-pendentes)" name="Pendentes" />
                            <Bar dataKey="resolvidos" fill="var(--color-resolvidos)" name="Resolvidos" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Resolvidos no Prazo</h3>
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="text-5xl font-bold text-gray-800">100%</div>
                      <p className="text-gray-500 mt-2">3 de 3 problemas</p>
                      <div className="w-24 h-8 mt-4">
                        <svg viewBox="0 0 100 30" className="w-full h-full">
                          <path d="M0,15 L20,5 L40,10 L60,0 L80,5 L100,2" stroke="#10b981" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="detalhada">
              <div className="bg-white p-6 rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Município</TableHead>
                      <TableHead>Secretaria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Resolvido no prazo</TableHead>
                      <TableHead>Dias de atraso</TableHead>
                      <TableHead>Alterações de prazo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabelaData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.data}</TableCell>
                        <TableCell>{item.municipio}</TableCell>
                        <TableCell>{item.secretaria}</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs ${
                            item.status === 'Resolvido' 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item.prazo}</TableCell>
                        <TableCell className={`${
                          item.resolvidoNoPrazo === 'Sim' ? "text-green-600 font-medium" : ""
                        }`}>
                          {item.resolvidoNoPrazo}
                        </TableCell>
                        <TableCell>{item.diasDeAtraso}</TableCell>
                        <TableCell>{item.alteracoesDePrazo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
