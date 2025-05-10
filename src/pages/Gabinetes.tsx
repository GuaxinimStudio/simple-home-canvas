
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Building, MapPin, Phone, PlusCircle, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GabineteProps {
  nome: string;
  departamento: string;
  localizacao: string;
  contatos: number;
}

const GABINETES_MOCK: GabineteProps[] = [
  {
    nome: 'Gabinete do Prefeito',
    departamento: 'Administração Municipal',
    localizacao: 'Uruaçu, GO - GO',
    contatos: 3
  },
  {
    nome: 'Gabinete do Vice-Prefeito',
    departamento: 'Administração Municipal',
    localizacao: 'Uruaçu - GO',
    contatos: 2
  },
  {
    nome: 'Gabinete de Assuntos Estratégicos',
    departamento: 'Planejamento Municipal',
    localizacao: 'Uruaçu - GO',
    contatos: 1
  },
  {
    nome: 'Gabinete de Ações Comunitárias',
    departamento: 'Desenvolvimento Social',
    localizacao: 'Uruaçu - GO',
    contatos: 2
  },
  {
    nome: 'Gabinete de Projetos Especiais',
    departamento: 'Infraestrutura Municipal',
    localizacao: 'Uruaçu - GO',
    contatos: 0
  }
];

const GabineteCard: React.FC<{ gabinete: GabineteProps }> = ({ gabinete }) => {
  return (
    <Card className="bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="bg-green-50 p-2 rounded-md">
            <Building className="h-5 w-5 text-resolve-green" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">{gabinete.nome}</h3>
            <p className="text-gray-500 text-sm mb-4">{gabinete.departamento}</p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{gabinete.localizacao}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{gabinete.contatos} números cadastrados</span>
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
  
  const filteredGabinetes = GABINETES_MOCK.filter(gabinete =>
    gabinete.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gabinete.departamento.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGabinetes.map((gabinete, index) => (
              <GabineteCard key={index} gabinete={gabinete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gabinetes;
