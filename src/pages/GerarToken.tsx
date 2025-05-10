
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const GerarToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGerarToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('gerar-token');

      if (error) {
        throw error;
      }

      setToken(data.token);
      setAuthHeader(data.authorization_header);
    } catch (err) {
      console.error('Erro ao gerar token:', err);
      setError('Erro ao gerar token. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Gerar Token de Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGerarToken} 
            disabled={isLoading}
          >
            {isLoading ? 'Gerando...' : 'Gerar Novo Token'}
          </Button>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              {error}
            </div>
          )}

          {token && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token:</label>
                <div className="flex">
                  <Input 
                    value={token} 
                    readOnly 
                    className="flex-1 font-mono text-xs"
                  />
                  <Button 
                    onClick={() => handleCopyToClipboard(token)}
                    variant="outline"
                    className="ml-2"
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cabeçalho Authorization:</label>
                <div className="flex">
                  <Input 
                    value={authHeader || ''} 
                    readOnly 
                    className="flex-1 font-mono text-xs"
                  />
                  <Button 
                    onClick={() => handleCopyToClipboard(authHeader || '')}
                    variant="outline"
                    className="ml-2"
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                <p className="text-sm">Este token expira em 30 dias. Use-o para autenticar requisições à API.</p>
                <p className="text-sm mt-2">
                  Para usar, adicione o cabeçalho <span className="font-mono">Authorization: Bearer [token]</span> às suas requisições.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GerarToken;
