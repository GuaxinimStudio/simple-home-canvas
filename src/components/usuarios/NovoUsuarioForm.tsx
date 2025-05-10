
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';

// Esquema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(2, { message: "Nome precisa ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z.string().optional(),
  role: z.enum(["administrador", "vereador"], {
    required_error: "Por favor selecione um tipo de usuário.",
  }),
  gabinete_id: z.string().optional(),
});

interface NovoUsuarioFormProps {
  onSuccess: () => void;
  onClose: () => void;
  gabinetes: {id: string, gabinete: string}[] | undefined;
}

const NovoUsuarioForm = ({ onSuccess, onClose, gabinetes }: NovoUsuarioFormProps) => {
  const { toast } = useToast();
  
  // Configuração do formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      role: "vereador",
    },
  });

  // Função para criar novo usuário
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Primeiro, criamos o usuário na autenticação
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: Math.random().toString(36).slice(-8) + 'A1!', // Senha temporária aleatória
        options: {
          data: {
            nome: values.nome,
            telefone: values.telefone,
            role: values.role,
            gabinete_id: values.gabinete_id
          }
        }
      });

      if (authError) throw authError;

      // Atualizar manualmente o perfil já que o trigger pode não ser confiável em desenvolvimento
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome: values.nome,
          telefone: values.telefone,
          role: values.role,
          gabinete_id: values.gabinete_id || null
        })
        .eq('id', authUser.user!.id);

      if (profileError) throw profileError;

      toast({
        title: "Usuário criado com sucesso!",
        description: "Um e-mail foi enviado para o usuário definir sua senha.",
      });

      // Fechar o modal e atualizar a lista
      onClose();
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error.message
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
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
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
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
              <FormLabel>Tipo de Usuário</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="vereador">Vereador</SelectItem>
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
              <FormLabel>Gabinete</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gabinete" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gabinetes?.map((gabinete) => (
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

        <SheetFooter className="pt-4">
          <SheetClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </SheetClose>
          <Button type="submit" className="bg-resolve-green hover:bg-resolve-green/90">Criar Usuário</Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default NovoUsuarioForm;
