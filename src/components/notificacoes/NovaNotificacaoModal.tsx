
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useGabinetes from '@/hooks/useGabinetes';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const formSchema = z.object({
  gabinete_id: z.string().optional(),
  informacao: z.string().min(1, 'A mensagem é obrigatória'),
  telefones: z.array(z.string().min(10, 'Telefone inválido'))
});

type NovaNotificacaoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NovaNotificacaoModal: React.FC<NovaNotificacaoModalProps> = ({ isOpen, onClose }) => {
  const { gabinetes = [], isLoading: isLoadingGabinetes } = useGabinetes();
  const { criarNotificacao, isCreating } = useNotificacoes();
  const [telefones, setTelefones] = React.useState<string[]>([]);
  const [telefoneInput, setTelefoneInput] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gabinete_id: undefined,
      informacao: '',
      telefones: []
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await criarNotificacao({
      gabinete_id: values.gabinete_id || null,
      informacao: values.informacao,
      telefones: values.telefones
    });
    form.reset();
    setTelefones([]);
    onClose();
  };

  const adicionarTelefone = () => {
    if (telefoneInput.length >= 10) {
      const novosTelefones = [...telefones, telefoneInput];
      setTelefones(novosTelefones);
      form.setValue('telefones', novosTelefones);
      setTelefoneInput('');
    }
  };

  const removerTelefone = (index: number) => {
    const novosTelefones = telefones.filter((_, i) => i !== index);
    setTelefones(novosTelefones);
    form.setValue('telefones', novosTelefones);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle>Nova Notificação</SheetTitle>
          <SheetDescription>
            Envie uma notificação para os contatos selecionados.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="gabinete_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gabinete (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingGabinetes}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um gabinete" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gabinetes.map((gabinete) => (
                        <SelectItem key={gabinete.id} value={gabinete.id}>
                          {gabinete.gabinete} - {gabinete.municipio || 'Sem município'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="informacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a mensagem a ser enviada"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefones"
              render={() => (
                <FormItem>
                  <FormLabel>Telefones</FormLabel>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={telefoneInput}
                        onChange={(e) => setTelefoneInput(e.target.value)}
                        placeholder="Digite um telefone"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={adicionarTelefone}
                        disabled={telefoneInput.length < 10}
                      >
                        Adicionar
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {telefones.map((telefone, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <span>{telefone}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerTelefone(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {!telefones.length && (
                      <p className="text-sm text-muted-foreground">
                        Adicione pelo menos um telefone para enviar a notificação.
                      </p>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating || telefones.length === 0}
                className="bg-green-500 hover:bg-green-600"
              >
                {isCreating ? 'Enviando...' : 'Enviar Notificação'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NovaNotificacaoModal;
