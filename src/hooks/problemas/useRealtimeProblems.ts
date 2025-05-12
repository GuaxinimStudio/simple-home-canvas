
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ProblemItem } from '@/components/problemas/types';

export const useRealtimeProblems = (refreshCallback: () => void) => {
  const [newProblems, setNewProblems] = useState<ProblemItem[]>([]);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{role: string, gabinete_id: string | null} | null>(null);

  // Buscar o perfil do usuário atual
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (err: any) {
        console.error('Erro ao buscar perfil do usuário:', err);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Configurar inscrição em tempo real para a tabela 'problemas'
  useEffect(() => {
    if (!userProfile) return;

    // Configurar o canal de inscrição para eventos de inserção na tabela 'problemas'
    const channel = supabase
      .channel('problemas-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'problemas' 
        },
        (payload) => {
          console.log('Novo problema recebido:', payload);
          const newProblem = payload.new as ProblemItem;
          
          // Verificar se o novo problema está relacionado ao gabinete do usuário atual
          if (userProfile.role === 'vereador' && userProfile.gabinete_id) {
            if (newProblem.gabinete_id === userProfile.gabinete_id) {
              // Notificar o usuário e atualizar a lista
              toast.success('Novo problema atribuído ao seu gabinete!', {
                description: `Descrição: ${newProblem.descricao.substring(0, 50)}${newProblem.descricao.length > 50 ? '...' : ''}`,
                action: {
                  label: 'Ver detalhes',
                  onClick: () => window.location.href = `/detalhes-ocorrencia/${newProblem.id}`
                },
                duration: 8000,
              });
              
              setNewProblems(prev => [...prev, newProblem]);
              refreshCallback(); // Atualizar a lista de problemas
            }
          } else if (userProfile.role === 'administrador') {
            // Administradores veem notificações de todos os problemas
            toast.info('Novo problema registrado', {
              description: `Descrição: ${newProblem.descricao.substring(0, 50)}${newProblem.descricao.length > 50 ? '...' : ''}`,
              action: {
                label: 'Ver detalhes',
                onClick: () => window.location.href = `/detalhes-ocorrencia/${newProblem.id}`
              },
              duration: 8000,
            });
            
            setNewProblems(prev => [...prev, newProblem]);
            refreshCallback(); // Atualizar a lista de problemas
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'problemas' 
        },
        (payload) => {
          console.log('Problema atualizado:', payload);
          refreshCallback(); // Atualizar a lista de problemas
        }
      )
      .subscribe();

    console.log('Inscrito nos eventos em tempo real da tabela problemas');

    // Limpar a inscrição quando o componente for desmontado
    return () => {
      supabase.removeChannel(channel);
      console.log('Inscrição em tempo real removida');
    };
  }, [userProfile, refreshCallback]);

  return { newProblems };
};
