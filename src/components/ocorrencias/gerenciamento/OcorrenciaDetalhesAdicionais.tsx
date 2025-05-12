
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import { toast } from "sonner";
import { StatusType } from '@/types/ocorrencia';

interface OcorrenciaDetalhesAdicionaisProps {
  currentStatus: StatusType;
  descricaoResolvido: string;
  onDescricaoResolvidoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  imagemResolvidoPreview: string | null;
  onImagemResolvidoChange: (file: File | null) => void;
  isResolvido: boolean;
  isRequired?: boolean;
  isDescricaoValida?: boolean;
  isImagemValida?: boolean;
}

export const OcorrenciaDetalhesAdicionais: React.FC<OcorrenciaDetalhesAdicionaisProps> = ({
  currentStatus,
  descricaoResolvido,
  onDescricaoResolvidoChange,
  imagemResolvidoPreview,
  onImagemResolvidoChange,
  isResolvido,
  isRequired = false,
  isDescricaoValida = true,
  isImagemValida = true
}) => {
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

  // Textos contextuais baseados no status
  const getTitulos = () => {
    if (currentStatus === 'Resolvido') {
      return {
        descricao: "Detalhes da Resolução",
        placeholder: "Descreva como o problema foi resolvido...",
        imagem: "Imagem da Resolução"
      };
    } else if (currentStatus === 'Informações Insuficientes') {
      return {
        descricao: "Orientações para o Cidadão",
        placeholder: "Explique quais informações são necessárias...",
        imagem: "Imagem de Apoio (opcional)"
      };
    } else {
      return {
        descricao: "Detalhes Adicionais",
        placeholder: "Adicione informações relevantes...",
        imagem: "Imagem de Apoio"
      };
    }
  };

  const titulos = getTitulos();

  // Verifica se a imagem é obrigatória
  const isImagemObrigatoria = currentStatus === 'Resolvido';

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            {titulos.descricao}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {!isDescricaoValida && (
            <span className="text-red-500 text-xs">
              Campo obrigatório
            </span>
          )}
        </div>
        <Textarea 
          placeholder={titulos.placeholder}
          className={`min-h-[120px] w-full ${!isDescricaoValida ? 'border-gray-300' : ''}`}
          value={descricaoResolvido}
          onChange={onDescricaoResolvidoChange}
          disabled={isResolvido}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            {titulos.imagem}
            {isRequired && isImagemObrigatoria && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {!isImagemValida && isImagemObrigatoria && (
            <span className="text-red-500 text-xs">
              Imagem obrigatória
            </span>
          )}
        </div>
        
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
          <div className={`border-2 border-dashed border-gray-300 rounded-md p-6 text-center`}>
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
                {isImagemObrigatoria ? "Clique para adicionar imagem (obrigatório)" : "Clique para fazer upload de imagem"}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                (Máximo 5MB)
              </span>
            </label>
          </div>
        )}
      </div>
    </>
  );
};
