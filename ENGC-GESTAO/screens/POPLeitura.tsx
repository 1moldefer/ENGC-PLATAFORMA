
import React from 'react';
import { MOCK_POPS } from '../constants';
import { Screen } from '../types';
import { Cpu, Printer, Share2 } from 'lucide-react';

export const POPLeitura: React.FC<{ id: string, onNavigate: (s: Screen) => void }> = ({ id, onNavigate }) => {
  const pop = MOCK_POPS.find(p => p.id === id) || MOCK_POPS[0];

  return (
    <div className="bg-white min-h-full pb-32">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{pop.categoria}</span>
            <h2 className="text-xl font-black text-slate-800">{pop.titulo}</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-100 rounded-lg text-slate-500"><Printer size={18} /></button>
            <button className="p-2 bg-slate-100 rounded-lg text-slate-500"><Share2 size={18} /></button>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
            {pop.conteudo}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-4 right-4 z-40">
        <button 
          onClick={() => onNavigate('IA')}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Cpu size={20} className="text-blue-400" />
          Tirar dúvida com Assistente IA
        </button>
      </div>
    </div>
  );
};
