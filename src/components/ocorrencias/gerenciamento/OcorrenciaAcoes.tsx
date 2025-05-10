
import React from 'react';
import { Button } from "@/components/ui/button";

interface OcorrenciaAcoesProps {
  isResolvido: boolean;
  onSalvar: () => void;
  onEnviarRespostaCidadao?: () => void;
}

export const OcorrenciaAcoes: React.FC<OcorrenciaAcoesProps> = ({
  isResolvido,
  onSalvar,
  onEnviarRespostaCidadao
}) => {
  return (
    <>
      {!isResolvido && (
        <Button 
          onClick={onSalvar}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Salvar Alterações
        </Button>
      )}
      
      {isResolvido && onEnviarRespostaCidadao && (
        <Button 
          onClick={onEnviarRespostaCidadao}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Enviar Resposta para o Cidadão
        </Button>
      )}
    </>
  );
};
