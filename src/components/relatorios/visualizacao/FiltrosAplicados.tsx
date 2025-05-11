
import React from 'react';
import { FiltrosRelatorios } from '@/hooks/relatorios/types';

interface FiltrosAplicadosProps {
  filtros: FiltrosRelatorios;
}

const FiltrosAplicados: React.FC<FiltrosAplicadosProps> = ({ filtros }) => {
  // Formatar texto de período para exibição
  const obterTextoPeriodo = () => {
    if (filtros.tipoFiltro === 'mes_ano') {
      if (!filtros.mes || !filtros.ano) return 'Todo o período';
      
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      const mesIndex = parseInt(filtros.mes, 10) - 1;
      const nomeMes = meses[mesIndex];
      
      return `${nomeMes} de ${filtros.ano}`;
    } else {
      if (!filtros.dataInicio && !filtros.dataFim) return 'Todo o período';
      
      if (filtros.dataInicio && !filtros.dataFim) {
        return `A partir de ${filtros.dataInicio.toLocaleDateString('pt-BR')}`;
      }
      
      if (!filtros.dataInicio && filtros.dataFim) {
        return `Até ${filtros.dataFim.toLocaleDateString('pt-BR')}`;
      }
      
      return `De ${filtros.dataInicio?.toLocaleDateString('pt-BR')} até ${filtros.dataFim?.toLocaleDateString('pt-BR')}`;
    }
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-sm font-medium mb-2">Filtros aplicados:</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Período:</span> {obterTextoPeriodo()}</p>
        <p><span className="font-medium">Status:</span> {filtros.status || 'Todos os status'}</p>
        {filtros.textoBusca && (
          <p><span className="font-medium">Busca:</span> {filtros.textoBusca}</p>
        )}
      </div>
    </div>
  );
};

export default FiltrosAplicados;
