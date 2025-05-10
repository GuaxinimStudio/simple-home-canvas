
export type StatusType = 'Pendente' | 'Em andamento' | 'Resolvido' | 'Informações Insuficientes';

export interface OcorrenciaData {
  id: string;
  created_at: string;
  updated_at: string;
  descricao: string;
  status: StatusType;
  telefone: string;
  foto_url: string | null;
  prazo_estimado: string | null;
  gabinete_id: string | null;
  municipio: string | null;
  descricao_resolvido?: string | null;
  imagem_resolvido?: string | null;
  gabinete?: {
    gabinete: string;
    municipio: string | null;
  };
}
