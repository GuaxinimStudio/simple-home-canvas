
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import { toast } from "sonner";

interface OcorrenciaDetalhesAdicionaisProps {
  currentStatus: string;
  descricaoResolvido: string;
  onDescricaoResolvidoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  imagemResolvidoPreview: string | null;
  onImagemResolvidoChange: (file: File | null) => void;
  isResolvido: boolean;
}

export const OcorrenciaDetalhesAdicionais: React.FC<OcorrenciaDetalhesAdicionaisProps> = ({
  currentStatus,
  descricaoResolvido,
  onDescricaoResolvidoChange,
  imagemResolvidoPreview,
  onImagemResolvidoChange,
  isResolvido
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

  return (
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
  );
};
