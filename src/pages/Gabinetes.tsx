
import React from 'react';
import Sidebar from '../components/Sidebar';

const Gabinetes: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-4">Gabinetes</h1>
            <p className="text-gray-600">
              Gerencie os gabinetes e suas demandas nesta página.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gabinetes;
