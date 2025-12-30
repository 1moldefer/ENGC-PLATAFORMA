
import React from 'react';
import { MOCK_OS } from '../constants';
import { Status } from '../types';
import { Search, Filter, Calendar, User, ArrowRight } from 'lucide-react';

export const OSList: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  return (
    <div className="bg-slate-50 min-h-full pb-6">
      <div className="p-4 bg-white border-b sticky top-0 z-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar OS..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm"
          />
        </div>
        <button className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <Filter size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {MOCK_OS.map((os) => (
          <button
            key={os.id}
            onClick={() => onSelect(os.id)}
            className="w-full text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">
                  {os.id}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-2">{os.equipamentoNome}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${os.status === Status.CONCLUIDO ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {os.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-500">
                <User size={14} />
                <span className="text-xs truncate">{os.tecnico}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 justify-end">
                <Calendar size={14} />
                <span className="text-xs">{os.data}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-blue-600 text-xs font-bold uppercase tracking-wider">
              <span>Detalhes Técnicos</span>
              <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
