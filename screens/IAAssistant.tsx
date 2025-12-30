
import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, User, Loader2, Sparkles, FileText, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { askTechnicalAssistant } from '../services/gemini';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const IAAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou seu Assistente Técnico Virtual de Engenharia Clínica. Minha base de conhecimento inclui normas ABNT NBR IEC 60601, legislações da ANVISA e manuais de diversos fabricantes. Como posso auxiliar seu plantão hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    const response = await askTechnicalAssistant(textToSend);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  const clearChat = () => {
    if (window.confirm("Deseja realmente limpar o histórico da conversa atual?")) {
      setMessages([{ role: 'ai', text: 'Conversa reiniciada. Em que posso ajudar agora?' }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
      {/* AI Header */}
      <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Cpu size={24} />
            </div>
            <div>
               <h3 className="font-black tracking-tight text-lg leading-tight">Engenheiro Clínico AI</h3>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modelo Gemini-3-Flash Ativo</span>
               </div>
            </div>
         </div>
         <div className="flex gap-2">
            <button onClick={clearChat} className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all" title="Limpar conversa">
               <Trash2 size={20} />
            </button>
         </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border ${
                 m.role === 'user' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200'
               }`}>
                  {m.role === 'user' ? <User size={20} /> : <Cpu size={20} />}
               </div>
               <div className={`p-6 rounded-[28px] shadow-sm text-sm leading-relaxed ${
                 m.role === 'user' 
                   ? 'bg-blue-600 text-white rounded-tr-none' 
                   : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
               }`}>
                 <p className="font-medium whitespace-pre-wrap">{m.text}</p>
               </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="bg-white p-6 rounded-[28px] rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-3">
                 <span className="text-xs text-slate-400 font-bold italic uppercase tracking-widest animate-pulse">Pensando tecnicamente...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { label: "Checklist Preventiva Autoclave", icon: FileText },
              { label: "Normas Segurança Elétrica", icon: Sparkles },
              { label: "Report de Falha Tomógrafo", icon: FileText }
            ].map((sug, i) => (
              <button 
                key={i}
                onClick={() => handleSend(sug.label)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 whitespace-nowrap hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all uppercase tracking-widest"
              >
                <sug.icon size={14} /> {sug.label}
              </button>
            ))}
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Descreva o problema técnico, solicite um rascunho de relatório ou tire dúvidas de normas..."
              className="w-full pl-6 pr-16 py-5 bg-slate-100 border-2 border-transparent rounded-[30px] text-base focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all ${input.trim() && !loading ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-300 text-slate-100 cursor-not-allowed'}`}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
