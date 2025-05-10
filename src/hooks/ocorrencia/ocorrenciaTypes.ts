
import { StatusType, OcorrenciaData } from '@/types/ocorrencia';

export interface OcorrenciaState {
  currentStatus: StatusType;
  selectedDepartamento: string;
  prazoEstimado: string;
  isLoading: boolean;
  error: string | null;
  problemData: OcorrenciaData | null;
  descricaoResolvido: string;
  imagemResolvido: File | null;
  imagemResolvidoPreview: string | null;
  imageModalOpen: boolean;
  isSaved?: boolean; // Propriedade para controle de salvamento
  respostaEnviada?: boolean; // Propriedade para controle de resposta enviada
}

export interface OcorrenciaActions {
  handleStatusChange: (value: string) => void;
  handlePrazoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSalvar: () => Promise<void>;
  setSelectedDepartamento: React.Dispatch<React.SetStateAction<string>>;
  handleDescricaoResolvidoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImagemResolvidoChange: (file: File | null) => void;
  setImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEnviarRespostaCidadao: () => Promise<void>;
}

// Função auxiliar para verificar se o status requer envio de resposta ao cidadão
export const isStatusRequireResponse = (status: StatusType): boolean => {
  return status === 'Resolvido' || status === 'Informações Insuficientes';
};
