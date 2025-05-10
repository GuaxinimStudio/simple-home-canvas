
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
        onValueChange={onStatusChange}
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
