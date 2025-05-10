
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

const RelatoriosGrafico: React.FC = () => {
  return (
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
  );
};

export default RelatoriosGrafico;
