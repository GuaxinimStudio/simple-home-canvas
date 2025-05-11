
import React from 'react';
import { Check } from 'lucide-react';
import { Problema } from '@/hooks/relatorios/types';

interface ProblemaCardProps {
  problema: Problema;
  index: number;
}

const ProblemaCard: React.FC<ProblemaCardProps> = ({ problema, index }) => {
  return (
    <div className="border rounded-md p-4 relative">
      <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
        problema.status === 'Resolvido' 
          ? 'bg-green-100 text-green-800' 
          : problema.status === 'Pendente'
            ? 'bg-yellow-100 text-yellow-800'
            : problema.status === 'Em andamento'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
      }`}>
        {problema.status}
      </div>
      
      <h4 className="text-green-700 font-medium mb-3">Problema #{index + 1}</h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Descrição</p>
          <p className="text-sm">{problema.descricao || 'Sem descrição'}</p>
        </div>
        
        <div className="row-span-2">
          <p className="text-sm text-gray-600 mb-1">Foto do Problema</p>
          {problema.foto_url ? (
            <img 
              src={problema.foto_url} 
              alt="Foto do problema" 
              className="w-full h-32 object-cover rounded-md" 
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-sm text-gray-400">Sem imagem</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-600 mb-1">Município</p>
            <p className="text-sm">{problema.municipio || '-'}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Prazo</p>
          <p className="text-sm">{
            problema.prazo_estimado 
              ? new Date(problema.prazo_estimado).toLocaleDateString('pt-BR') 
              : '-'
          }</p>
        </div>
        
        {problema.status === 'Resolvido' && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Resolvido no prazo</p>
            <p className={`text-sm flex items-center ${
              problema.resolvido_no_prazo ? 'text-green-600' : 'text-red-600'
            }`}>
              {problema.resolvido_no_prazo ? 'Sim' : 'Não'}
              {problema.resolvido_no_prazo && (
                <Check className="w-4 h-4 ml-1 text-green-600" />
              )}
            </p>
          </div>
        )}
      </div>
      
      {problema.status === 'Resolvido' && problema.descricao_resolvido && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <p className="text-sm text-green-700 font-medium mb-1">Solução Implementada</p>
          <p className="text-sm">{problema.descricao_resolvido}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemaCard;
