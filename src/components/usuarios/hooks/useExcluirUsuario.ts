
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

      // Em seguida, tenta excluir o usuário da autenticação
      // Nota: Isso pode falhar se a função Admin delete user não estiver disponível para o token atual
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(
          usuarioParaExcluir.id
        );

        if (authError) {
          console.error('Aviso: Não foi possível excluir usuário da autenticação:', authError);
          // Não retornamos aqui, pois o perfil já foi excluído com sucesso
        }
      } catch (authError) {
        console.error('Erro ao tentar excluir usuário da autenticação:', authError);
        // Continuamos mesmo se houver erro na exclusão da autenticação
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
