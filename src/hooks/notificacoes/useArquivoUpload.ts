
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArquivoInfo } from './types';

export const useArquivoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadArquivo = async (file: File): Promise<ArquivoInfo | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `notificacoes/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('arquivos')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('arquivos')
        .getPublicUrl(filePath);
        
      return {
        url: publicUrl,
        tipo: file.type
      };
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast.error('Erro ao fazer upload do arquivo');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadArquivo,
    isUploading
  };
};
