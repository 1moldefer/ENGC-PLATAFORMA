
import React, { useState } from 'react';
import { FileBarChart, Cpu, Download, FileText, CheckCircle2, Loader2, Sparkles, Filter, Calendar } from 'lucide-react';
import { askTechnicalAssistant } from '../services/gemini';

export const Relatorios: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);

  const generateReport = async (type: string) => {
    setIsGenerating(true);
    setReportResult(null);
    const prompt = `Gere um rascunho profissional de um relatório de Engenharia Clínica do tipo: ${type}. 
    Considere dados simulados de um hospital de grande porte. Inclua um resumo executivo, KPIs como MTTR de 4h e MTBF de 120h, 
    destaque para 95% de preventivas concluídas e análise de conformidade RDC 02/2010. Use tom formal e técnico.`;
    
    const result = await askTechnicalAssistant(prompt);
    setReportResult(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Centro de Relatórios Oficiais</h2>
          <p className="text-slate-500 font-medium">Geração automatizada de laudos, indicadores e relatórios gerenciais.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
             <Filter size={14} /> Filtros de Data
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
             <Calendar size={14} /> Histórico de Laudos
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Templates Disponíveis</p>
          {[
            { id: 'mensal', label: 'Relatório Mensal Gerencial', icon: FileBarChart, desc: 'Visão completa de KPIs e custos.' },
            { id: 'preventivas', label: 'Conformidade Preventivas', icon: CheckCircle2, desc: 'Dados para auditoria e RDCs.' },
            { id: 'custos', label: 'Análise de Custos de Peças', icon: Sparkles, desc: 'Impacto financeiro por setor.' },
            { id: 'ia-falhas', label: 'Análise de Falhas IA', icon: Cpu, desc: 'Identificação de problemas recorrentes.' },
          ].map(tpl => (
            <button 
              key={tpl.id}
              onClick={() => generateReport(tpl.label)}
              disabled={isGenerating}
              className="w-full p-6 bg-white border border-slate-100 rounded-[32px] text-left hover:shadow-xl hover:border-blue-200 transition-all group relative overflow-hidden active:scale-95 disabled:opacity-50"
            >
               <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <tpl.icon size={22} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">{tpl.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold leading-tight mt-0.5">{tpl.desc}</p>
                  </div>
               </div>
            </button>
          ))}
        </div>

        <div className="xl:col-span-3">
          <div className="bg-white min-h-[600px] rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
             {isGenerating ? (
               <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={48} className="text-blue-600 animate-spin" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">A IA está processando os dados e gerando o relatório...</p>
               </div>
             ) : reportResult ? (
               <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center"><FileText size={18} /></div>
                      <span className="font-black text-slate-800 text-sm uppercase tracking-tight">Rascunho de Relatório Gerencial v1.0</span>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                         <Download size={14} /> Baixar PDF
                       </button>
                    </div>
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto font-serif leading-relaxed text-slate-800 text-lg bg-slate-50/20">
                    <div className="max-w-3xl mx-auto whitespace-pre-wrap whitespace-pre-line">
                       {reportResult}
                    </div>
                  </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-20 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                    <FileBarChart size={48} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-800 tracking-tight">Pronto para gerar seu relatório?</p>
                    <p className="text-slate-400 mt-2 max-w-sm font-medium">Selecione um template ao lado para começar. A IA analisará todo o banco de dados do hospital para compilar o documento.</p>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
