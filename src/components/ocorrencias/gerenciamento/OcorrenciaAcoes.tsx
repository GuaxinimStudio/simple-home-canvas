
import React from 'react';
import { Button } from "@/components/ui/button";
import { StatusType } from '@/types/ocorrencia';
import { isStatusRequireResponse } from '@/hooks/ocorrencia/ocorrenciaTypes';
import { Send, MailCheck, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface OcorrenciaAcoesProps {
  currentStatus: StatusType;
  isSalvo: boolean;
  onSalvar: () => void;
  onEnviarRespostaCidadao?: () => void;
  respostaEnviada?: boolean;
  isFormValid?: boolean;
  isPrazoDefinido: boolean;
  isDescricaoValida?: boolean;
  isImagemValida?: boolean;
  isEnviandoResposta?: boolean;
}

export const OcorrenciaAcoes: React.FC<OcorrenciaAcoesProps> = ({
  currentStatus,
  isSalvo,
  onSalvar,
  onEnviarRespostaCidadao,
  respostaEnviada = false,
  isFormValid = true,
  isPrazoDefinido = false,
  isDescricaoValida = true,
  isImagemValida = true,
  isEnviandoResposta = false
}) => {
  // Verifica se é um status que requer resposta (finalizado)
  const requiresResponse = isStatusRequireResponse(currentStatus);
  
  // MODIFICADO: Verifica se todos os dados necessários para enviar a resposta estão preenchidos
  // E se já foi salvo com esse status
  const isRespostaReady = isDescricaoValida && 
    (currentStatus !== 'Resolvido' || isImagemValida) && 
    isSalvo && 
    !respostaEnviada;
  
  // MODIFICADO: Mostrar o botão de enviar resposta somente após salvar as alterações
  const showResponseButton = requiresResponse && isRespostaReady;

  // Mostrar o botão de salvar quando o prazo estiver definido
  // E não mostrar se a resposta já foi enviada
  const showSaveButton = isPrazoDefinido && !respostaEnviada;
  
  // Mensagem para dados obrigatórios faltando
  const showRequiredFieldsMessage = requiresResponse && !isFormValid;
  
  // Mensagem para prazo não definido
  const showPrazoMessage = !isPrazoDefinido;
  
  // Mensagem quando faltam dados para enviar resposta ao cidadão
  const showRespostaIncompleteMessage = requiresResponse && isSalvo && 
    (!isDescricaoValida || (currentStatus === 'Resolvido' && !isImagemValida));
  
  // Verificar se deve mostrar o card de confirmação de resposta enviada
  const showResponseSentCard = requiresResponse && respostaEnviada;
  
  return (
    <div className="space-y-4">
      {/* Card de confirmação quando a resposta foi enviada */}
      {showResponseSentCard && (
        <Alert className="bg-green-50 border-green-200">
          <MailCheck className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-700 font-medium">Resposta enviada com sucesso!</AlertTitle>
          <AlertDescription className="text-green-600">
            A resposta foi enviada ao cidadão e o processo foi finalizado.
          </AlertDescription>
        </Alert>
      )}
      
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
        
        {showResponseButton && onEnviarRespostaCidadao && (
          <Button 
            variant="outline" 
            type="button"
            className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 hover:border-green-300"
            onClick={onEnviarRespostaCidadao}
            disabled={isEnviandoResposta}
          >
            {isEnviandoResposta ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Enviando resposta...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Enviar Resposta ao Cidadão
              </>
            )}
          </Button>
        )}

        {showRequiredFieldsMessage && (
          <p className="text-red-500 text-sm">
            Preencha todos os campos obrigatórios para salvar as alterações.
          </p>
        )}

        {showPrazoMessage && (
          <p className="text-orange-500 text-sm">
            Defina um prazo estimado para habilitar o botão de salvar.
          </p>
        )}

        {showRespostaIncompleteMessage && (
          <p className="text-amber-600 text-sm">
            Preencha todos os campos obrigatórios e salve as alterações antes de enviar a resposta ao cidadão.
          </p>
        )}
      </div>
    </div>
  );
};
