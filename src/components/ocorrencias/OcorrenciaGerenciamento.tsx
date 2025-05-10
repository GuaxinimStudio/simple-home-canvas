
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
            <span className="text-orange-500 text-xs">Define um prazo estimado para poder alterar o status.</span>
          </div>
          
          <RadioGroup 
            value={currentStatus} 
            onValueChange={onStatusChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pendente" id="pendente" />
              <label htmlFor="pendente" className="text-sm font-medium">Pendente</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Em andamento" id="em-andamento" />
              <label htmlFor="em-andamento" className="text-sm font-medium">Em andamento</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Resolvido" id="resolvido" />
              <label htmlFor="resolvido" className="text-sm font-medium">Resolvido</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Informações Insuficientes" id="insuficiente" />
              <label htmlFor="insuficiente" className="text-sm font-medium">Informações Insuficientes</label>
            </div>
          </RadioGroup>
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
