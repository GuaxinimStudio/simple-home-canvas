
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

interface EditarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  usuario: Usuario | null;
  gabinetes: { id: string; gabinete: string }[];
}

// Definimos aqui o tipo específico para o role
type UserRole = "vereador" | "administrador";

const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  telefone: z.string().optional().nullable(),
  role: z.enum(["vereador", "administrador"]), // Usando z.enum para garantir que apenas esses valores sejam aceitos
  gabinete_id: z.string().optional().nullable(),
});

const EditarUsuarioModal = ({
  open,
  onOpenChange,
  onSuccess,
  usuario,
  gabinetes,
}: EditarUsuarioModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      role: 'vereador' as UserRole, // Asseguramos que o tipo é correto
      gabinete_id: '',
    },
  });

  // Atualiza os valores do formulário quando o usuário muda
  useEffect(() => {
    if (usuario) {
      form.reset({
        nome: usuario.nome || '',
        telefone: usuario.telefone || '',
        role: (usuario.role as UserRole) || 'vereador', // Convertemos explicitamente o tipo
        gabinete_id: usuario.gabinete_id || '',
      });
    }
  }, [usuario, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!usuario) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: values.nome,
          telefone: values.telefone,
          role: values.role,
          gabinete_id: values.gabinete_id,
        })
        .eq('id', usuario.id);

      if (error) {
        toast.error('Erro ao atualizar usuário');
        console.error('Erro ao atualizar usuário:', error);
        return;
      }

      toast.success('Usuário atualizado com sucesso');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Edite as informações do usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone do usuário" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vereador">Vereador</SelectItem>
                      <SelectItem value="administrador">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gabinete_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secretaria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma secretaria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">Nenhuma</SelectItem> {/* Alterado de "" para "null" */}
                      {gabinetes.map((gabinete) => (
                        <SelectItem key={gabinete.id} value={gabinete.id}>
                          {gabinete.gabinete}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarUsuarioModal;
