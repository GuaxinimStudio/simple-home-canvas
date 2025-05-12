
import React from 'react';
import StatusCard from './StatusCard';
import DonutChart from './DonutChart';
import { ListFilter, PieChart, Calendar } from 'lucide-react';
import { useProblemsStats } from '@/hooks/useProblemsStats';
import { useGabineteDistribution } from '@/hooks/useGabineteDistribution';
import { useReportedProblems } from '@/hooks/useReportedProblems';
import { useAuth } from '@/contexts/AuthContext';

const StatusCardsSection: React.FC = () => {
  const { stats: problemsStats, isLoading: problemsStatsLoading } = useProblemsStats();
  const { distribution: gabineteDistribution, isLoading: gabineteDistributionLoading } = useGabineteDistribution();
  const { stats: reportedProblems, isLoading: reportedProblemsLoading } = useReportedProblems();
  const { user } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  // Buscar o papel do usuário (vereador ou administrador)
  React.useEffect(() => {
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

  // Transformar dados para o gráfico de status
  const problemStatusData = [
    { name: 'Pendentes', value: problemsStats.pendentes, color: '#F5B74F' },
    { name: 'Em andamento', value: problemsStats.emAndamento, color: '#5D5FEF' },
    { name: 'Resolvidos', value: problemsStats.resolvidos, color: '#3BA676' },
    { name: 'Insuficientes', value: problemsStats.insuficientes, color: '#FF8585' },
  ].filter(item => item.value > 0);

  // Função para renderizar cards com base no papel do usuário
  const renderCards = () => {
    // Se for administrador ou ainda não sabemos o papel, renderizar todos os cards
    if (userRole === 'administrador' || userRole === null) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Status dos Problemas */}
          <StatusCard 
            icon={<ListFilter className="h-5 w-5" />}
            title="Status dos Problemas"
            count={problemsStats.total.toString()}
            badge={{ 
              text: `Total: ${problemsStats.total}`, 
              color: "bg-resolve-lightgreen text-resolve-green" 
            }}
          >
            {problemsStatsLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : problemStatusData.length > 0 ? (
              <div className="flex flex-col items-center">
                <DonutChart 
                  data={problemStatusData} 
                  centerText={problemsStats.total.toString()} 
                  centerSubtext="Total"
                  size={140}
                />
                <div className="flex gap-4 mt-3 flex-wrap justify-center">
                  {problemsStats.pendentes > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#F5B74F] mr-2"></div>
                      <span className="text-xs">{problemsStats.pendentes} Pendentes</span>
                    </div>
                  )}
                  {problemsStats.emAndamento > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#5D5FEF] mr-2"></div>
                      <span className="text-xs">{problemsStats.emAndamento} Em andamento</span>
                    </div>
                  )}
                  {problemsStats.resolvidos > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#3BA676] mr-2"></div>
                      <span className="text-xs">{problemsStats.resolvidos} Resolvidos</span>
                    </div>
                  )}
                  {problemsStats.insuficientes > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#FF8585] mr-2"></div>
                      <span className="text-xs">{problemsStats.insuficientes} Insuf.</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Nenhum problema registrado</p>
              </div>
            )}
          </StatusCard>

          {/* Card Distribuição por Gabinete - APENAS PARA ADMINISTRADOR */}
          <StatusCard 
            icon={<PieChart className="h-5 w-5" />}
            title="Distribuição por Gabinete"
            count={gabineteDistribution.length.toString()}
            badge={{ 
              text: `${gabineteDistribution.length} Gabinetes`, 
              color: "bg-resolve-lightgreen text-resolve-green" 
            }}
          >
            {gabineteDistributionLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : gabineteDistribution.length > 0 ? (
              <div className="flex flex-col items-center">
                <DonutChart 
                  data={gabineteDistribution.map(item => ({
                    name: item.gabinete,
                    value: item.count,
                    color: item.color
                  }))} 
                  centerText="100%" 
                  centerSubtext="Total"
                  size={140}
                />
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  {gabineteDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs ml-1">
                        {item.gabinete.length > 15 
                          ? `${item.gabinete.substring(0, 15)}... (${Math.round(item.percentage)}%)`
                          : `${item.gabinete} (${Math.round(item.percentage)}%)`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Nenhum problema atribuído a gabinetes</p>
              </div>
            )}
          </StatusCard>

          {/* Card Problemas Reportados */}
          <StatusCard 
            icon={<Calendar className="h-5 w-5" />}
            title="Problemas Reportados"
            count={reportedProblems.total.toString()}
            badge={{ text: "Estatísticas", color: "bg-resolve-lightgreen text-resolve-green" }}
          >
            {reportedProblemsLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-2 w-full gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Hoje</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.today}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Semana</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.week}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Mês</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.month}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.total}</p>
                  </div>
                </div>
              </div>
            )}
          </StatusCard>
        </div>
      );
    } else {
      // Se for vereador, renderizar apenas os cards relevantes (sem o de distribuição por gabinete)
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Card Status dos Problemas */}
          <StatusCard 
            icon={<ListFilter className="h-5 w-5" />}
            title="Status dos Problemas"
            count={problemsStats.total.toString()}
            badge={{ 
              text: `Total: ${problemsStats.total}`, 
              color: "bg-resolve-lightgreen text-resolve-green" 
            }}
          >
            {problemsStatsLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : problemStatusData.length > 0 ? (
              <div className="flex flex-col items-center">
                <DonutChart 
                  data={problemStatusData} 
                  centerText={problemsStats.total.toString()} 
                  centerSubtext="Total"
                  size={140}
                />
                <div className="flex gap-4 mt-3 flex-wrap justify-center">
                  {problemsStats.pendentes > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#F5B74F] mr-2"></div>
                      <span className="text-xs">{problemsStats.pendentes} Pendentes</span>
                    </div>
                  )}
                  {problemsStats.emAndamento > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#5D5FEF] mr-2"></div>
                      <span className="text-xs">{problemsStats.emAndamento} Em andamento</span>
                    </div>
                  )}
                  {problemsStats.resolvidos > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#3BA676] mr-2"></div>
                      <span className="text-xs">{problemsStats.resolvidos} Resolvidos</span>
                    </div>
                  )}
                  {problemsStats.insuficientes > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#FF8585] mr-2"></div>
                      <span className="text-xs">{problemsStats.insuficientes} Insuf.</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Nenhum problema registrado</p>
              </div>
            )}
          </StatusCard>

          {/* Card Problemas Reportados */}
          <StatusCard 
            icon={<Calendar className="h-5 w-5" />}
            title="Problemas Reportados"
            count={reportedProblems.total.toString()}
            badge={{ text: "Estatísticas", color: "bg-resolve-lightgreen text-resolve-green" }}
          >
            {reportedProblemsLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Carregando...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-2 w-full gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Hoje</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.today}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Semana</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.week}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Mês</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.month}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-medium mt-1">{reportedProblems.total}</p>
                  </div>
                </div>
              </div>
            )}
          </StatusCard>
        </div>
      );
    }
  };

  return renderCards();
};

export default StatusCardsSection;
