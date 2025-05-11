
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useElapsedTimeCounter } from '@/hooks/useElapsedTimeCounter';
import { Check, X } from 'lucide-react';
import { Problema } from '@/hooks/useRelatoriosData';

// Componente para exibir o tempo decorrido com atualização em tempo real como cronômetro
const ElapsedTimeDisplay = ({ createdAt, updatedAt, isResolved }: { 
  createdAt: string, 
  updatedAt: string | null, 
  isResolved: boolean 
}) => {
  const elapsedTime = useElapsedTimeCounter(
    createdAt, 
    isResolved ? updatedAt : null,
    1000 // Atualizar a cada 1 segundo para funcionar como cronômetro
  );
  
  if (isResolved) {
    return <span className="text-green-600">Resolvido após {elapsedTime}</span>;
  }
  
  return <span className="text-red-500">Recebido há {elapsedTime}</span>;
};

// Componente para renderizar o ícone do status de resolução conforme prazo
const ResolvidoNoPrazoIcon = ({ resolvidoNoPrazo }: { resolvidoNoPrazo: boolean | null }) => {
  if (resolvidoNoPrazo === true) {
    return <Check className="w-4 h-4 text-green-600 ml-1" />;
  } else if (resolvidoNoPrazo === false) {
    return <X className="w-4 h-4 text-red-600 ml-1" />;
  }
  return null;
};

interface RelatoriosTabelaProps {
  problemas: Problema[];
  isLoading: boolean;
}

const RelatoriosTabela: React.FC<RelatoriosTabelaProps> = ({ problemas, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  if (!problemas.length) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-500 text-center">Nenhum problema encontrado com os filtros atuais.</p>
          <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros para ver mais resultados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Município</TableHead>
            <TableHead>Secretaria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tempo</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Resolvido no prazo</TableHead>
            <TableHead>Dias de atraso</TableHead>
            <TableHead>Alterações de prazo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemas.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.data}</TableCell>
              <TableCell>{item.municipio || '-'}</TableCell>
              <TableCell>{item.secretaria || '-'}</TableCell>
              <TableCell>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs ${
                  item.status === 'Resolvido' 
                    ? "bg-green-100 text-green-800" 
                    : item.status === 'Pendente'
                      ? "bg-yellow-100 text-yellow-800"
                      : item.status === 'Em andamento'
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <ElapsedTimeDisplay
                  createdAt={item.created_at}
                  updatedAt={item.updated_at}
                  isResolved={item.status === 'Resolvido'}
                />
              </TableCell>
              <TableCell className="flex items-center">
                {item.prazo_estimado ? new Date(item.prazo_estimado).toLocaleDateString('pt-BR') : '-'}
                {item.status === 'Resolvido' && <ResolvidoNoPrazoIcon resolvidoNoPrazo={item.resolvido_no_prazo} />}
              </TableCell>
              <TableCell className={`${
                item.resolvido_no_prazo === true ? "text-green-600 font-medium" : 
                item.resolvido_no_prazo === false ? "text-red-600 font-medium" : ""
              }`}>
                {item.resolvido_no_prazo !== null ? (item.resolvido_no_prazo ? 'Sim' : 'Não') : '-'}
              </TableCell>
              <TableCell>{item.dias_atraso_resolucao !== null ? `${item.dias_atraso_resolucao} dias` : '-'}</TableCell>
              <TableCell>{item.prazo_alteracoes || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RelatoriosTabela;
