
import React, { useState } from 'react';
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
import { X, Upload, FileIcon, FileCheck, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { criarNotificacao, isCreating, isUploading } = useNotificacoes();
  const [telefones, setTelefones] = useState<string[]>([]);
  const [telefoneInput, setTelefoneInput] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isLoading = isCreating || isUploading;

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
      novaNotificacao: {
        gabinete_id: values.gabinete_id || null,
        informacao: values.informacao,
        telefones: values.telefones
      },
      arquivo: arquivo || undefined
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    form.reset();
    setTelefones([]);
    setTelefoneInput('');
    setArquivo(null);
    setPreviewUrl(null);
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

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);

    // Criar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const removerArquivo = () => {
    setArquivo(null);
    setPreviewUrl(null);
    
    // Reset do input de arquivo
    const fileInput = document.getElementById('arquivo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const getArquivoIcon = () => {
    if (!arquivo) return null;
    
    if (arquivo.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (arquivo.type === 'application/pdf') {
      return <FileIcon className="h-5 w-5 text-red-500" />;
    } else {
      return <FileCheck className="h-5 w-5 text-green-500" />;
    }
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

            {/* Upload de arquivo */}
            <div className="space-y-2">
              <FormLabel htmlFor="arquivo">Arquivo ou Imagem (Opcional)</FormLabel>
              
              {arquivo ? (
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    {getArquivoIcon()}
                    <span className="text-sm text-gray-700 truncate max-w-[180px]">
                      {arquivo.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(arquivo.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={removerArquivo}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                  <label 
                    htmlFor="arquivo" 
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-full cursor-pointer",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Upload className="h-6 w-6 mb-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Clique para escolher um arquivo</span>
                    <input
                      id="arquivo"
                      type="file"
                      className="hidden"
                      onChange={handleArquivoChange}
                      accept="image/*,application/pdf"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              )}
              
              {/* Preview da imagem */}
              {previewUrl && (
                <div className="mt-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-36 rounded-md mx-auto border border-gray-200"
                  />
                </div>
              )}
            </div>

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
                        disabled={isLoading}
                      />
                      <Button 
                        type="button" 
                        onClick={adicionarTelefone}
                        disabled={telefoneInput.length < 10 || isLoading}
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
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {!telefones.length && !form.getValues('gabinete_id') && (
                      <p className="text-sm text-muted-foreground">
                        Adicione pelo menos um telefone ou selecione um gabinete para enviar a notificação.
                      </p>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || (telefones.length === 0 && !form.getValues('gabinete_id'))}
                className="bg-green-500 hover:bg-green-600"
              >
                {isLoading ? 'Enviando...' : 'Enviar Notificação'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NovaNotificacaoModal;
