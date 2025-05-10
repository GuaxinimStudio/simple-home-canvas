
import React, { useState, useEffect } from 'react';
import { Building, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { signIn, signUp, session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, senha);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, senha, nome);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resolve-green"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border">
        {/* Logo e título */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-resolve-green flex items-center justify-center mb-3">
            <Building className="text-white h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-resolve-green">Resolve Leg</h1>
          <p className="text-gray-500 mt-2 text-center">Acesse o sistema de gestão de problemas</p>
        </div>

        {/* Tabs para Login e Cadastro */}
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>
          
          {/* Tab de Login */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input 
                  id="email-login" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="seu.email@exemplo.com" 
                  className="w-full bg-blue-50" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="senha-login" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <Input 
                    id="senha-login" 
                    type={mostrarSenha ? 'text' : 'password'} 
                    value={senha} 
                    onChange={e => setSenha(e.target.value)} 
                    className="w-full bg-blue-50 pr-10" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? 
                      <EyeOff className="h-5 w-5 text-gray-400" /> : 
                      <Eye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-resolve-green hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Entrando...
                  </span>
                ) : (
                  <span className="mr-2">Entrar</span>
                )}
              </Button>
            </form>
          </TabsContent>
          
          {/* Tab de Cadastro */}
          <TabsContent value="cadastro">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <Input 
                  id="nome" 
                  type="text" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  placeholder="Seu nome completo" 
                  className="w-full bg-blue-50" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email-cadastro" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input 
                  id="email-cadastro" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="seu.email@exemplo.com" 
                  className="w-full bg-blue-50" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="senha-cadastro" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <Input 
                    id="senha-cadastro" 
                    type={mostrarSenha ? 'text' : 'password'} 
                    value={senha} 
                    onChange={e => setSenha(e.target.value)} 
                    className="w-full bg-blue-50 pr-10" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? 
                      <EyeOff className="h-5 w-5 text-gray-400" /> : 
                      <Eye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-resolve-green hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Cadastrando...
                  </span>
                ) : (
                  <span className="mr-2">Cadastrar</span>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
