
import React, { useState, useEffect } from 'react';
import { Building, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailNaoConfirmado, setEmailNaoConfirmado] = useState(false);
  const { signIn, session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailNaoConfirmado(false);
    
    try {
      const { error } = await signIn(email, senha);
      
      if (error?.message?.includes('Email not confirmed')) {
        setEmailNaoConfirmado(true);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const reenviarEmailConfirmacao = async () => {
    try {
      setIsResendingEmail(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error('Erro ao reenviar email: ' + error.message);
      } else {
        toast.success('Email de confirmação reenviado com sucesso!');
      }
    } catch (error: any) {
      toast.error('Erro ao reenviar email de confirmação');
      console.error('Erro ao reenviar email:', error);
    } finally {
      setIsResendingEmail(false);
    }
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

        {/* Mensagem de email não confirmado */}
        {emailNaoConfirmado && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
            <h3 className="font-medium text-amber-800">Email não confirmado</h3>
            <p className="text-amber-700 text-sm mt-1">
              Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada 
              ou clique no botão abaixo para reenviar o email de confirmação.
            </p>
            <Button 
              onClick={reenviarEmailConfirmacao} 
              className="mt-2 bg-amber-600 hover:bg-amber-700 w-full"
              disabled={isResendingEmail}
            >
              {isResendingEmail ? 'Reenviando...' : 'Reenviar email de confirmação'}
            </Button>
          </div>
        )}

        {/* Formulário de Login */}
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
              <span>Entrar</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
