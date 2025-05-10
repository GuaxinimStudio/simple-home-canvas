
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Save } from "lucide-react";

interface OcorrenciaAcoesProps {
  isResolvido: boolean;
  isSalvo: boolean;
  onSalvar: () => void;
  onEnviarRespostaCidadao?: () => void;
}

export const OcorrenciaAcoes: React.FC<OcorrenciaAcoesProps> = ({
  isResolvido,
  isSalvo,
  onSalvar,
  onEnviarRespostaCidadao
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
      
      {/* Botão de Enviar Resposta só aparece quando estiver resolvido e salvo */}
      {isResolvido && isSalvo && onEnviarRespostaCidadao && (
        <Button 
          onClick={onEnviarRespostaCidadao}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <Send className="mr-2" />
          Enviar Resposta para o Cidadão
        </Button>
      )}
    </div>
  );
};
