
export interface Problem {
  id: number;
  photo: string;
  description: string;
  status: 'Resolvido' | 'Pendente' | 'Em andamento' | 'Informações Insuficientes';
  time: string;
  deadline: string;
  date: string;
  secretary: string;
}

export interface ProblemState {
  problems: Problem[];
  selectedStatus: string;
}

// Interface para itens de problema vindos do Supabase
export interface ProblemItem {
  id: string;
  descricao: string;
  status: string;
  created_at: string;
  updated_at: string;
  telefone: string;
  prazo_estimado: string | null;
  municipio: string | null;
  foto_url: string | null;
  resolvido_no_prazo: boolean | null;
  gabinete: {
    gabinete: string;
  } | null;
}
