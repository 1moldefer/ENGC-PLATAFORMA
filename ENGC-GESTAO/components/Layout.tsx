
import React from 'react';
import { 
  Home, ClipboardList, Wrench, RotateCw, Box, Menu, User, Bell, 
  LayoutDashboard, BookOpen, Cpu, Settings, ChevronLeft, LogOut, 
  Search, Calendar, Map, Package, FileBarChart, AlertOctagon 
} from 'lucide-react';
import { Screen } from '../../types';

interface LayoutProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  currentScreen, onNavigate, children, title, showBackButton = false 
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const navGroups = [
    {
      label: 'Operacional',
      items: [
        { id: 'HOME', label: 'Início', icon: Home },
        { id: 'CHAMADOS', label: 'Chamados', icon: ClipboardList },
        { id: 'OS', label: 'Ordens de Serviço', icon: Wrench },
        { id: 'PREVENTIVAS', label: 'Manut. Preventiva', icon: Calendar },
        { id: 'RONDAS', label: 'Rondas', icon: RotateCw },
      ]
    },
    {
      label: 'Gestão de Ativos',
      items: [
        { id: 'INVENTARIO', label: 'Inventário', icon: Box },
        { id: 'ALMOXARIFADO', label: 'Peças/Estoque', icon: Package },
        { id: 'MAPA_HOSPITAL', label: 'Mapa Hospitalar', icon: Map },
      ]
    },
    {
      label: 'Inteligência',
      items: [
        { id: 'DASHBOARD', label: 'Indicadores KPI', icon: LayoutDashboard },
        { id: 'RELATORIOS', label: 'Relatórios IA', icon: FileBarChart },
        { id: 'IA', label: 'Assistente Técnico', icon: Cpu },
        { id: 'POPS', label: 'Biblioteca POP', icon: BookOpen },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-slate-800`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900/50">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Box size={22} className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-white tracking-tighter text-xl">ClinEng<span className="text-blue-500">Pro</span></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Web</span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-6 px-3 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{group.label}</p>
              )}
              {group.items.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id as Screen)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
                  >
                    <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} />
                    {!isSidebarCollapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => onNavigate('LOGIN')} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={20} />
            {!isSidebarCollapsed && <span className="text-sm font-bold">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
              <Menu size={22} />
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <h1 className="font-black text-slate-800 text-2xl tracking-tight uppercase italic">{title}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all border border-slate-100">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">RS</div>
              <div className="hidden lg:block leading-none">
                <p className="text-sm font-black text-slate-800">Ricardo Silva</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Eng. Responsável</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
