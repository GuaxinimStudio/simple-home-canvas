
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
  isPrazoDefinido: boolean;
  isDescricaoValida?: boolean;
  isImagemValida?: boolean;
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
  isImagemValida = true
}) => {
  // Verifica se é um status que requer resposta (finalizado)
  const requiresResponse = isStatusRequireResponse(currentStatus);
  
  // Verifica se todos os dados necessários para enviar a resposta estão preenchidos
  const isRespostaReady = isDescricaoValida && 
    (currentStatus !== 'Resolvido' || isImagemValida); // Imagem é obrigatória apenas para status Resolvido
  
  // Verifica se deve mostrar o botão de enviar resposta
  // Somente mostra o botão se:
  // 1. O status requer resposta (está finalizado)
  // 2. A ocorrência já foi salva com esse status no banco de dados
  // 3. Ainda não foi enviada resposta ao cidadão
  // 4. Todos os campos obrigatórios estão preenchidos
  const showResponseButton = requiresResponse && isSalvo && !respostaEnviada && isRespostaReady;

  // Verifica se deve mostrar o botão de salvar alterações
  // 1. Primeiro verifica se um prazo foi definido
  // 2. Não mostra se o status requer resposta, já está salvo e ainda não foi enviada resposta
  const showSaveButton = isPrazoDefinido && !(requiresResponse && isSalvo && !respostaEnviada);
  
  // Verifica se deve mostrar a mensagem de campos obrigatórios
  // Só mostra se não estiver salvo e o formulário for inválido
  const showRequiredFieldsMessage = requiresResponse && !isSalvo && !isFormValid;

  // Mensagem para quando o prazo não está definido
  const showPrazoMessage = !isPrazoDefinido && !isSalvo;
  
  // Mensagem quando faltam dados para enviar resposta ao cidadão
  const showRespostaIncompleteMessage = requiresResponse && isSalvo && !respostaEnviada && !isRespostaReady;
  
  // NOVA LÓGICA: Define quando os campos devem ser bloqueados
  // Bloqueia os campos quando:
  // 1. O status requer resposta (está finalizado)
  // 2. Já está salvo no banco de dados
  // 3. Todos os campos necessários estão preenchidos (a resposta está pronta para ser enviada)
  // 4. A resposta ainda não foi enviada
  const shouldBlockFields = requiresResponse && isSalvo && isRespostaReady && !respostaEnviada;
  
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

        {shouldBlockFields && (
          <p className="text-blue-600 text-sm">
            Campos bloqueados. Envie a resposta ao cidadão para finalizar o processo.
          </p>
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
