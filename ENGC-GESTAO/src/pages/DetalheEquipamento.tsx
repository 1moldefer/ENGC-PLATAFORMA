import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Screen, Status } from '../../types';
import {
  Box, History, FileText, Move, Activity, Wrench, AlertCircle,
  AlertOctagon, CheckCircle2, ShieldCheck, Zap, Package
} from 'lucide-react';

export const DetalheEquipamento: React.FC<{ id: string, onNavigate: (s: Screen, id?: string) => void }> = ({ id, onNavigate }) => {
  const [eq, setEq] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInterdicting, setIsInterdicting] = useState(false);
  const [interdictReason, setInterdictReason] = useState('');
  const [interdictDesc, setInterdictDesc] = useState('');

  useEffect(() => {
    if (id) {
      fetchEquipment();
      fetchHistory();
    }
  }, [id]);

  const fetchEquipment = async () => {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*, setores(nome)')
      .eq('id', id)
      .single();

    if (data) setEq(data);
    setLoading(false);
  };

  const fetchHistory = async () => {
    // Fetch OS related to this equipment
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('*, tecnico:profiles!assigned_to(full_name)')
      .eq('equipamento_id', id)
      .order('created_at', { ascending: false });

    if (data) setHistory(data);
  };

  const handleToggleInterdiction = async () => {
    if (!eq) return;

    const isCurrentlyInterdicted = eq.status === 'interditado';
    const newStatus = isCurrentlyInterdicted ? 'ativo' : 'interditado';

    try {
      const { error } = await supabase
        .from('equipamentos')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEq({ ...eq, status: newStatus });
      setIsInterdicting(false);
      setInterdictReason('');
      setInterdictDesc('');

    } catch (err: any) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando prontuário...</div>;
  if (!eq) return <div className="p-10 text-center">Equipamento não encontrado.</div>;

  const isInterdicted = eq.status === 'interditado';

  return (
    <div className="space-y-8 pb-20">
      {/* High-Impact Header */}
      <div className={`p-10 rounded-[40px] shadow-sm border transition-all ${isInterdicted ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className={`w-32 h-32 rounded-[32px] flex items-center justify-center shrink-0 shadow-lg ${isInterdicted ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
            {isInterdicted ? <AlertOctagon size={64} /> : <Box size={64} />}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">{eq.nome}</h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${isInterdicted ? 'bg-red-600 text-white border-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                {eq.status?.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tag/Patrimônio</p>
                <p className="text-lg font-bold text-slate-700">{eq.patrimonio}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Setor</p>
                <p className="text-lg font-bold text-slate-700">{eq.setor || eq.setores?.nome || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Marca/Modelo</p>
                <p className="text-lg font-bold text-slate-700">{eq.marca || '-'} {eq.modelo || ''}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Série</p>
                <p className="text-lg font-bold text-slate-700">{eq.serie || '-'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsInterdicting(true)}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isInterdicted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200'}`}
            >
              {isInterdicted ? <ShieldCheck size={20} /> : <AlertOctagon size={20} />}
              {isInterdicted ? 'Liberar Ativo' : 'Interditar Ativo'}
            </button>
            <button onClick={() => onNavigate('ABRIR_CHAMADO')} className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              <Wrench size={20} /> Abrir Chamado
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3 uppercase italic">
              <History className="text-blue-600" size={24} /> Prontuário Técnico Completo
            </h3>
            <div className="relative space-y-0">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100"></div>
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic">Nenhuma ordem de serviço registrada para este equipamento.</div>
              ) : (
                history.map((os, i) => (
                  <div key={os.id} className="relative flex gap-8 pb-10 group">
                    <div className="absolute left-[18px] top-2 w-3 h-3 rounded-full bg-white border-4 border-blue-600 z-10"></div>
                    <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><Wrench size={18} /></div>
                          <span className="font-black text-slate-800 text-lg tracking-tight">Manutenção {os.status === 'concluida' ? 'Corretiva' : 'Em Aberto'}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(os.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mb-3">{os.diagnostico || 'Diagnóstico pendente...'}</p>
                      <p className="text-xs text-slate-500 mb-2"><strong>Ações:</strong> {os.acoes || '-'}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                        <span className="text-xs text-slate-400 font-bold uppercase">Resp: {os.tecnico?.full_name || 'Técnico'}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${os.status === 'concluida' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                          {os.status ? os.status?.toUpperCase().replace('_', ' ') : 'PENDENTE'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={120} /></div>
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight italic">Próximos Eventos</h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Manut. Preventiva</p>
                <p className="text-lg font-bold">Junho 2024</p>
                <p className="text-xs text-slate-400 mt-1">Estimativa baseada em cronograma padrão.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isInterdicting && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className={`${isInterdicted ? 'bg-emerald-600' : 'bg-red-600'} p-8 text-white flex justify-between items-center`}>
              <div className="flex items-center gap-4">
                {isInterdicted ? <ShieldCheck size={32} /> : <AlertOctagon size={32} />}
                <h3 className="text-2xl font-black uppercase tracking-tight italic">
                  {isInterdicted ? 'Protocolo de Liberação' : 'Protocolo de Interdição'}
                </h3>
              </div>
              <button onClick={() => setIsInterdicting(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">X</button>
            </div>
            <div className="p-10 space-y-6">
              {!isInterdicted && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Motivo da Interdição</label>
                    <select
                      value={interdictReason}
                      onChange={(e) => setInterdictReason(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-red-100 outline-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="risco">Risco iminente ao paciente</option>
                      <option value="falha">Falha estrutural/elétrica</option>
                      <option value="obsoleto">Fim da vida útil técnica</option>
                      <option value="judicial">Interdição Judicial/Vigilância</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Descrição Técnica</label>
                    <textarea
                      value={interdictDesc}
                      onChange={(e) => setInterdictDesc(e.target.value)}
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[30px] text-slate-700 font-medium focus:ring-4 focus:ring-red-100 outline-none"
                      rows={4}
                      placeholder="Descreva detalhadamente..."
                    />
                  </div>
                </>
              )}

              <div className={`p-6 border rounded-3xl flex items-center gap-4 ${isInterdicted ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                <div className={`w-12 h-12 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg ${isInterdicted ? 'bg-emerald-600 shadow-emerald-200' : 'bg-red-600 shadow-red-200'}`}>
                  <Box size={20} />
                </div>
                <p className="text-sm font-bold leading-tight">
                  {isInterdicted
                    ? 'O equipamento será liberado para uso assistencial e voltará ao status "ATIVO".'
                    : 'ATENÇÃO: Este equipamento será removido do uso assistencial e aparecerá como "INTERDITADO".'}
                </p>
              </div>
              <button
                onClick={handleToggleInterdiction}
                className={`w-full py-5 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 ${isInterdicted ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-red-600 shadow-red-100 hover:bg-red-700'}`}
              >
                {isInterdicted ? 'Confirmar Liberação (Green Tag)' : 'Confirmar Interdição (Red Tag)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
