
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { StatusType } from '@/types/ocorrencia';

interface OcorrenciaGerenciamentoProps {
  currentStatus: StatusType;
  onStatusChange: (value: string) => void;
  prazoEstimado: string;
  onPrazoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedDepartamento: string;
  onDepartamentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSalvar: () => void;
}

export const OcorrenciaGerenciamento: React.FC<OcorrenciaGerenciamentoProps> = ({
  currentStatus,
  onStatusChange,
  prazoEstimado,
  onPrazoChange,
  selectedDepartamento,
  onDepartamentoChange,
  onSalvar
}) => {
  // Verifica se um prazo foi definido
  const isPrazoDefinido = prazoEstimado !== '';
  
  // Função para lidar com a alteração do status
  const handleStatusChange = (value: string) => {
    if (!isPrazoDefinido) {
      toast.error("É necessário definir um prazo antes de alterar o status.");
      return;
    }
    onStatusChange(value);
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Gerenciamento</h2>
      <p className="text-sm text-gray-500 mb-6">
        Atualize as informações da ocorrência conforme o andamento.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Situação Atual</h3>
          <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full inline-flex items-center text-sm font-medium">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {currentStatus}
          </div>
        </div>

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
            disabled={!isPrazoDefinido}
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

        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium mb-2">Prazo Estimado de Resolução</h3>
            <span className="text-green-500 text-xs">Alteração: SG</span>
          </div>
          <div className="relative">
            <input 
              type="date" 
              className="w-full border rounded-md px-4 py-2.5 text-gray-700"
              placeholder="Selecione um prazo"
              value={prazoEstimado}
              onChange={onPrazoChange}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium mb-2">Departamento Responsável</h3>
            <span className="text-orange-500 text-xs">Requer permissão de Admin</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              className="w-full border rounded-md px-4 py-2.5 text-gray-700"
              placeholder="Sem departamento definido"
              value={selectedDepartamento}
              onChange={onDepartamentoChange}
              disabled
            />
          </div>
        </div>

        <Button 
          onClick={onSalvar}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Salvar Alterações
        </Button>
      </div>
    </Card>
  );
};
