
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GabineteCard from '@/components/gabinetes/GabineteCard';
import NovoGabineteModal from '@/components/gabinetes/NovoGabineteModal';
import useGabinetes from '@/hooks/useGabinetes';
import { useIsMobile } from '@/hooks/use-mobile';

const Gabinetes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { gabinetes, isLoading, refetch, searchTerm, setSearchTerm } = useGabinetes();
  const isMobile = useIsMobile();
  
  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Gabinetes</h1>
              <p className="text-gray-600">
                Gerencie os gabinetes e suas demandas
              </p>
            </div>
            
            <Button 
              className="bg-resolve-green hover:bg-green-700 w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {gabinetes && gabinetes.length > 0 ? (
                gabinetes.map((gabinete) => (
                  <GabineteCard 
                    key={gabinete.id} 
                    gabinete={gabinete} 
                    onDelete={handleSuccess}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `Nenhum gabinete encontrado com o termo "${searchTerm}"`
                      : "Nenhum gabinete cadastrado. Crie um novo gabinete clicando no botão acima."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para criar novo gabinete */}
      <NovoGabineteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Gabinetes;
