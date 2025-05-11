
import React, { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, Upload, FileIcon, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArquivoUploadProps {
  arquivo: File | null;
  setArquivo: (file: File | null) => void;
  isLoading: boolean;
}

export const ArquivoUpload: React.FC<ArquivoUploadProps> = ({ 
  arquivo, 
  setArquivo,
  isLoading 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);

    // Criar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const removerArquivo = () => {
    setArquivo(null);
    setPreviewUrl(null);
    
    // Reset do input de arquivo
    const fileInput = document.getElementById('arquivo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const getArquivoIcon = () => {
    if (!arquivo) return null;
    
    if (arquivo.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (arquivo.type === 'application/pdf') {
      return <FileIcon className="h-5 w-5 text-red-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel htmlFor="arquivo">Arquivo ou Imagem (Opcional)</FormLabel>
      
      {arquivo ? (
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            {getArquivoIcon()}
            <span className="text-sm text-gray-700 truncate max-w-[180px]">
              {arquivo.name}
            </span>
            <span className="text-xs text-gray-500">
              {(arquivo.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={removerArquivo}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
          <label 
            htmlFor="arquivo" 
            className={cn(
              "flex flex-col items-center justify-center w-full h-full cursor-pointer",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Upload className="h-6 w-6 mb-2 text-gray-500" />
            <span className="text-sm text-gray-600">Clique para escolher um arquivo</span>
            <input
              id="arquivo"
              type="file"
              className="hidden"
              onChange={handleArquivoChange}
              accept="image/*,application/pdf"
              disabled={isLoading}
            />
          </label>
        </div>
      )}
      
      {/* Preview da imagem */}
      {previewUrl && (
        <div className="mt-2">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-36 rounded-md mx-auto border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
