import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Building, FileBarChart, Bell, LogOut } from 'lucide-react';
type NavigationItem = {
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  path: string;
};
const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigationItems: NavigationItem[] = [{
    title: "Início",
    icon: Home,
    path: "/"
  }, {
    title: "Problemas",
    icon: FileText,
    path: "/problemas"
  }, {
    title: "Gabinetes",
    icon: Building,
    path: "/gabinetes"
  }, {
    title: "Relatórios",
    icon: FileBarChart,
    path: "/relatorios"
  }, {
    title: "Notificações",
    icon: Bell,
    path: "/notificacoes"
  }];
  return <div className="h-screen w-64 bg-white flex flex-col border-r">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-resolve-green flex items-center justify-center">
          <Building className="text-white h-4 w-4" />
        </div>
        <span className="text-resolve-green font-medium text-xl">Resolve Leg</span>
      </div>

      {/* User profile */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <span className="font-semibold text-sm">JA</span>
        </div>
        <div>
          <p className="font-medium text-gray-800">Jessé Araújo</p>
          <p className="text-xs text-gray-500">Administrador Regional</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map(item => {
          const isActive = currentPath === item.path || item.path === "/" && currentPath === "/" || item.path !== "/" && currentPath.startsWith(item.path);
          return <li key={item.title}>
                <Link to={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'text-resolve-green border-l-2 border-resolve-green' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-resolve-green' : 'text-gray-500'}`} />
                  <span>{item.title}</span>
                </Link>
              </li>;
        })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Link to="/sair" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
          <LogOut className="h-5 w-5 text-gray-500" />
          <span>Sair</span>
        </Link>
      </div>
    </div>;
};
export default Sidebar;