
import React from 'react';

const ActiveSecretariesSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Secretarias Mais Ativas</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Secretaria de Obras</span>
          <span className="font-medium">85%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-resolve-teal h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>

        <div className="flex justify-between">
          <span>Secretaria de Saúde</span>
          <span className="font-medium">65%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-resolve-coral h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
        
        <div className="flex justify-between">
          <span>Secretaria de Educação</span>
          <span className="font-medium">40%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-resolve-purple h-2 rounded-full" style={{ width: '40%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSecretariesSection;
