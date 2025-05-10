
import React from 'react';

const RecentActivitySection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Atividade Recente</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-green"></div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Gabinete de Obras</span> 
              {' '}respondeu ao problema <span className="text-resolve-green">#1001</span>
            </p>
            <p className="text-xs text-gray-500">Há 2 horas</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-yellow"></div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Novo problema</span> 
              {' '}registrado no <span className="text-resolve-green">Gabinete de Saúde</span>
            </p>
            <p className="text-xs text-gray-500">Há 3 horas</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-green"></div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Problema #1002</span> 
              {' '}marcado como <span className="text-resolve-green">Resolvido</span>
            </p>
            <p className="text-xs text-gray-500">Há 4 horas</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-resolve-coral"></div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Prazo atualizado</span> 
              {' '}para o problema <span className="text-resolve-green">#1003</span>
            </p>
            <p className="text-xs text-gray-500">Há 5 horas</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm text-resolve-green">Ver todas as atividades</button>
      </div>
    </div>
  );
};

export default RecentActivitySection;
