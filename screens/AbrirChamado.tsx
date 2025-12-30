
import React, { useState } from 'react';
import { Camera, QrCode, Send, AlertCircle } from 'lucide-react';

export const AbrirChamado: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onBack();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-6">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Patrimônio</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: EC-2024-001"
                className="w-full pl-3 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">
                <QrCode size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Setor / Localização</label>
          <select className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option>UTI Adulto</option>
            <option>Emergência</option>
            <option>Centro Cirúrgico</option>
            <option>Enfermaria 3º Andar</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Criticidade do Chamado</label>
          <div className="grid grid-cols-3 gap-2">
            {['Baixa', 'Média', 'Alta'].map(c => (
              <button
                key={c}
                type="button"
                className="py-2 text-xs font-bold border border-slate-200 rounded-lg bg-white hover:border-blue-500 hover:text-blue-600"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Descrição do Problema</label>
          <textarea 
            rows={4}
            placeholder="Descreva o que está acontecendo com o equipamento..."
            className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Evidências (Fotos)</label>
          <div className="flex gap-3">
            <button type="button" className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-colors">
              <Camera size={24} />
              <span className="text-[10px] mt-1">Câmera</span>
            </button>
            <div className="w-20 h-20 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {loading ? 'Abrindo Chamado...' : (
            <>
              <Send size={18} />
              Abrir Chamado Técnico
            </>
          )}
        </button>
      </div>

      <div className="p-3 bg-amber-50 rounded-lg flex gap-2 items-start">
        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">Chamados críticos são notificados automaticamente ao coordenador de plantão.</p>
      </div>
    </form>
  );
};
