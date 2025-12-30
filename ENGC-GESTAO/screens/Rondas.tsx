
import React, { useState } from 'react';
import { Screen } from '../types';
import { Check, X, Camera, MapPin, AlertCircle, Save } from 'lucide-react';

export const Rondas: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => {
  const [step, setStep] = useState(1); // 1: Select Sector, 2: Checklist

  const sectors = ['UTI Adulto', 'UTI Neonatal', 'Centro Cirúrgico', 'Emergência', 'Laboratório', 'Pronto Socorro'];

  const checklistItems = [
    'Verificar integridade dos cabos de alimentação',
    'Conferir selos de calibração vigentes',
    'Testar alarmes sonoros e visuais',
    'Limpeza superficial dos painéis',
    'Disponibilidade de acessórios básicos'
  ];

  return (
    <div className="bg-slate-50 min-h-full">
      {step === 1 ? (
        <div className="p-5 space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <MapPin className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-blue-800">Selecione o Setor</h3>
              <p className="text-xs text-blue-600">Escolha onde iniciará a ronda de inspeção preventiva.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {sectors.map(s => (
              <button 
                key={s} 
                onClick={() => setStep(2)}
                className="bg-white p-5 rounded-xl border border-slate-200 text-left font-bold text-slate-700 flex justify-between items-center hover:border-blue-500 group active:scale-[0.98] transition-all"
              >
                {s}
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white">
                  <Check size={18} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5 space-y-6 pb-32">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Checklist: UTI Adulto</h3>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded">Passo 2 de 2</span>
          </div>

          <div className="space-y-4">
            {checklistItems.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                <p className="text-sm font-medium text-slate-700">{item}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg border-2 border-green-500 text-green-600 font-bold text-xs flex items-center justify-center gap-1 hover:bg-green-50">
                    <Check size={14} /> Conforme
                  </button>
                  <button className="flex-1 py-2 rounded-lg border-2 border-red-500 text-red-600 font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-50">
                    <X size={14} /> Não Conforme
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-100 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Ações Adicionais</h4>
            <div className="flex gap-2">
              <button className="flex-1 bg-white p-3 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold flex flex-col items-center gap-1">
                <Camera size={20} /> Anexar Foto
              </button>
              <button onClick={() => onNavigate('ABRIR_CHAMADO')} className="flex-1 bg-white p-3 rounded-lg border border-slate-200 text-amber-600 text-xs font-bold flex flex-col items-center gap-1">
                <AlertCircle size={20} /> Gerar OS/Chamado
              </button>
            </div>
          </div>

          <div className="fixed bottom-20 left-4 right-4 z-40">
            <button 
              onClick={() => onNavigate('HOME')}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Save size={18} />
              Finalizar Ronda Setorial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
