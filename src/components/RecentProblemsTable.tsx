
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ProblemTableHeader } from './problems/ProblemTableHeader';
import { ProblemRow } from './problems/ProblemRow';
import { RecentProblemsTableProps } from './problems/types';

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ recentActivities }) => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <ProblemTableHeader />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Tempo</TableHead>
              <TableHead className="w-[120px]">Prazo</TableHead>
              <TableHead className="w-[180px]">Data</TableHead>
              <TableHead className="w-[180px]">Gabinete</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <ProblemRow 
                key={activity.id}
                activity={activity}
                isOpen={openItem === activity.id}
                onToggle={() => toggleItem(activity.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentProblemsTable;
