
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Método para fazer upload da imagem para o Supabase Storage
  const uploadImagemResolvido = async (id: string): Promise<string | null> => {
    try {
      if (!imagemResolvido) {
        return null;
      }

      const fileExt = imagemResolvido.name.split('.').pop();
      const fileName = `resolucao-${id}-${Date.now()}.${fileExt}`;
      
      // Upload da imagem para o Storage - usando o bucket 'resolucoes' que já foi criado
      const { data, error } = await supabase.storage
        .from('resolucoes')
        .upload(fileName, imagemResolvido, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Erro detalhado ao fazer upload:", error);
        toast.error(`Erro ao fazer upload: ${error.message}`);
        return null;
      }

      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('resolucoes')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
      return null;
    }
  };

  return {
    imagemResolvido,
    setImagemResolvido,
    imagemResolvidoPreview,
    setImagemResolvidoPreview,
    handleImagemResolvidoChange,
    uploadImagemResolvido
  };
};
