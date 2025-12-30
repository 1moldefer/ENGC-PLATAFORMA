
import React from 'react';
import { MOCK_POPS } from '../constants';
import { Book, ChevronRight, Search } from 'lucide-react';

export const POPs: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar POP ou Manual..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {MOCK_POPS.map(pop => (
          <button
            key={pop.id}
            onClick={() => onSelect(pop.id)}
            className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-left active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Book size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{pop.categoria}</p>
              <h3 className="text-sm font-bold text-slate-800">{pop.titulo}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Clique para ler o documento</p>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
};
