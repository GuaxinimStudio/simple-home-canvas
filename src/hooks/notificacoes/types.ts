
export interface Notificacao {
  id: string;
  created_at: string;
  updated_at: string;
  gabinete_id: string | null;
  informacao: string;
  telefones: string[];
  arquivo_url?: string | null;
  arquivo_tipo?: string | null;
  gabinete?: {
    gabinete: string;
    municipio: string | null;
  };
}

export interface ArquivoInfo {
  url: string;
  tipo: string;
}

export interface NovaNotificacaoDto {
  gabinete_id: string;
  informacao: string;
}
