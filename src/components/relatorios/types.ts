
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
