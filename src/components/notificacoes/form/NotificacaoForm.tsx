
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useGabinetes from '@/hooks/useGabinetes';
import { ArquivoUpload } from './ArquivoUpload';

export const formSchema = z.object({
  gabinete_id: z.string().min(1, 'Selecione um gabinete'),
  informacao: z.string().min(1, 'A mensagem é obrigatória')
});

export type NotificacaoFormData = z.infer<typeof formSchema>;

type NotificacaoFormProps = {
  onSubmit: (values: NotificacaoFormData, arquivo: File | null) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
};

export const NotificacaoForm = ({ onSubmit, isLoading, onCancel }: NotificacaoFormProps) => {
  const { gabinetes = [], isLoading: isLoadingGabinetes } = useGabinetes();
  const [arquivo, setArquivo] = useState<File | null>(null);

  const form = useForm<NotificacaoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gabinete_id: '',
      informacao: ''
    }
  });

  const handleSubmit = async (values: NotificacaoFormData) => {
    await onSubmit(values, arquivo);
    form.reset();
    setArquivo(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gabinete_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gabinete</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingGabinetes || isLoading}
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ArquivoUpload 
          arquivo={arquivo} 
          setArquivo={setArquivo} 
          isLoading={isLoading} 
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600"
          >
            {isLoading ? 'Enviando...' : 'Enviar Notificação'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
