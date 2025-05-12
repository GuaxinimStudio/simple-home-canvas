
import React from 'react';
import { Button } from "@/components/ui/button";
import { StatusType } from '@/types/ocorrencia';
import { isStatusRequireResponse } from '@/hooks/ocorrencia/ocorrenciaTypes';

interface OcorrenciaAcoesProps {
  currentStatus: StatusType;
  isSalvo: boolean;
  onSalvar: () => void;
  onEnviarRespostaCidadao?: () => void;
  respostaEnviada?: boolean;
  isFormValid?: boolean;
}

export const OcorrenciaAcoes: React.FC<OcorrenciaAcoesProps> = ({
  currentStatus,
  isSalvo,
  onSalvar,
  onEnviarRespostaCidadao,
  respostaEnviada = false,
  isFormValid = true
}) => {
  // Verifica se é um status que requer resposta
  const requiresResponse = isStatusRequireResponse(currentStatus);
  
  // Verifica se deve mostrar o botão de enviar resposta
  const showResponseButton = requiresResponse && isSalvo && !respostaEnviada;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <Button 
          type="button"
          onClick={onSalvar}
          disabled={requiresResponse && !isFormValid}
          className="w-full"
        >
          Salvar Alterações
        </Button>
        
        {showResponseButton && onEnviarRespostaCidadao && (
          <Button 
            variant="secondary" 
            type="button"
            className="w-full"
            onClick={onEnviarRespostaCidadao}
          >
            Enviar Resposta ao Cidadão
          </Button>
        )}

        {requiresResponse && !isFormValid && (
          <p className="text-red-500 text-sm">
            Preencha a descrição e adicione uma imagem para salvar as alterações.
          </p>
        )}
      </div>
    </div>
  );
};
