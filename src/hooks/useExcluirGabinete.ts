
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const useExcluirGabinete = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const excluirGabinete = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Verificar se existem problemas vinculados ao gabinete
      const { data: problemas, error: problemasError } = await supabase
        .from('problemas')
        .select('id')
        .eq('gabinete_id', id)
        .limit(1);
        
      if (problemasError) {
        throw new Error('Erro ao verificar problemas vinculados');
      }
      
      if (problemas && problemas.length > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Este gabinete possui problemas vinculados e não pode ser excluído.',
          variant: 'destructive'
        });
        return false;
      }
      
      // Verificar se existem usuários vinculados ao gabinete
      const { data: usuarios, error: usuariosError } = await supabase
        .from('profiles')
        .select('id')
        .eq('gabinete_id', id)
        .limit(1);
        
      if (usuariosError) {
        throw new Error('Erro ao verificar usuários vinculados');
      }
      
      if (usuarios && usuarios.length > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Este gabinete possui usuários vinculados e não pode ser excluído.',
          variant: 'destructive'
        });
        return false;
      }

      // Excluir gabinete
      const { error } = await supabase
        .from('gabinetes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Sucesso!',
        description: 'Gabinete excluído com sucesso',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir gabinete:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o gabinete',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    excluirGabinete,
    isDeleting,
  };
};

export default useExcluirGabinete;
