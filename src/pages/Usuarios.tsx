
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Usuarios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar dados de usuários com gabinetes associados
  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          nome,
          email,
          telefone,
          role,
          gabinete_id,
          gabinetes (
            id,
            gabinete
          )
        `)
        .order('nome');

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: error.message
        });
        return [];
      }

      return data || [];
    }
  });

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
            <Button className="bg-resolve-green hover:bg-resolve-green/90">
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
    </div>
  );
};

export default Usuarios;
