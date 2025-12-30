
import React from 'react';
import { X, QrCode, Zap, Image as ImageIcon } from 'lucide-react';
import { Screen } from '../../../types';

export const ScannerMock: React.FC<{ onBack: () => void, onDetected: (id: string) => void }> = ({ onBack, onDetected }) => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="p-6 flex justify-between items-center text-white">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full">
          <X size={24} />
        </button>
        <h2 className="font-bold text-lg">Escanear Equipamento</h2>
        <button className="p-2 bg-white/10 rounded-full">
          <Zap size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-10">
        <div className="w-full aspect-square border-2 border-blue-500 rounded-3xl relative overflow-hidden bg-slate-900/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode size={120} className="text-white/20" />
          </div>
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_3s_linear_infinite]"></div>
        </div>

        <p className="text-white/70 text-sm mt-10 text-center px-4">
          Posicione o código QR do patrimônio dentro do quadrado azul para identificação automática.
        </p>

        <button
          onClick={() => onDetected('1')}
          className="mt-12 bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-full border border-white/20 flex items-center gap-2 transition-all"
        >
          <ImageIcon size={18} />
          Selecionar da Galeria
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};
