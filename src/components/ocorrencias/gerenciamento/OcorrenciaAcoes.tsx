
import React from 'react';
import { Button } from "@/components/ui/button";
import { StatusType } from '@/types/ocorrencia';
import { isStatusRequireResponse } from '@/hooks/ocorrencia/ocorrenciaTypes';
import { Send } from 'lucide-react';

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
  // Verifica se é um status que requer resposta (finalizado)
  const requiresResponse = isStatusRequireResponse(currentStatus);
  
  // Verifica se deve mostrar o botão de enviar resposta
  // Somente mostra o botão se:
  // 1. O status requer resposta (está finalizado)
  // 2. A ocorrência já foi salva com esse status
  // 3. Ainda não foi enviada resposta ao cidadão
  const showResponseButton = requiresResponse && isSalvo && !respostaEnviada;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <Button 
          type="button"
          onClick={onSalvar}
          disabled={!isFormValid}
          className="w-full"
        >
          Salvar Alterações
        </Button>
        
        {showResponseButton && onEnviarRespostaCidadao && (
          <Button 
            variant="outline" 
            type="button"
            className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 hover:border-green-300"
            onClick={onEnviarRespostaCidadao}
          >
            <Send size={16} className="mr-2" />
            Enviar Resposta ao Cidadão
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
