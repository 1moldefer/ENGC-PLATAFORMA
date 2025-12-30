
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Calendar, Filter } from 'lucide-react';

const BAR_DATA = [
  { name: 'Jan', chamados: 40, os: 24 },
  { name: 'Fev', chamados: 30, os: 13 },
  { name: 'Mar', chamados: 20, os: 35 },
  { name: 'Abr', chamados: 27, os: 39 },
  { name: 'Mai', chamados: 18, os: 48 },
];

const PIE_DATA = [
  { name: 'Corretiva', value: 400, color: '#3b82f6' },
  { name: 'Preventiva', value: 300, color: '#10b981' },
  { name: 'Calibração', value: 300, color: '#f59e0b' },
  { name: 'Instalação', value: 200, color: '#8b5cf6' },
];

const AREA_DATA = [
  { time: '08:00', volume: 5 },
  { time: '10:00', volume: 15 },
  { time: '12:00', volume: 8 },
  { time: '14:00', volume: 22 },
  { time: '16:00', volume: 30 },
  { time: '18:00', volume: 12 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
           <Calendar className="text-blue-600" />
           <span className="font-bold text-slate-700">Período: Últimos 30 dias (Maio 2024)</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2">
            <Filter size={14} /> Filtro por Unidade
          </button>
          <button className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100">
            Gerar PDF de Indicadores
          </button>
        </div>
      </div>

      {/* KPIs Grid - 4 Column Layout for Web */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Chamados no Mês', value: '124', growth: '+12%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'OS Concluídas', value: '98', growth: '+5%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Tempo Médio (TMA)', value: '4.2h', growth: '-18%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Disponibilidade', value: '88%', growth: '+2%', icon: AlertTriangle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-all border-b-4 border-b-blue-500/0 hover:border-b-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div className={`${kpi.bg} ${kpi.color} p-4 rounded-2xl`}>
                <kpi.icon size={24} />
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${kpi.growth.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {kpi.growth}
              </span>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Produtividade de Manutenção</h3>
              <p className="text-sm text-slate-400 font-medium">Comparativo mensal entre Chamados e OS</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Chamados</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">OS</span>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '15px' }}
                />
                <Bar dataKey="chamados" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="os" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Types Pie */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Mix de Serviços</h3>
          <p className="text-sm text-slate-400 font-medium mb-8">Distribuição por natureza técnica</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-6">
               {PIE_DATA.map((entry, i) => (
                 <div key={i} className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{entry.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Load (Area Chart) */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Demanda Técnica em Tempo Real</h3>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip />
              <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
