
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useContatos } from '@/hooks/useContatos';

interface NovoContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gabineteId: string;
  gabineteNome: string;
}

// Schema de validação para o formulário
const formSchema = z.object({
  nome: z.string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
  telefone: z.string()
    .min(10, { message: 'O telefone deve ter pelo menos 10 dígitos' })
    .max(15, { message: 'O telefone deve ter no máximo 15 dígitos' })
    .regex(/^\d+$/, { message: 'O telefone deve conter apenas números' }),
});

type FormValues = z.infer<typeof formSchema>;

const NovoContatoModal: React.FC<NovoContatoModalProps> = ({
  isOpen,
  onClose,
  gabineteId,
  gabineteNome
}) => {
  const { criarContato, isLoading } = useContatos(gabineteId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const result = await criarContato(data.nome, data.telefone);
    if (result) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar novo contato ao gabinete</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
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
                    <Input 
                      placeholder="Somente números" 
                      {...field} 
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-resolve-green hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoContatoModal;
