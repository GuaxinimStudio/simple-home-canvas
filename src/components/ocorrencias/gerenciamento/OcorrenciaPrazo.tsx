
import React from 'react';
import { Calendar } from 'lucide-react';

interface OcorrenciaPrazoProps {
  prazoEstimado: string;
  onPrazoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isResolvido: boolean;
}

export const OcorrenciaPrazo: React.FC<OcorrenciaPrazoProps> = ({
  prazoEstimado,
  onPrazoChange,
  isResolvido
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium mb-2">Prazo Estimado de Resolução</h3>
        <span className="text-green-500 text-xs">Alteração: SG</span>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="date" 
          className="w-full border rounded-md pl-10 py-2.5 text-gray-700"
          placeholder="Selecione um prazo"
          value={prazoEstimado}
          onChange={onPrazoChange}
          disabled={isResolvido}
        />
      </div>
    </div>
  );
};
