
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { StatusType } from '@/types/ocorrencia';

interface OcorrenciaStatusProps {
  currentStatus: StatusType;
  onStatusChange: (value: string) => void;
  isPrazoDefinido: boolean;
  isResolvido: boolean;
}

export const OcorrenciaStatus: React.FC<OcorrenciaStatusProps> = ({
  currentStatus,
  onStatusChange,
  isPrazoDefinido,
  isResolvido
}) => {
  // Função para lidar com a alteração do status
  const handleStatusChange = (value: string) => {
    if (!isPrazoDefinido) {
      toast.error("É necessário definir um prazo antes de alterar o status.");
      return;
    }
    onStatusChange(value);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium mb-2">Atualizar Situação</h3>
        <span className="text-orange-500 text-xs">
          {isPrazoDefinido ? 
            "Prazo definido, status liberado" : 
            "Define um prazo estimado para poder alterar o status"}
        </span>
      </div>
      
      <Select 
        value={currentStatus} 
        onValueChange={handleStatusChange}
        disabled={!isPrazoDefinido || isResolvido}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pendente">Pendente</SelectItem>
          <SelectItem value="Em andamento">Em andamento</SelectItem>
          <SelectItem value="Resolvido">Resolvido</SelectItem>
          <SelectItem value="Informações Insuficientes">Informações Insuficientes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
