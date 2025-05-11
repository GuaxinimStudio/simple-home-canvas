
import React from 'react';
import { Problema } from '@/hooks/relatorios/types';
import ProblemaCard from './ProblemaCard';

interface ListaProblemasProps {
  problemas: Problema[];
}

const ListaProblemas: React.FC<ListaProblemasProps> = ({ problemas }) => {
  if (problemas.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Nenhum problema encontrado com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problemas.map((problema, index) => (
        <ProblemaCard 
          key={problema.id} 
          problema={problema} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default ListaProblemas;
