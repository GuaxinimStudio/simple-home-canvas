
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useLocalizacao from '@/hooks/useLocalizacao';

interface GabineteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  gabinete: z.string().min(2, "O nome do gabinete deve ter pelo menos 2 caracteres"),
  responsavel: z.string().optional(),
  municipio: z.string().min(2, "O município deve ter pelo menos 2 caracteres"),
  estado: z.string().min(2, "O estado deve ter pelo menos 2 caracteres"),
  telefone: z.string().optional()
});

const GabineteForm: React.FC<GabineteFormProps> = ({ onSuccess, onCancel }) => {
  const { estados, municipios, selectedEstado, setSelectedEstado } = useLocalizacao();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gabinete: "",
      responsavel: "",
      municipio: "",
      estado: "",
      telefone: ""
    }
  });

  // Handler para mudança de estado
  const handleEstadoChange = (value: string) => {
    setSelectedEstado(value);
    // Limpar o campo de município quando o estado mudar
    form.setValue('municipio', '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Encontrar o nome do estado a partir da sigla
    const estadoNome = estados.find(estado => estado.sigla === values.estado)?.nome || values.estado;
    
    const { error } = await supabase
      .from('gabinetes')
      .insert([
        {
          gabinete: values.gabinete,
          responsavel: values.responsavel || null,
          municipio: values.municipio,
          estado: estadoNome, // Salvar o nome do estado, não a sigla
          telefone: values.telefone || null
        }
      ]);

    if (error) {
      toast.error('Erro ao criar gabinete: ' + error.message);
      return;
    }

    toast.success('Gabinete criado com sucesso!');
    form.reset();
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gabinete"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Gabinete</FormLabel>
              <FormControl>
                <Input placeholder="Nome do gabinete" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input placeholder="Nome do responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleEstadoChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.sigla}>
                      {estado.nome}
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
          name="municipio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Município</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedEstado}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedEstado ? "Selecione um município" : "Selecione um estado primeiro"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {municipios.map((municipio) => (
                    <SelectItem key={municipio.id} value={municipio.nome}>
                      {municipio.nome}
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
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Telefone de contato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-resolve-green hover:bg-green-700"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GabineteForm;
