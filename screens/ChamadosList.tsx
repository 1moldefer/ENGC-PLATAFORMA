
import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronRight, MapPin, Box } from 'lucide-react';
import { MOCK_CHAMADOS } from '../constants';
import { Status, Criticidade } from '../types';

interface ChamadosListProps {
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export const ChamadosList: React.FC<ChamadosListProps> = ({ onSelect, onAdd }) => {
  const [filter, setFilter] = useState('Todos');

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.ABERTO: return 'bg-blue-100 text-blue-700';
      case Status.EM_ATENDIMENTO: return 'bg-amber-100 text-amber-700';
      case Status.PENDENTE: return 'bg-slate-100 text-slate-700';
      case Status.CONCLUIDO: return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getCriticidadeColor = (crit: Criticidade) => {
    switch (crit) {
      case Criticidade.URGENTE: return 'text-red-600';
      case Criticidade.ALTA: return 'text-orange-600';
      case Criticidade.MEDIA: return 'text-blue-600';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white border-b sticky top-0 z-10 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por equipamento ou ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Todos', 'Abertos', 'Em Atendimento', 'Urgentes'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {MOCK_CHAMADOS.map((chamado) => (
          <button
            key={chamado.id}
            onClick={() => onSelect(chamado.id)}
            className="w-full text-left bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all flex items-start justify-between"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusColor(chamado.status)}`}>
                  {chamado.status}
                </span>
                <span className={`text-[10px] font-bold uppercase ${getCriticidadeColor(chamado.criticidade)}`}>
                  • {chamado.criticidade}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Box size={14} className="text-slate-400" />
                {chamado.equipamentoNome}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{chamado.setor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">#{chamado.id}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 italic">"{chamado.descricao}"</p>
            </div>
            <div className="flex flex-col items-end justify-between h-full min-h-[80px]">
              <ChevronRight size={18} className="text-slate-300" />
              <span className="text-[10px] text-slate-400">{chamado.dataHora.split(' ')[1]}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};
