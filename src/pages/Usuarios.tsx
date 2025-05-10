
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Usuarios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

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

  // Buscar dados de usuários - Usando a abordagem dividida para evitar recursão RLS
  const { data: usuarios, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      try {
        // Primeiro buscamos os IDs e dados básicos dos perfis
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            nome,
            email,
            telefone,
            role,
            gabinete_id
          `)
          .order('nome');

        if (profilesError) {
          throw profilesError;
        }

        // Agora obtemos os dados dos gabinetes em uma consulta separada
        const gabineteIds = profilesData
          .filter(profile => profile.gabinete_id)
          .map(profile => profile.gabinete_id);

        let gabinetesMap = {};
        
        if (gabineteIds.length > 0) {
          const { data: gabinetesData, error: gabinetesError } = await supabase
            .from('gabinetes')
            .select('id, gabinete')
            .in('id', gabineteIds);

          if (gabinetesError) {
            console.error('Erro ao buscar gabinetes:', gabinetesError);
          } else if (gabinetesData) {
            // Criar um mapa de ID para objeto de gabinete
            gabinetesMap = gabinetesData.reduce((acc, gabinete) => {
              acc[gabinete.id] = gabinete;
              return acc;
            }, {});
          }
        }

        // Combinar os dados de perfis com os dados de gabinetes
        const usuariosCompletos = profilesData.map(profile => ({
          ...profile,
          gabinetes: profile.gabinete_id ? gabinetesMap[profile.gabinete_id] : null
        }));

        console.log('Usuários carregados com sucesso:', usuariosCompletos.length);
        return usuariosCompletos || [];
      } catch (err) {
        console.error('Erro na consulta de usuários:', err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: err.message
        });
        return [];
      }
    }
  });

  // Buscar gabinetes para o select
  const { data: gabinetes } = useQuery({
    queryKey: ['gabinetes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gabinetes')
        .select('id, gabinete')
        .order('gabinete');

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar gabinetes",
          description: error.message
        });
        return [];
      }

      return data || [];
    }
  });

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
      setSheetOpen(false);
      form.reset();
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error.message
      });
    }
  };

  // Filtrar usuários baseado no termo de busca
  const usuariosFiltrados = usuarios?.filter(user => 
    !searchTerm || 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para traduzir o role
  const traduzirRole = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'vereador':
        return 'Vereador';
      default:
        return role;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
              <p className="text-gray-500 text-sm">Gerencie os usuários do sistema</p>
            </div>
            <Button 
              className="bg-resolve-green hover:bg-resolve-green/90"
              onClick={() => setSheetOpen(true)}
            >
              <UserPlus className="mr-1 h-4 w-4" /> Novo Usuário
            </Button>
          </div>

          <div className="bg-white rounded-md shadow">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Pesquisar usuários..." 
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Secretaria</TableHead>
                    <TableHead className="w-[60px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Carregando usuários...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        Erro ao carregar usuários
                      </TableCell>
                    </TableRow>
                  ) : usuariosFiltrados && usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome || "Sem nome"}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.telefone || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              usuario.role === 'administrador' ? 'bg-resolve-yellow' : 'bg-resolve-teal'
                            }`}></div>
                            {traduzirRole(usuario.role)}
                          </div>
                        </TableCell>
                        <TableCell>{usuario.gabinetes?.gabinete || "-"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para criar novo usuário */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Novo Usuário</SheetTitle>
            <SheetDescription>
              Adicione um novo usuário ao sistema. O usuário receberá um e-mail para definir sua senha.
            </SheetDescription>
          </SheetHeader>

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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Usuarios;
