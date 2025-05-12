
import React from 'react';
import { Button } from "@/components/ui/button";
import { StatusType } from '@/types/ocorrencia';
import { isStatusRequireResponse } from '@/hooks/ocorrencia/ocorrenciaTypes';

interface OcorrenciaAcoesProps {
  currentStatus: StatusType;
  isSalvo: boolean;
  onSalvar: () => void;
  isFormValid?: boolean;
}

export const OcorrenciaAcoes: React.FC<OcorrenciaAcoesProps> = ({
  currentStatus,
  isSalvo,
  onSalvar,
  isFormValid = true
}) => {
  // Verifica se é um status que requer resposta (finalizado)
  const requiresResponse = isStatusRequireResponse(currentStatus);
  
  // Verifica se deve mostrar o botão de salvar alterações
  // Não mostra o botão se o status requer resposta e já está salvo
  const showSaveButton = !(requiresResponse && isSalvo);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {showSaveButton && (
          <Button 
            type="button"
            onClick={onSalvar}
            disabled={!isFormValid}
            className="w-full"
          >
            Salvar Alterações
          </Button>
        )}

        {requiresResponse && !isFormValid && (
          <p className="text-red-500 text-sm">
            Preencha todos os campos obrigatórios para salvar as alterações.
          </p>
        )}
      </div>
    </div>
  );
};
