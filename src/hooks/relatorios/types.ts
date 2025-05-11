
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
  descricao?: string;
  foto_url?: string;
  telefone: string;
  descricao_resolvido?: string | null;
  imagem_resolvido?: string | null;
}

export interface RelatoriosStats {
  pendentes: number;
  emAndamento: number;
  resolvidos: number;
  informacoesInsuficientes: number;
  total: number;
  resolvidosNoPrazo: number;
  totalResolvidos: number;
  diasAtrasoMedio?: number; // Novo campo para média de dias de atraso
}

export interface FiltrosRelatorios {
  textoBusca: string;
  secretaria: string | null;
  status: string | null;
  tipoFiltro: "mes_ano" | "intervalo";
  mes: string | null;
  ano: string | null;
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
}
