
import React from 'react';
import { MOCK_OS } from '../constants';
import { Screen } from '../types';
import { Wrench, CheckCircle2, AlertTriangle, ExternalLink, Camera, FileText } from 'lucide-react';

export const DetalheOS: React.FC<{ id: string, onNavigate: (s: Screen) => void }> = ({ id, onNavigate }) => {
  const os = MOCK_OS.find(o => o.id === id) || MOCK_OS[0];

  return (
    <div className="bg-white min-h-full pb-32">
      <div className="p-5 space-y-6">
        <section className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Diagnóstico Técnico</h3>
             <textarea 
                defaultValue={os.diagnostico}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm"
                rows={3}
                placeholder="Insira o diagnóstico..."
             />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Ações Realizadas</h3>
             <textarea 
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm"
                rows={3}
                placeholder="Descreva as peças trocadas e reparos efetuados..."
             />
          </div>

          <div className="space-y-3">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Resultado Final</h3>
             <div className="grid grid-cols-1 gap-2">
                {[
                  { label: 'Funcionando em Pleno Estado', icon: CheckCircle2, color: 'text-green-600', border: 'border-green-100 bg-green-50' },
                  { label: 'Interditado / Aguardando Peças', icon: AlertTriangle, color: 'text-red-600', border: 'border-red-100 bg-red-50' },
                  { label: 'Enviado para Assistência Externa', icon: ExternalLink, color: 'text-blue-600', border: 'border-blue-100 bg-blue-50' },
                ].map((item, i) => (
                  <button key={i} className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-all hover:ring-2 hover:ring-blue-500 active:scale-95 ${item.border}`}>
                    <item.icon className={item.color} size={20} />
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Evidências do Reparo</h3>
             <button className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-white hover:border-blue-300 transition-colors">
                <Camera size={32} />
                <span className="text-sm mt-2 font-medium">Anexar Foto do Antes/Depois</span>
             </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-20 left-4 right-4 z-40">
        <button 
          onClick={() => onNavigate('OS')}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Finalizar Ordem de Serviço
        </button>
      </div>
    </div>
  );
};
