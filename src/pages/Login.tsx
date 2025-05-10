import React, { useState } from 'react';
import { Building, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica de autenticação
    // Por enquanto, apenas redireciona para a página inicial
    navigate('/');
  };
  return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border">
        {/* Logo e título */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-resolve-green flex items-center justify-center mb-3">
            <Building className="text-white h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-resolve-green">Resolve Leg</h1>
          <p className="text-gray-500 mt-2 text-center">Faça login para acessar o sistema</p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu.email@exemplo.com" className="w-full bg-blue-50" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="relative">
              <Input id="senha" type={mostrarSenha ? 'text' : 'password'} value={senha} onChange={e => setSenha(e.target.value)} className="w-full bg-blue-50 pr-10" required />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setMostrarSenha(!mostrarSenha)}>
                {mostrarSenha ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-resolve-green hover:bg-green-600">
            <span className="mr-2">Entrar</span>
          </Button>
        </form>
      </div>
    </div>;
};
export default Login;