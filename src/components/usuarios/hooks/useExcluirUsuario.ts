
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Usuario {
  id: string;
  nome: string | null;
}

export const useExcluirUsuario = (onUsuarioUpdated: () => void) => {
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (usuario: Usuario) => {
    setUsuarioParaExcluir(usuario);
    setIsDeleteDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!usuarioParaExcluir) return;

    try {
      // Primeiro exclui o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', usuarioParaExcluir.id);

      if (profileError) {
        toast.error('Erro ao excluir perfil do usuário');
        console.error('Erro ao excluir perfil:', profileError);
        return;
      }

      // Em seguida, exclui o usuário da auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        usuarioParaExcluir.id
      );

      if (authError) {
        toast.error('Erro ao excluir conta do usuário');
        console.error('Erro ao excluir usuário:', authError);
        return;
      }

      toast.success('Usuário excluído com sucesso');
      onUsuarioUpdated();
    } catch (error) {
      toast.error('Erro ao excluir usuário');
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setUsuarioParaExcluir(null);
    }
  };

  return {
    usuarioParaExcluir,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    confirmarExclusao
  };
};
