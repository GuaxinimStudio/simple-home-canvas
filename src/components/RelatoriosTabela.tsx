
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const RelatoriosTabela: React.FC = () => {
  return (
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
  );
};

export default RelatoriosTabela;
