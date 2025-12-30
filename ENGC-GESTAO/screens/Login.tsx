
import React from 'react';
import { Activity, Lock, Mail } from 'lucide-react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-white">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Activity size={48} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ClinEng Pro</h1>
        <p className="text-slate-500 mt-1">Engenharia Clínica Hospitalar</p>
      </div>

      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">E-mail Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" 
              placeholder="seu.nome@hospital.com"
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4"
        >
          Entrar
        </button>

        <p className="text-center text-xs text-slate-400 pt-4">
          Versão 2.5.0 • Acesso Restrito a Colaboradores
        </p>
      </div>
    </div>
  );
};
