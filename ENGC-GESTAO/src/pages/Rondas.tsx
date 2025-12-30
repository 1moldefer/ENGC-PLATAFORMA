import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Screen } from '../../types';
import {
    Check, X, Camera, MapPin, AlertCircle, Save, Plus,
    History, Calendar, User, ChevronRight, CheckCircle2, Search,
    ArrowLeft, LayoutDashboard, ClipboardList, Eye, ArrowDownCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CHECKLIST_ITEMS = [
    'Verificar integridade dos cabos de alimentação',
    'Conferir selos de calibração vigentes',
    'Testar alarmes sonoros e visuais',
    'Limpeza superficial dos painéis',
    'Disponibilidade de acessórios básicos',
    'Estado geral dos carrinhos/suportes',
    'Verificar conexões de gases medicinais'
];

export const Rondas: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => {
    const { session } = useAuth();
    // Views: history (default), round_hub (list of sectors), sector_checklist (specific sector), signature (final)
    const [view, setView] = useState<'history' | 'round_hub' | 'sector_checklist' | 'signature' | 'round_details'>('history');

    const [history, setHistory] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);

    // State for the current round
    // Maps sector_id -> checklist object
    const [roundData, setRoundData] = useState<Record<string, Record<number, 'conforme' | 'nao_conforme' | null>>>({});
    const [currentSector, setCurrentSector] = useState<any>(null);
    const [currentChecklist, setCurrentChecklist] = useState<Record<number, 'conforme' | 'nao_conforme' | null>>({});

    // State for viewing history details
    const [selectedHistoryGroup, setSelectedHistoryGroup] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Signature State
    const [signerName, setSignerName] = useState('');
    const [signerRole, setSignerRole] = useState('');

    useEffect(() => {
        fetchHistory();
        fetchSectors();
        if (session?.user) {
            fetchUserProfile();
        }
    }, [session]);

    const fetchUserProfile = async () => {
        if (!session?.user?.id) return;
        const { data } = await supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single();
        if (data) {
            setSignerName(data.full_name || '');
            setSignerRole(data.role || '');
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        // Fetch recent rounds 
        const { data } = await supabase
            .from('rondas')
            .select('*, setores(nome), profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(100);
        if (data) setHistory(data);
        setLoading(false);
    };

    const fetchSectors = async () => {
        const { data } = await supabase.from('setores').select('*').order('nome');
        if (data) setSectors(data);
    };

    // Group History by Batch ID (extracted from observations)
    const groupedHistory = useMemo(() => {
        const groups: Record<string, any> = {};

        history.forEach(item => {
            // Extract Batch ID from "Ronda Geral (Lote: XXXXX)" or fallback to created_at if old format
            const batchMatch = item.observacoes?.match(/Lote: ([^)]+)/);
            const batchId = batchMatch ? batchMatch[1] : item.created_at; // Fallback to timestamp for legacy items

            if (!groups[batchId]) {
                groups[batchId] = {
                    id: batchId,
                    date: item.created_at,
                    signer: item.observacoes?.split('Assinado por: ')[1] || item.profiles?.full_name || 'Desconhecido',
                    items: [],
                    totalCompliance: 0
                };
            }
            groups[batchId].items.push(item);
        });

        // Calculate averages and sort groups by date
        return Object.values(groups).map(g => {
            const totalItems = g.items.length;
            const sumCompliance = g.items.reduce((acc: number, item: any) => acc + calculateCompliance(item.checklist_json), 0);
            return {
                ...g,
                compliance: Math.round(sumCompliance / totalItems)
            };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    }, [history]);

    // -- Navigation & Flow Handlers --

    const startNewRound = () => {
        setRoundData({});
        setCurrentSector(null);
        setCurrentChecklist({});
        setView('round_hub');
    };

    const openSectorChecklist = (sector: any) => {
        setCurrentSector(sector);
        // Load existing data for this sector if any, else empty
        setCurrentChecklist(roundData[sector.id] || {});
        setView('sector_checklist');
    };

    const saveSectorChecklist = () => {
        if (!currentSector) return;
        setRoundData(prev => ({
            ...prev,
            [currentSector.id]: currentChecklist
        }));
        setView('round_hub');
    };

    const goToSignature = () => {
        const checkedCount = Object.keys(roundData).length;
        if (checkedCount === 0) {
            alert('Realize a inspeção em pelo menos um setor antes de finalizar a ronda.');
            return;
        }
        setView('signature');
    };

    const handleFinalSave = async () => {
        if (!session?.user) {
            alert('Erro: Sessão inválida ou usuário não logado. Por favor, recarregue a página.');
            return;
        }
        setSaving(true);

        const timestamp = new Date().toISOString();
        const batchId = Math.random().toString(36).substring(2, 10);

        const inserts = Object.entries(roundData).map(([sectorId, checklistData]) => ({
            setor_id: sectorId,
            realizada_por: session.user.id,
            checklist_json: checklistData,
            created_at: timestamp,
            observacoes: `Ronda Geral (Lote: ${batchId}). Assinado por: ${signerName} (${signerRole})`
        }));

        try {
            const { error } = await supabase.from('rondas').insert(inserts);

            if (error) throw error;

            alert('Ronda finalizada e salva com sucesso!');
            fetchHistory();
            setView('history');
        } catch (error: any) {
            console.error('Erro ao salvar ronda:', error);
            alert('Erro ao salvar ronda: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setSaving(false);
        }
    };

    const viewHistoryDetails = (group: any) => {
        setSelectedHistoryGroup(group);
        setView('round_details');
    }

    // -- Checklist Logic --

    const handleCheckItem = (index: number, status: 'conforme' | 'nao_conforme') => {
        setCurrentChecklist(prev => ({ ...prev, [index]: status }));
    };

    // -- Helpers --

    function calculateCompliance(checklistData: any) {
        if (!checklistData) return 100;
        const total = Object.keys(checklistData).length;
        if (total === 0) return 0;
        const ok = Object.values(checklistData).filter(v => v === 'conforme').length;
        return Math.round((ok / total) * 100);
    };

    const getSectorStatus = (sectorId: string) => {
        return roundData[sectorId] ? 'done' : 'pending';
    };

    // -- Views --

    if (view === 'history') {
        return (
            <div className="space-y-6 pb-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase italic">Histórico de Rondas</h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">Registro de inspeções em lote.</p>
                    </div>
                    <button
                        onClick={startNewRound}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} /> Iniciar Ronda
                    </button>
                </div>

                <div className="grid gap-4">
                    {groupedHistory.length === 0 && !loading && (
                        <div className="p-10 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <History size={32} />
                            </div>
                            <p className="text-slate-500 font-medium">Nenhuma ronda registrada recentemente.</p>
                        </div>
                    )}

                    {groupedHistory.map((group) => (
                        <div key={group.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${group.compliance === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <ClipboardList size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">Ronda Geral</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                            {new Date(group.date).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-black ${group.compliance === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                        {group.compliance}%
                                    </span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Aderência Global</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-slate-400" />
                                    <p className="text-xs font-bold text-slate-500 uppercase">{group.signer}</p>
                                </div>
                                <button
                                    onClick={() => viewHistoryDetails(group)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-100 transition-colors"
                                >
                                    Ver Detalhes ({group.items.length} setores) <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'round_details') {
        const group = selectedHistoryGroup;
        if (!group) return <div>Erro: Nenhum grupo selecionado.</div>;

        return (
            <div className="space-y-6 pb-20">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setView('history')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={24} className="text-slate-600" /></button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase italic">Detalhes da Ronda</h1>
                        <p className="text-xs text-slate-500 font-medium">Realizada em {new Date(group.date).toLocaleString('pt-BR')} por {group.signer}</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {group.items.map((item: any) => {
                        const compliance = calculateCompliance(item.checklist_json);
                        return (
                            <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 flex justify-between items-center bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${compliance === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {compliance === 100 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg">{item.setores?.nome}</h3>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black ${compliance === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {compliance}% Conforme
                                    </div>
                                </div>

                                {/* Checklist Items Breakdown */}
                                <div className="p-6 border-t border-slate-100 space-y-3">
                                    {CHECKLIST_ITEMS.map((text, idx) => {
                                        const status = item.checklist_json?.[idx];
                                        if (!status) return null; // Only show checked items

                                        return (
                                            <div key={idx} className="flex justify-between items-start text-sm">
                                                <span className="text-slate-600 font-medium">{text}</span>
                                                <span className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded ml-4 whitespace-nowrap ${status === 'conforme' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                                                    }`}>
                                                    {status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (view === 'round_hub') {
        const checkedCount = Object.keys(roundData).length;
        const totalCount = sectors.length;
        const progress = Math.round((checkedCount / totalCount) * 100);

        const filteredSectors = sectors.filter(s => s.nome.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
            <div className="space-y-6 pb-28">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('history')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={24} className="text-slate-600" /></button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase italic">Ronda - Seleção de Setores</h1>
                            <p className="text-xs text-slate-500 font-medium">Selecione os setores para realizar a inspeção.</p>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-10"><LayoutDashboard size={100} /></div>
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Progresso da Ronda</p>
                                <p className="text-3xl font-black">{checkedCount} <span className="text-slate-500 text-lg font-medium">/ {totalCount} Setores</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-blue-400">{progress}%</p>
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar setor..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Sectors Grid */}
                <div className="grid gap-3">
                    {filteredSectors.map(s => {
                        const isDone = getSectorStatus(s.id) === 'done';
                        const itemCount = isDone ? Object.keys(roundData[s.id]).length : 0;

                        return (
                            <button
                                key={s.id}
                                onClick={() => openSectorChecklist(s)}
                                className={`group p-5 rounded-2xl border shadow-sm transition-all flex justify-between items-center text-left ${isDone
                                    ? 'bg-emerald-50 border-emerald-100'
                                    : 'bg-white border-slate-100 hover:border-blue-500 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                        {isDone ? <Check size={20} /> : <ClipboardList size={20} />}
                                    </div>
                                    <div>
                                        <span className={`font-bold text-lg ${isDone ? 'text-emerald-900' : 'text-slate-700 group-hover:text-blue-700'}`}>{s.nome}</span>
                                        {isDone && <p className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Concluído ({itemCount} itens)</p>}
                                        {!isDone && <p className="text-xs text-slate-400">Pendente inspeção</p>}
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDone ? 'text-emerald-300' : 'text-slate-300 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                    <ChevronRight size={18} />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Final Button */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur border-t border-slate-200 z-20">
                    <button
                        onClick={goToSignature}
                        disabled={checkedCount === 0}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={20} /> Finalizar e Assinar Ronda ({checkedCount} setores)
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'sector_checklist') {
        const completedCount = Object.keys(currentChecklist).length;
        const totalItems = CHECKLIST_ITEMS.length;

        return (
            <div className="space-y-6 pb-24">
                <div className="sticky top-0 bg-slate-50/95 backdrop-blur z-20 py-4 border-b border-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setView('round_hub')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={20} className="text-slate-600" /></button>
                        <div>
                            <h2 className="font-bold text-slate-800 leading-tight">{currentSector?.nome}</h2>
                            <p className="text-xs text-slate-500 font-medium">Checklist Individual</p>
                        </div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                        {completedCount}/{totalItems}
                    </div>
                </div>

                <div className="space-y-4">
                    {CHECKLIST_ITEMS.map((item, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <p className="font-bold text-slate-700 text-sm leading-relaxed">{item}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCheckItem(index, 'conforme')}
                                    className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${currentChecklist[index] === 'conforme' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <CheckCircle2 size={16} /> CONFORME
                                </button>
                                <button
                                    onClick={() => handleCheckItem(index, 'nao_conforme')}
                                    className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${currentChecklist[index] === 'nao_conforme' ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <AlertCircle size={16} /> NÃO CONFORME
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur border-t border-slate-200 z-20">
                    <button
                        onClick={saveSectorChecklist}
                        disabled={completedCount === 0}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={20} /> Confirmar Inspeção do Setor
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'signature') {
        const totalSectors = Object.keys(roundData).length;

        return (
            <div className="flex flex-col min-h-[calc(100vh-100px)]">
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('round_hub')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={24} className="text-slate-600" /></button>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Finalizar Ronda Completa</h1>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 p-4 border-4 border-emerald-100">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 mb-2">Ronda Finalizada!</h2>
                            <p className="text-slate-500">Você inspecionou <strong className="text-slate-800">{totalSectors} setores</strong> nesta rodada.</p>
                        </div>

                        <div className="border-t border-slate-100 pt-6 space-y-6">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Responsável Técnico</p>
                                <input
                                    value={signerName}
                                    onChange={(e) => setSignerName(e.target.value)}
                                    className="text-2xl font-bold text-slate-800 text-center w-full bg-transparent border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-2 transition-colors"
                                    placeholder="Digite seu nome..."
                                />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Cargo / Função</p>
                                <input
                                    value={signerRole}
                                    onChange={(e) => setSignerRole(e.target.value)}
                                    className="text-lg font-medium text-slate-600 text-center w-full bg-transparent border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-2 transition-colors"
                                    placeholder="Digite seu cargo..."
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                                <p>Ao assinar, você certifica que todas as inspeções realizadas nos setores selecionados são verdadeiras e foram executadas de acordo com os protocolos da instituição.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-slate-50 py-6 mt-4">
                    <button
                        onClick={handleFinalSave}
                        disabled={saving || !signerName}
                        className="w-full py-5 bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {saving ? 'Salvando...' : (
                            <>
                                <Save size={24} />
                                Salvar Ronda Completa
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
