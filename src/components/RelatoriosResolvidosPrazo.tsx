
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RelatoriosResolvidosPrazo: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Resolvidos no Prazo</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-5xl font-bold text-gray-800">100%</div>
          <p className="text-gray-500 mt-2">3 de 3 problemas</p>
          <div className="w-24 h-8 mt-4">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <path d="M0,15 L20,5 L40,10 L60,0 L80,5 L100,2" stroke="#10b981" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosResolvidosPrazo;
