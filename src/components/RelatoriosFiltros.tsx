
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RelatoriosFiltros: React.FC = () => {
  const [monthSelect, setMonthSelect] = useState<string>("Selecione o mês");
  const [yearSelect, setYearSelect] = useState<string>("2025");
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-600 mb-1 block">Busca por texto</span>
            <Input 
              placeholder="Pesquisar por descrição ou secretaria..." 
              className="max-w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <button
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <span className="text-gray-700">Todas as secretarias</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div>
              <button
                className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
              >
                <span className="text-gray-700">Todos os status</span>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Button variant="default" className="w-full bg-resolve-green hover:bg-green-600">
                  Mês/Ano
                </Button>
              </div>
              <div className="flex-grow">
                <Button variant="outline" className="w-full">
                  Intervalo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <button
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <span className="text-gray-700">{monthSelect}</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <button
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <span className="text-gray-700">{yearSelect}</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosFiltros;
