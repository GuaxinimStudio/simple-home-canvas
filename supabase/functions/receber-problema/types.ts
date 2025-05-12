
export interface ProblemaRequest {
  telefone: string;
  descricao: string;
  gabinete_id?: string;
  foto_base64?: string;  // Base64 da imagem
  foto_url?: string;     // URL externa da imagem
  municipio?: string;
}

export interface ProblemaData {
  telefone: string;
  descricao: string;
  gabinete_id: string | null;
  foto_url: string | null;
  municipio: string | null;
  status: string;
}
