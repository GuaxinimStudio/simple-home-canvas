
import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

type ProblemItem = {
  id: number;
  description: string;
  status: string;
  date: string;
  secretary: string;
  timeElapsed: string;
  dueDate: string;
};

type RecentProblemsTableProps = {
  recentActivities: ProblemItem[];
};

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ recentActivities }) => {
  return (
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
  );
};

export default RecentProblemsTable;
