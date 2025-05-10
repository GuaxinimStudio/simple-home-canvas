
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import useUsuarios from '@/hooks/useUsuarios';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import NovoUsuarioModal from '@/components/usuarios/NovoUsuarioModal';

const Usuarios = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { 
    usuarios: usuariosFiltrados, 
    isLoading, 
    error, 
    refetch, 
    searchTerm, 
    setSearchTerm,
    gabinetes 
  } = useUsuarios();

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

            <UsuariosTable 
              usuarios={usuariosFiltrados} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>
      </div>

      {/* Modal para criar novo usuário */}
      <NovoUsuarioModal 
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={refetch}
        gabinetes={gabinetes}
      />
    </div>
  );
};

export default Usuarios;
