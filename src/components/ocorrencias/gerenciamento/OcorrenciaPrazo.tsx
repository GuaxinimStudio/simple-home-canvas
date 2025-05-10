
import React from 'react';

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
        <input 
          type="date" 
          className="w-full border rounded-md px-4 py-2.5 text-gray-700"
          placeholder="Selecione um prazo"
          value={prazoEstimado}
          onChange={onPrazoChange}
          disabled={isResolvido}
        />
      </div>
    </div>
  );
};
