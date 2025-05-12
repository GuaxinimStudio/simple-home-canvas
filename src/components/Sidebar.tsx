
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Home, FileText, Building, FileBarChart, Bell, LogOut, Users, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type NavigationItem = {
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  path: string;
  requiredRole?: 'administrador' | 'vereador' | undefined;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();
  
  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*, gabinetes(gabinete)')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });
  
  const navigationItems: NavigationItem[] = [
    {
      title: "Início",
      icon: Home,
      path: "/"
    },
    {
      title: "Problemas",
      icon: FileText,
      path: "/problemas"
    },
    {
      title: "Gabinetes",
      icon: Building,
      path: "/gabinetes"
    },
    {
      title: "Usuários",
      icon: Users,
      path: "/usuarios",
      requiredRole: "administrador"
    },
    {
      title: "Relatórios",
      icon: FileBarChart,
      path: "/relatorios"
    },
    {
      title: "Notificações",
      icon: Bell,
      path: "/notificacoes"
    },
    {
      title: "Gerar Token",
      icon: Key,
      path: "/gerar-token",
      requiredRole: "administrador"
    }
  ];
  
  const handleSignOut = () => {
    signOut();
  };

  // Filtra os itens de navegação com base no perfil do usuário
  const filteredNavigationItems = navigationItems.filter(item => {
    // Se não há restrição de perfil, mostra para todos
    if (!item.requiredRole) return true;
    // Se há restrição, verifica se o usuário tem o perfil necessário
    return userProfile?.role === item.requiredRole;
  });

  return (
    <div className="h-screen w-64 bg-white flex flex-col border-r">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-resolve-green flex items-center justify-center">
          <Building className="text-white h-4 w-4" />
        </div>
        <span className="text-resolve-green font-medium text-xl">Resolve Leg</span>
      </div>

      {/* User profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <span className="font-semibold text-sm">{user?.email?.substring(0, 2).toUpperCase() || "JA"}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{userProfile?.nome || user?.user_metadata?.nome || user?.email?.split('@')[0] || "Usuário"}</p>
            <p className="text-xs text-gray-500">{userProfile?.role === 'administrador' ? 'Administrador' : 'Vereador'}</p>
          </div>
        </div>
        
        {userProfile?.gabinetes && (
          <div className="ml-11">
            <p className="text-xs text-gray-500 flex items-center">
              <Building className="h-3 w-3 mr-1" />
              {userProfile.gabinetes.gabinete}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavigationItems.map(item => {
            const isActive = currentPath === item.path || 
                            (item.path === "/" && currentPath === "/") || 
                            (item.path !== "/" && currentPath.startsWith(item.path));
            
            return (
              <li key={item.title}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive 
                      ? 'text-resolve-green border-l-2 border-resolve-green' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-resolve-green' : 'text-gray-500'}`} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 w-full"
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
