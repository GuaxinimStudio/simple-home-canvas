
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type DataItem = {
  name: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DataItem[];
  centerText: string;
  centerSubtext?: string;
  size?: number;
};

const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  centerText, 
  centerSubtext = 'Total',
  size = 180
}) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 3}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-2xl font-semibold">{centerText}</span>
        <span className="text-xs text-gray-500">{centerSubtext}</span>
      </div>
    </div>
  );
};

export default DonutChart;
