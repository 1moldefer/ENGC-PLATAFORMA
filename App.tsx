
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Screen } from './types';
import { Layout } from './components/Layout';
import Login from './src/pages/Login'; // Use the new Login from pages
import SignUp from './src/pages/SignUp';
import ForgotPassword from './src/pages/ForgotPassword';
// import { Login as LoginScreen } from './screens/Login'; // Deprecated
import { Home } from './screens/Home';
import { ChamadosList } from './screens/ChamadosList';
import { AbrirChamado } from './screens/AbrirChamado';
import { DetalheChamado } from './screens/DetalheChamado';
import { OSList } from './screens/OSList';
import { DetalheOS } from './screens/DetalheOS';
import { Rondas } from './src/pages/Rondas';
import { Inventario } from './src/pages/Inventario';
import { DetalheEquipamento } from './src/pages/DetalheEquipamento';
import { Dashboard } from './screens/Dashboard';
import { POPs } from './screens/POPs';
import { POPLeitura } from './screens/POPLeitura';
import { IAAssistant } from './screens/IAAssistant';
import { ScannerMock } from './screens/ScannerMock';
import { Relatorios } from './screens/Relatorios';
import { Activity } from 'lucide-react';
import { useAuth } from './src/contexts/AuthContext';

// This component handles the internal navigation of the authenticated app
const ProtectedApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleNavigate = (screen: Screen, id: string | null = null) => {
    setSelectedItemId(id);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      // 'LOGIN' case removed since it's handled by Router now
      case 'HOME':
        return (
          <Layout currentScreen="HOME" onNavigate={handleNavigate} title="Visão Geral Operacional">
            <Home onNavigate={handleNavigate} />
          </Layout>
        );

      case 'SCANNER':
        return <ScannerMock onBack={() => handleNavigate('HOME')} onDetected={(id) => handleNavigate('DETALHE_EQUIPAMENTO', id)} />;

      case 'CHAMADOS':
        return (
          <Layout currentScreen="CHAMADOS" onNavigate={handleNavigate} title="Gestão de Chamados">
            <ChamadosList onSelect={(id) => handleNavigate('DETALHE_CHAMADO', id)} onAdd={() => handleNavigate('ABRIR_CHAMADO')} />
          </Layout>
        );

      case 'ABRIR_CHAMADO':
        return (
          <Layout currentScreen="CHAMADOS" onNavigate={handleNavigate} title="Novo Chamado Técnico" showBackButton>
            <AbrirChamado onBack={() => handleNavigate('CHAMADOS')} />
          </Layout>
        );

      case 'DETALHE_CHAMADO':
        return (
          <Layout currentScreen="CHAMADOS" onNavigate={handleNavigate} title={`Chamado #${selectedItemId}`} showBackButton>
            <DetalheChamado id={selectedItemId!} onNavigate={handleNavigate} />
          </Layout>
        );

      case 'OS':
        return (
          <Layout currentScreen="OS" onNavigate={handleNavigate} title="Ordens de Serviço">
            <OSList onSelect={(id) => handleNavigate('DETALHE_OS', id)} />
          </Layout>
        );

      case 'DETALHE_OS':
        return (
          <Layout currentScreen="OS" onNavigate={handleNavigate} title={`Ordem de Serviço #${selectedItemId}`} showBackButton>
            <DetalheOS id={selectedItemId!} onNavigate={handleNavigate} />
          </Layout>
        );

      case 'RONDAS':
        return (
          <Layout currentScreen="RONDAS" onNavigate={handleNavigate} title="Rondas de Inspeção">
            <Rondas onNavigate={handleNavigate} />
          </Layout>
        );

      case 'INVENTARIO':
        return (
          <Layout currentScreen="INVENTARIO" onNavigate={handleNavigate} title="Inventário de Ativos">
            <Inventario onSelect={(id) => handleNavigate('DETALHE_EQUIPAMENTO', id)} />
          </Layout>
        );

      case 'DETALHE_EQUIPAMENTO':
        return (
          <Layout currentScreen="INVENTARIO" onNavigate={handleNavigate} title="Prontuário do Equipamento" showBackButton>
            <DetalheEquipamento id={selectedItemId!} onNavigate={handleNavigate} />
          </Layout>
        );

      case 'DASHBOARD':
        return (
          <Layout currentScreen="DASHBOARD" onNavigate={handleNavigate} title="Indicadores KPI">
            <Dashboard />
          </Layout>
        );

      case 'RELATORIOS':
        return (
          <Layout currentScreen="RELATORIOS" onNavigate={handleNavigate} title="Gerador de Relatórios Oficiais">
            <Relatorios />
          </Layout>
        );

      case 'POPS':
        return (
          <Layout currentScreen="POPS" onNavigate={handleNavigate} title="Documentação Técnica">
            <POPs onSelect={(id) => handleNavigate('POP_LEITURA', id)} />
          </Layout>
        );

      case 'IA':
        return (
          <Layout currentScreen="IA" onNavigate={handleNavigate} title="Assistente Técnico AI">
            <IAAssistant />
          </Layout>
        );

      default:
        return (
          <Layout currentScreen="HOME" onNavigate={handleNavigate} title="Em Breve">
            <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
              <Activity size={48} className="animate-pulse mb-4" />
              <p className="font-bold text-xl uppercase tracking-widest">Módulo em Desenvolvimento</p>
              <button onClick={() => handleNavigate('HOME')} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs">Voltar ao Início</button>
            </div>
          </Layout>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {renderScreen()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Protected Route */}
      <Route path="/app/*" element={
        <RequireAuth>
          <ProtectedApp />
        </RequireAuth>
      } />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Simple auth wrapper
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;
