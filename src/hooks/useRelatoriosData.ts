
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO, getMonth, getYear, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { FiltrosRelatorios } from '@/components/RelatoriosFiltros';

export interface Problema {
  id: string;
  data: string;
  created_at: string;
  updated_at: string | null;
  municipio: string | null;
  status: string;
  prazo_estimado: string | null;
  resolvido_no_prazo: boolean | null;
  dias_atraso_resolucao: number | null;
  prazo_alteracoes: number | null;
}

export interface RelatoriosStats {
  pendentes: number;
  emAndamento: number;
  resolvidos: number;
  informacoesInsuficientes: number;
  total: number;
  resolvidosNoPrazo: number;
  totalResolvidos: number;
}

export const useRelatoriosData = () => {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [stats, setStats] = useState<RelatoriosStats>({
    pendentes: 0,
    emAndamento: 0,
    resolvidos: 0,
    informacoesInsuficientes: 0,
    total: 0,
    resolvidosNoPrazo: 0,
    totalResolvidos: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filtros, setFiltros] = useState<FiltrosRelatorios>({
    textoBusca: '',
    secretaria: null,
    status: null,
    tipoFiltro: 'mes_ano',
    mes: new Date().getMonth() + 1 + '',
    ano: new Date().getFullYear() + '',
    dataInicio: undefined,
    dataFim: undefined,
  });

  const limparFiltros = () => {
    setFiltros({
      textoBusca: '',
      secretaria: null,
      status: null,
      tipoFiltro: 'mes_ano',
      mes: new Date().getMonth() + 1 + '',
      ano: new Date().getFullYear() + '',
      dataInicio: undefined,
      dataFim: undefined,
    });
  };

  const formatarData = (data: string) => {
    try {
      return format(parseISO(data), 'dd/MM/yy');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Corrigido o aplicarFiltroPorData para evitar instanciação de tipo excessivamente profunda
  const aplicarFiltroPorData = (problema: {created_at: string}) => {
    try {
      const dataCriacao = parseISO(problema.created_at);
      
      if (filtros.tipoFiltro === 'mes_ano') {
        if (!filtros.mes || !filtros.ano) return true;
        
        const mes = parseInt(filtros.mes, 10) - 1; // JavaScript meses são 0-11
        const ano = parseInt(filtros.ano, 10);
        
        return getMonth(dataCriacao) === mes && getYear(dataCriacao) === ano;
      } else {
        // Filtro por intervalo
        if (!filtros.dataInicio && !filtros.dataFim) return true;
        
        if (filtros.dataInicio && !filtros.dataFim) {
          return dataCriacao >= filtros.dataInicio;
        }
        
        if (!filtros.dataInicio && filtros.dataFim) {
          return dataCriacao <= filtros.dataFim;
        }
        
        if (filtros.dataInicio && filtros.dataFim) {
          return isWithinInterval(dataCriacao, {
            start: startOfMonth(filtros.dataInicio),
            end: endOfMonth(filtros.dataFim)
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao aplicar filtro por data:', error);
      return true;
    }
  };

  useEffect(() => {
    const fetchProblemas = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('problemas')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Aplicar filtros de texto
        if (filtros.textoBusca && filtros.textoBusca.trim() !== '') {
          query = query.or(`descricao.ilike.%${filtros.textoBusca}%,municipio.ilike.%${filtros.textoBusca}%`);
        }
        
        // Aplicar filtros de status
        if (filtros.status) {
          query = query.eq('status', filtros.status);
        }
        
        // Aplicar filtros de secretaria (usando municipio, pois secretaria não existe no tipo)
        if (filtros.secretaria) {
          query = query.eq('municipio', filtros.secretaria);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (!data) {
          setProblemas([]);
          setStats({
            pendentes: 0,
            emAndamento: 0,
            resolvidos: 0,
            informacoesInsuficientes: 0,
            total: 0,
            resolvidosNoPrazo: 0,
            totalResolvidos: 0,
          });
          return;
        }
        
        // Aplicar filtro por data (mês/ano ou intervalo) em memória
        const problemasFiltrados = data
          .filter(aplicarFiltroPorData)
          .map((problema) => ({
            ...problema,
            data: formatarData(problema.created_at),
            // Removemos a atribuição de secretaria que estava causando o erro
          }));
        
        setProblemas(problemasFiltrados as Problema[]);
        
        // Calcular estatísticas
        const pendentes = problemasFiltrados.filter(p => p.status === 'Pendente').length;
        const emAndamento = problemasFiltrados.filter(p => p.status === 'Em andamento').length;
        const resolvidos = problemasFiltrados.filter(p => p.status === 'Resolvido').length;
        const informacoesInsuficientes = problemasFiltrados.filter(p => p.status === 'Informações Insuficientes').length;
        const resolvidosNoPrazo = problemasFiltrados.filter(p => p.resolvido_no_prazo === true).length;
        
        setStats({
          pendentes,
          emAndamento,
          resolvidos,
          informacoesInsuficientes,
          total: problemasFiltrados.length,
          resolvidosNoPrazo,
          totalResolvidos: resolvidos,
        });
        
      } catch (error: any) {
        console.error('Erro ao buscar problemas:', error);
        toast.error('Não foi possível carregar os problemas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblemas();
  }, [filtros]);

  return {
    problemas,
    stats,
    isLoading,
    filtros,
    setFiltros,
    limparFiltros,
  };
};
