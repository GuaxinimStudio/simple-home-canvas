
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
      toast.success('Token permanente gerado com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar token:', err);
      setError('Erro ao gerar token. Verifique o console para mais detalhes.');
      toast.error('Erro ao gerar token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Gerar Token de Autenticação Permanente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGerarToken} 
            disabled={isLoading}
          >
            {isLoading ? 'Gerando...' : 'Gerar Novo Token Permanente'}
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

              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                <p className="text-sm">Este token é permanente e não expira. Use-o para autenticar requisições à API.</p>
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
