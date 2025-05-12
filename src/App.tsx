
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Problemas from "./pages/Problemas";
import DetalhesOcorrencia from "./pages/DetalhesOcorrencia";
import Gabinetes from "./pages/Gabinetes";
import Relatorios from "./pages/Relatorios";
import Notificacoes from "./pages/Notificacoes";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import GerarToken from "./pages/GerarToken";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/gerar-token" element={
                <RoleProtectedRoute allowedRoles={['administrador']}>
                  <GerarToken />
                </RoleProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/problemas" element={
                <ProtectedRoute>
                  <Problemas />
                </ProtectedRoute>
              } />
              <Route path="/detalhes-ocorrencia/:id" element={
                <ProtectedRoute>
                  <DetalhesOcorrencia />
                </ProtectedRoute>
              } />
              <Route path="/gabinetes" element={
                <ProtectedRoute>
                  <Gabinetes />
                </ProtectedRoute>
              } />
              <Route path="/relatorios" element={
                <ProtectedRoute>
                  <Relatorios />
                </ProtectedRoute>
              } />
              <Route path="/notificacoes" element={
                <ProtectedRoute>
                  <Notificacoes />
                </ProtectedRoute>
              } />
              <Route path="/usuarios" element={
                <RoleProtectedRoute allowedRoles={['administrador']}>
                  <Usuarios />
                </RoleProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
