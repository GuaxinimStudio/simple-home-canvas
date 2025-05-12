
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GabineteData {
  gabinete: string;
  responsavel?: string | null;
  municipio?: string | null;
  estado?: string | null;
  telefone?: string | null;
}

const useEditarGabinete = (onSuccess?: () => void) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const editarGabinete = async (id: string, data: GabineteData) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('gabinetes')
        .update({
          gabinete: data.gabinete,
          responsavel: data.responsavel || null,
          municipio: data.municipio || null,
          estado: data.estado || null,
          telefone: data.telefone || null
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar gabinete:', error);
        toast.error('Erro ao atualizar gabinete: ' + error.message);
        return false;
      }

      toast.success('Gabinete atualizado com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (err) {
      console.error('Erro inesperado ao atualizar gabinete:', err);
      toast.error('Ocorreu um erro ao atualizar o gabinete.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    editarGabinete,
    isUpdating
  };
};

export default useEditarGabinete;
