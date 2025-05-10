
import React from 'react';

interface OcorrenciaDepartamentoProps {
  selectedDepartamento: string;
  onDepartamentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OcorrenciaDepartamento: React.FC<OcorrenciaDepartamentoProps> = ({
  selectedDepartamento,
  onDepartamentoChange
}) => {
  return (
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
  );
};
