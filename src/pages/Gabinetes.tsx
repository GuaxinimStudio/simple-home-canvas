
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Building, MapPin, Phone, PlusCircle, Eye, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GabineteProps {
  id: string;
  gabinete: string;
  estado: string | null;
  municipio: string | null;
  telefone: string | null;
  responsavel: string | null;
  profiles: { id: string; nome: string | null }[];
}

const GabineteCard: React.FC<{ gabinete: GabineteProps }> = ({ gabinete }) => {
  return (
    <Card className="bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="bg-green-50 p-2 rounded-md">
            <Building className="h-5 w-5 text-resolve-green" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">{gabinete.gabinete}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {gabinete.responsavel ? `Responsável: ${gabinete.responsavel}` : 'Sem responsável definido'}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{gabinete.municipio ? `${gabinete.municipio}, ${gabinete.estado}` : 'Localização não definida'}</span>
              </div>

              {gabinete.telefone && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{gabinete.telefone}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>{gabinete.profiles.length} membros vinculados</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4 text-gray-500" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlusCircle className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Gabinetes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: gabinetes, isLoading } = useQuery({
    queryKey: ['gabinetes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gabinetes')
        .select('*, profiles(id, nome)')
        .order('gabinete');
        
      if (error) {
        toast.error('Erro ao carregar gabinetes: ' + error.message);
        console.error('Erro ao carregar gabinetes:', error);
        return [];
      }
      
      return data || [];
    }
  });
  
  const filteredGabinetes = gabinetes?.filter(gabinete =>
    gabinete.gabinete.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gabinete.responsavel && gabinete.responsavel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (gabinete.municipio && gabinete.municipio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Gabinetes</h1>
              <p className="text-gray-600">
                Gerencie os gabinetes e suas demandas
              </p>
            </div>
            
            <Button className="bg-resolve-green hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Gabinete
            </Button>
          </div>
          
          {/* Barra de pesquisa */}
          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Pesquisar gabinetes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Grid de cards */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resolve-green"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGabinetes?.map((gabinete) => (
                <GabineteCard key={gabinete.id} gabinete={gabinete} />
              ))}
              
              {filteredGabinetes?.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Nenhum gabinete encontrado com o termo "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gabinetes;
