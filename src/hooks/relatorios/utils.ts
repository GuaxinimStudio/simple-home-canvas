
import { format, parseISO, getMonth, getYear, isWithinInterval } from 'date-fns';
import { Problema, RelatoriosStats } from './types';

export const formatarData = (data: string) => {
  try {
    return format(parseISO(data), 'dd/MM/yy');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

export const aplicarFiltroPorData = (
  problema: { created_at: string },
  tipoFiltro: "mes_ano" | "intervalo",
  mes: string | null,
  ano: string | null,
  dataInicio?: Date,
  dataFim?: Date
) => {
  try {
    const dataCriacao = parseISO(problema.created_at);
    
    if (tipoFiltro === 'mes_ano') {
      if (!mes || !ano) return true;
      
      const mesInt = parseInt(mes, 10) - 1; // JavaScript meses são 0-11
      const anoInt = parseInt(ano, 10);
      
      return getMonth(dataCriacao) === mesInt && getYear(dataCriacao) === anoInt;
    } else {
      // Filtro por intervalo
      if (!dataInicio && !dataFim) return true;
      
      if (dataInicio && !dataFim) {
        return dataCriacao >= dataInicio;
      }
      
      if (!dataInicio && dataFim) {
        return dataCriacao <= dataFim;
      }
      
      if (dataInicio && dataFim) {
        return isWithinInterval(dataCriacao, {
          start: dataInicio,
          end: dataFim
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao aplicar filtro por data:', error);
    return true;
  }
};

export const calcularEstatisticas = (problemasFiltrados: Problema[]): RelatoriosStats => {
  const pendentes = problemasFiltrados.filter(p => p.status === 'Pendente').length;
  const emAndamento = problemasFiltrados.filter(p => p.status === 'Em andamento').length;
  const resolvidos = problemasFiltrados.filter(p => p.status === 'Resolvido').length;
  const informacoesInsuficientes = problemasFiltrados.filter(p => p.status === 'Informações Insuficientes').length;
  const resolvidosNoPrazo = problemasFiltrados.filter(p => p.resolvido_no_prazo === true).length;
  
  // Calcular média de dias de atraso
  const problemasComAtraso = problemasFiltrados.filter(p => p.dias_atraso_resolucao !== null && p.dias_atraso_resolucao > 0);
  let diasAtrasoMedio = 0;
  
  if (problemasComAtraso.length > 0) {
    const somaAtrasos = problemasComAtraso.reduce((soma, p) => soma + (p.dias_atraso_resolucao || 0), 0);
    diasAtrasoMedio = Math.round(somaAtrasos / problemasComAtraso.length);
  }
  
  return {
    pendentes,
    emAndamento,
    resolvidos,
    informacoesInsuficientes,
    total: problemasFiltrados.length,
    resolvidosNoPrazo,
    totalResolvidos: resolvidos,
    diasAtrasoMedio
  };
};
