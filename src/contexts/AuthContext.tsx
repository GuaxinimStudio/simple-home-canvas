
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configuração para evitar loops de redirecionamento
    let isActive = true;
    
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Verificar se o componente ainda está montado
        if (isActive) {
          console.log("Evento de autenticação:", event);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    // Verificar se há uma sessão existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      // Verificar se o componente ainda está montado
      if (isActive) {
        console.log("Sessão inicial:", currentSession ? "Existe" : "Não existe");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('E-mail não confirmado. Verifique sua caixa de entrada.');
        } else {
          toast.error('Erro ao realizar login: ' + error.message);
        }
        return { error };
      } else {
        toast.success('Login realizado com sucesso!');
        // Não fazemos o redirecionamento aqui, deixamos o useEffect perceber a mudança
        return { error: null };
      }
    } catch (error: any) {
      toast.error('Erro inesperado ao realizar login');
      console.error('Erro ao fazer login:', error);
      return { error: new AuthError('Erro inesperado ao realizar login') };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            nome,
          },
        }
      });
      
      if (error) {
        toast.error('Erro ao criar conta: ' + error.message);
      } else {
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error('Erro inesperado ao criar conta');
      console.error('Erro ao criar conta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Não fazemos o redirecionamento aqui, deixamos o useEffect perceber a mudança
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
