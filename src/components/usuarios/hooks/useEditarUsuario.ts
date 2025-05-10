
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formSchema, UsuarioFormValues, UserRole } from '../schema/usuarioSchema';

interface Usuario {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  role: string;
  gabinete_id: string | null;
  gabinetes: {
    gabinete: string;
  } | null;
}

interface UseEditarUsuarioProps {
  usuario: Usuario | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const useEditarUsuario = ({ usuario, onSuccess, onClose }: UseEditarUsuarioProps) => {
  const [showGabineteField, setShowGabineteField] = useState(true);
  
  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      role: 'vereador' as UserRole,
      gabinete_id: '',
    },
  });
  
  // Observar mudanças no campo role para mostrar/ocultar o campo de secretaria
  const watchRole = form.watch("role");
  
  useEffect(() => {
    // Se o papel for administrador, ocultar o campo de secretaria
    setShowGabineteField(watchRole !== "administrador");
    
    // Se mudar para administrador, limpar o valor do gabinete_id
    if (watchRole === "administrador") {
      form.setValue("gabinete_id", null);
    }
  }, [watchRole, form]);

  // Atualiza os valores do formulário quando o usuário muda
  useEffect(() => {
    if (usuario) {
      form.reset({
        nome: usuario.nome || '',
        telefone: usuario.telefone || '',
        role: (usuario.role as UserRole) || 'vereador',
        gabinete_id: usuario.gabinete_id || '',
      });
      
      // Definir a visibilidade inicial do campo de secretaria com base no papel do usuário
      setShowGabineteField(usuario.role !== "administrador");
    }
  }, [usuario, form]);

  const onSubmit = async (values: UsuarioFormValues) => {
    if (!usuario) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: values.nome,
          telefone: values.telefone,
          role: values.role,
          gabinete_id: values.role === "administrador" ? null : values.gabinete_id,
        })
        .eq('id', usuario.id);

      if (error) {
        toast.error('Erro ao atualizar usuário');
        console.error('Erro ao atualizar usuário:', error);
        return;
      }

      toast.success('Usuário atualizado com sucesso');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return {
    form,
    showGabineteField,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
