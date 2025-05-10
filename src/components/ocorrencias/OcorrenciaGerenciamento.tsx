
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { StatusType } from '@/types/ocorrencia';
import { Upload } from 'lucide-react';

interface OcorrenciaGerenciamentoProps {
  currentStatus: StatusType;
  onStatusChange: (value: string) => void;
  prazoEstimado: string;
  onPrazoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedDepartamento: string;
  onDepartamentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSalvar: () => void;
  descricaoResolvido: string;
  onDescricaoResolvidoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImagemResolvidoChange: (file: File | null) => void;
  imagemResolvidoPreview: string | null;
  onEnviarRespostaCidadao?: () => void;
}

export const OcorrenciaGerenciamento: React.FC<OcorrenciaGerenciamentoProps> = ({
  currentStatus,
  onStatusChange,
  prazoEstimado,
  onPrazoChange,
  selectedDepartamento,
  onDepartamentoChange,
  onSalvar,
  descricaoResolvido,
  onDescricaoResolvidoChange,
  onImagemResolvidoChange,
  imagemResolvidoPreview,
  onEnviarRespostaCidadao
}) => {
  // Verifica se um prazo foi definido
  const isPrazoDefinido = prazoEstimado !== '';
  
  // Verifica se o status está resolvido para bloquear os campos
  const isResolvido = currentStatus === "Resolvido";
  
  // Função para lidar com a alteração do status
  const handleStatusChange = (value: string) => {
    if (!isPrazoDefinido) {
      toast.error("É necessário definir um prazo antes de alterar o status.");
      return;
    }
    onStatusChange(value);
  };

  // Verifica se devemos mostrar os campos adicionais
  const showAdditionalFields = currentStatus === "Resolvido" || currentStatus === "Informações Insuficientes";
  
  // Manipulador de arquivo de imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. O tamanho máximo é 5MB.");
        return;
      }
      onImagemResolvidoChange(file);
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Gerenciamento</h2>
      <p className="text-sm text-gray-500 mb-6">
        Atualize as informações da ocorrência conforme o andamento.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Situação Atual</h3>
          <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full inline-flex items-center text-sm font-medium">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {currentStatus}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium mb-2">Atualizar Situação</h3>
            <span className="text-orange-500 text-xs">
              {isPrazoDefinido ? 
                "Prazo definido, status liberado" : 
                "Define um prazo estimado para poder alterar o status"}
            </span>
          </div>
          
          <Select 
            value={currentStatus} 
            onValueChange={handleStatusChange}
            disabled={!isPrazoDefinido || isResolvido}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Resolvido">Resolvido</SelectItem>
              <SelectItem value="Informações Insuficientes">Informações Insuficientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        {showAdditionalFields && (
          <>
            <div>
              <h3 className="font-medium mb-2">
                {currentStatus === "Resolvido" ? "Detalhes da Resolução" : "Orientações para o Cidadão"}
              </h3>
              <Textarea 
                placeholder={currentStatus === "Resolvido" 
                  ? "Descreva como o problema foi resolvido..." 
                  : "Explique que informações são necessárias..."
                }
                className="min-h-[120px] w-full"
                value={descricaoResolvido}
                onChange={onDescricaoResolvidoChange}
                disabled={isResolvido}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">
                {currentStatus === "Resolvido" ? "Imagem da Resolução" : "Imagem de Apoio"}
              </h3>
              
              {imagemResolvidoPreview ? (
                <div className="relative mb-3">
                  <img 
                    src={imagemResolvidoPreview} 
                    alt="Imagem de comprovação" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  {!isResolvido && (
                    <button 
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => onImagemResolvidoChange(null)}
                      type="button"
                    >
                      X
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isResolvido}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className={`flex flex-col items-center justify-center ${isResolvido ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Clique para fazer upload de imagem
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      (Máximo 5MB)
                    </span>
                  </label>
                </div>
              )}
            </div>
          </>
        )}

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
      </div>
    </Card>
  );
};
