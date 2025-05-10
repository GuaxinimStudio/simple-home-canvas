
export type ProblemItem = {
  id: string;
  descricao: string;
  status: string;
  created_at: string;
  telefone: string;
  prazo_estimado: string | null;
  municipio: string | null;
  gabinete: {
    gabinete: string;
  } | null;
};
