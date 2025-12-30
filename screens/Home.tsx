
import React from 'react';
import { 
  PlusCircle, Wrench, RotateCw, QrCode, AlertTriangle, Clock, 
  CheckCircle2, ChevronRight, Activity, Cpu, Calendar, AlertOctagon, TrendingUp,
  Map as MapIcon, FileBarChart
} from 'lucide-react';
import { Screen } from '../types';

export const Home: React.FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
  const primaryActions = [
    { id: 'ABRIR_CHAMADO', label: 'Chamado', icon: PlusCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'PREVENTIVAS', label: 'Preventiva', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'SCANNER', label: 'Interditar', icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'IA', label: 'IA Assist', icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {primaryActions.map(action => (
          <button 
            key={action.id} 
            onClick={() => onNavigate(action.id as Screen)}
            className="group flex items-center gap-6 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className={`${action.bg} ${action.color} w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
              <action.icon size={32} />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-slate-800 tracking-tight">{action.label}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Acesso Rápido</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 tracking-tighter">INDICADORES DE SAÚDE TECNOLÓGICA</h3>
            <button onClick={() => onNavigate('DASHBOARD')} className="text-xs font-black text-blue-600 uppercase border-b-2 border-blue-600">Ver Painel Gerencial</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><TrendingUp size={24} /></div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">ESTÁVEL</span>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">94.2%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Disponibilidade Total</p>
             </div>
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-amber-50 text-amber-600 p-3 rounded-xl"><Clock size={24} /></div>
                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded">+15%</span>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">3.8h</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">MTTR (Tempo Médio Reparo)</p>
             </div>
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl"><AlertTriangle size={24} /></div>
                  <span className="text-[10px] font-black text-white bg-red-600 px-2 py-1 rounded">CRÍTICO</span>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">04</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Ativos Interditados</p>
             </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-10 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Activity size={200} /></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 space-y-4">
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4"><Calendar size={24} /></div>
                <h3 className="text-3xl font-black tracking-tighter">Plano de Manutenção Preventiva</h3>
                <p className="text-slate-400 text-lg">Existem <span className="text-blue-400 font-bold">12 equipamentos</span> agendados para manutenção nas próximas 48 horas. Verifique os checklists e kits de peças.</p>
                <button onClick={() => onNavigate('PREVENTIVAS')} className="bg-white text-slate-900 font-black px-10 py-4 rounded-2xl hover:bg-blue-50 transition-colors uppercase tracking-widest text-sm">Acessar Cronograma</button>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                   <p className="text-3xl font-black">28</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Realizadas</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                   <p className="text-3xl font-black text-amber-400">05</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Atrasadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <MapIcon className="text-blue-600" size={20} /> MAPA DE CALOR SETORIAL
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'UTI Adulto', health: 98, status: 'Normal' },
                  { name: 'Centro Cirúrgico', health: 85, status: 'Alerta' },
                  { name: 'Emergência', health: 92, status: 'Normal' },
                  { name: 'Laboratório', health: 70, status: 'Crítico' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">{s.name}</span>
                        <span className="text-[10px] font-black text-slate-400">{s.health}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${s.health > 90 ? 'bg-emerald-500' : s.health > 80 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{width: `${s.health}%`}}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('MAPA_HOSPITAL')} className="w-full mt-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Explorar Visão Geral</button>
           </div>

           <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform group-hover:scale-125 duration-700"><FileBarChart size={200} /></div>
              <h3 className="text-xl font-black mb-4 leading-tight">Geração de Relatórios Oficiais</h3>
              <p className="text-blue-100 text-sm mb-8">Nossa IA compila dados de manutenção, interdições e KPIs para auditorias e diretoria.</p>
              <button onClick={() => onNavigate('RELATORIOS')} className="bg-white text-blue-600 w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20">Gerar Relatório Mensal</button>
           </div>
        </div>
      </div>
    </div>
  );
};
