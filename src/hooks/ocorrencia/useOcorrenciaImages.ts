
import { useState } from 'react';

export const useOcorrenciaImages = (initialPreview: string | null = null) => {
  const [imagemResolvido, setImagemResolvido] = useState<File | null>(null);
  const [imagemResolvidoPreview, setImagemResolvidoPreview] = useState<string | null>(initialPreview);
  
  const handleImagemResolvidoChange = async (file: File | null) => {
    if (file) {
      // Criar uma URL temporária para preview
      const previewUrl = URL.createObjectURL(file);
      setImagemResolvidoPreview(previewUrl);
      setImagemResolvido(file);
    } else {
      // Se null, limpar o preview
      if (imagemResolvidoPreview && !imagemResolvidoPreview.startsWith('http')) {
        URL.revokeObjectURL(imagemResolvidoPreview);
      }
      setImagemResolvidoPreview(null);
      setImagemResolvido(null);
    }
  };

  return {
    imagemResolvido,
    setImagemResolvido,
    imagemResolvidoPreview,
    setImagemResolvidoPreview,
    handleImagemResolvidoChange
  };
};
