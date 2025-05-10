
import React from 'react';

const ActiveSecretariesSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Gabinetes Mais Ativos</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Gabinete do Vereador Rafael Miguel</span>
          <span className="font-medium">85%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-resolve-teal h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>

        <div className="flex justify-between">
          <span>Gabinete do Vereador Lucas</span>
          <span className="font-medium">65%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-resolve-coral h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
        
        <div className="flex justify-between">
          <span>Gabinete de Educação</span>
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
