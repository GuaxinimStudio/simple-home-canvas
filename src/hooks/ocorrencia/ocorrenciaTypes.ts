
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
