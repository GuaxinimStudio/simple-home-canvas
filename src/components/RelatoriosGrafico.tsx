
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO, getMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Problema } from '@/hooks/useRelatoriosData';

interface RelatoriosGraficoProps {
  problemas: Problema[];
  isLoading: boolean;
}

const mesesAbreviados = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const RelatoriosGrafico: React.FC<RelatoriosGraficoProps> = ({ problemas, isLoading }) => {
  const chartData = useMemo(() => {
    // Se não há dados ou está carregando, retorna array vazio
    if (isLoading || !problemas.length) {
      return [];
    }

    // Obter o ano atual para filtrar os dados somente deste ano
    const anoAtual = new Date().getFullYear();
    
    // Inicializar contadores para cada mês
    const dadosPorMes = Array(12).fill(0).map((_, i) => ({
      name: mesesAbreviados[i],
      pendentes: 0,
      emAndamento: 0,
      resolvidos: 0,
      informacoesInsuficientes: 0,
      mes: i
    }));
    
    // Preencher os dados com base nos problemas
    problemas.forEach(problema => {
      try {
        const data = parseISO(problema.created_at);
        const ano = data.getFullYear();
        
        // Só considera dados do ano atual para o gráfico
        if (ano === anoAtual) {
          const mes = getMonth(data);
          
          if (problema.status === 'Pendente') {
            dadosPorMes[mes].pendentes += 1;
          } else if (problema.status === 'Em andamento') {
            dadosPorMes[mes].emAndamento += 1;
          } else if (problema.status === 'Resolvido') {
            dadosPorMes[mes].resolvidos += 1;
          } else if (problema.status === 'Informações Insuficientes') {
            dadosPorMes[mes].informacoesInsuficientes += 1;
          }
        }
      } catch (error) {
        console.error('Erro ao processar data:', error);
      }
    });
    
    // Filtra para retornar apenas os meses com dados
    const mesAtual = new Date().getMonth();
    return dadosPorMes.slice(0, mesAtual + 1);
  }, [problemas, isLoading]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Distribuição por Status</h3>
          <div className="h-72 bg-gray-50 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Distribuição por Status</h3>
        {chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-500">Não há dados disponíveis para exibir</p>
          </div>
        ) : (
          <div className="h-72">
            <ChartContainer 
              config={{
                pendentes: { color: "#fbbf24" },
                emAndamento: { color: "#3b82f6" },
                resolvidos: { color: "#34d399" },
                informacoesInsuficientes: { color: "#a855f7" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    tickLine={false}
                    axisLine={true}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={true}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="pendentes" fill="var(--color-pendentes)" name="Pendentes" />
                  <Bar dataKey="emAndamento" fill="var(--color-emAndamento)" name="Em Andamento" />
                  <Bar dataKey="resolvidos" fill="var(--color-resolvidos)" name="Resolvidos" />
                  <Bar dataKey="informacoesInsuficientes" fill="var(--color-informacoesInsuficientes)" name="Info. Insuficientes" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatoriosGrafico;
