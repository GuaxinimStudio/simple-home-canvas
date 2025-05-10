
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Save, Check, MailOpen } from "lucide-react";

interface OcorrenciaAcoesProps {
  isResolvido: boolean;
  isSalvo: boolean;
  onSalvar: () => void;
  onEnviarRespostaCidadao?: () => void;
  respostaEnviada?: boolean;
}

export const OcorrenciaAcoes: React.FC<OcorrenciaAcoesProps> = ({
  isResolvido,
  isSalvo,
  onSalvar,
  onEnviarRespostaCidadao,
  respostaEnviada
}) => {
  return (
    <div className="mt-6 space-y-4">
      {/* Botão Salvar aparece enquanto não estiver salvo como resolvido */}
      {(!isResolvido || !isSalvo) && (
        <Button 
          onClick={onSalvar}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          <Save className="mr-2" />
          Salvar Alterações
        </Button>
      )}
      
      {/* Botão de Enviar Resposta só aparece quando estiver resolvido, salvo e ainda não enviado resposta */}
      {isResolvido && isSalvo && onEnviarRespostaCidadao && !respostaEnviada && (
        <Button 
          onClick={onEnviarRespostaCidadao}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <Send className="mr-2" />
          Enviar Resposta para o Cidadão
        </Button>
      )}

      {/* Mensagem de confirmação que a resposta foi enviada */}
      {isResolvido && isSalvo && respostaEnviada && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center">
          <MailOpen className="w-5 h-5 mr-2 text-green-500" />
          <div>
            <p className="font-medium">Demanda finalizada!</p>
            <p className="text-sm">O cidadão já foi notificado sobre a resolução desta ocorrência.</p>
          </div>
        </div>
      )}
    </div>
  );
};
