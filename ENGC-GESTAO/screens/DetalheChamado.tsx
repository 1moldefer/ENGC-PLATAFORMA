
import React from 'react';
import { MOCK_CHAMADOS } from '../constants';
import { Status, Screen } from '../types';
// Added missing Wrench icon to the lucide-react imports
import { Clock, Box, MapPin, User, ChevronRight, CheckCircle2, FileText, Wrench } from 'lucide-react';

export const DetalheChamado: React.FC<{ id: string, onNavigate: (s: Screen, id?: string) => void }> = ({ id, onNavigate }) => {
  const chamado = MOCK_CHAMADOS.find(c => c.id === id) || MOCK_CHAMADOS[0];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header Status */}
      <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
        <div>
          <p className="text-xs text-blue-100 uppercase font-bold tracking-widest">Status Atual</p>
          <h2 className="text-2xl font-bold mt-1">{chamado.status}</h2>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Clock size={32} />
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Box size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 font-medium">Equipamento</p>
              <h3 className="font-bold text-slate-800">{chamado.equipamentoNome}</h3>
              <p className="text-xs text-blue-600 font-bold">Patrimônio: EC-2024-001</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Setor</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm font-semibold">{chamado.setor}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Criticidade</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-sm font-bold ${chamado.criticidade === 'Urgente' ? 'text-red-600' : 'text-blue-600'}`}>{chamado.criticidade}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            Descrição do Problema
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
            "{chamado.descricao}"
          </p>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Histórico</h4>
          <div className="space-y-0 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>
            {[
              { time: '08:30', event: 'Chamado Aberto', desc: 'Por: Enf. Márcia (UTI)', done: true },
              { time: '09:15', event: 'Técnico Designado', desc: 'Eng. Ricardo Silva', done: true },
              { time: '09:20', event: 'Atendimento Iniciado', desc: 'Técnico no local', done: false },
            ].map((step, i) => (
              <div key={i} className="relative flex gap-4 pb-6 pl-10">
                <div className={`absolute left-[13px] w-2.5 h-2.5 rounded-full border-2 ${step.done ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'} z-10`}></div>
                <div className="flex-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 text-sm">{step.event}</span>
                    <span className="text-[10px] text-slate-400">{step.time}</span>
                  </div>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-20 left-4 right-4 flex gap-3 z-30">
        <button 
          onClick={() => onNavigate('OS', 'NEW')}
          className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Wrench size={18} />
          Criar OS
        </button>
        <button 
          className="bg-white text-green-600 border-2 border-green-500 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <CheckCircle2 size={18} />
          Encerrar
        </button>
      </div>
    </div>
  );
};
