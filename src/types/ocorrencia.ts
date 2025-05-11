
export type StatusType = 
  | 'Pendente' 
  | 'Em andamento' 
  | 'Resolvido' 
  | 'Informações Insuficientes';

export interface OcorrenciaItem {
  id: string;
  descricao: string;
  status: StatusType;
  created_at: string;
  updated_at: string;
  telefone: string;
  prazo_estimado: string | null;
  municipio: string | null;
  foto_url: string | null;
  gabinete_id: string | null;
  gabinete?: {
    gabinete: string;
  } | null;
  descricao_resolvido: string | null;
  imagem_resolvido: string | null;
  resposta_enviada: boolean | null;
  resolvido_no_prazo: boolean | null;
  dias_atraso_resolucao: number | null;
}

// Adicionando a interface OcorrenciaData que estava faltando
export type OcorrenciaData = OcorrenciaItem;
