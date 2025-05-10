
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
