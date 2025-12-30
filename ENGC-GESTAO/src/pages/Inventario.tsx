
import React, { useEffect, useState } from 'react';
import { Search, Filter, Box, MapPin, MoreVertical, ExternalLink, QrCode, Plus, Edit2, Ban, CheckCircle, X } from 'lucide-react';
import { supabase } from 'src/lib/supabaseClient';

export function Inventario({ onSelect }: { onSelect: (id: string) => void }) {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // setores state can remain for suggestion logic if needed, but not for dropdown
  const [setores, setSetores] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    modelo: '',
    patrimonio: '',
    serie: '',
    setor_nome: '',
    criticidade: 'baixa',
    status: 'ativo' as const
  });

  useEffect(() => {
    fetchEquipamentos();
    fetchSetores();
  }, []);

  const fetchEquipamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('equipamentos')
        .select('*, setores(nome)')
        .order('nome', { ascending: true });

      if (sbError) throw sbError;
      if (data) setEquipamentos(data);
    } catch (err: any) {
      console.error('Erro ao buscar equipamentos:', err);
      setError(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSetores = async () => {
    const { data } = await supabase.from('setores').select('id, nome').order('nome');
    if (data) setSetores(data);
  };

  const handleOpenModal = (equipamento?: any) => {
    if (equipamento) {
      setEditingId(equipamento.id);
      setFormData({
        nome: equipamento.nome,
        marca: equipamento.marca || '',
        modelo: equipamento.modelo || '',
        patrimonio: equipamento.patrimonio,
        serie: equipamento.serie || '',
        setor_nome: equipamento.setores?.nome || '',
        criticidade: equipamento.criticidade || 'baixa',
        status: equipamento.status || 'ativo'
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        marca: '',
        modelo: '',
        patrimonio: '',
        serie: '',
        setor_nome: '',
        criticidade: 'baixa',
        status: 'ativo'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Resolve Setor ID from Name (Find or Create)
      let setorIdToSave = null;
      const setorNomeClean = formData.setor_nome.trim();

      if (setorNomeClean) {
        // Try to find existing
        const { data: existingSetor } = await supabase
          .from('setores')
          .select('id')
          .ilike('nome', setorNomeClean)
          .single();

        if (existingSetor) {
          setorIdToSave = existingSetor.id;
        } else {
          // Create new
          const { data: newSetor, error: createSetorError } = await supabase
            .from('setores')
            .insert([{ nome: setorNomeClean.toUpperCase() }]) // Standardize to Uppercase
            .select()
            .single();

          if (createSetorError) throw createSetorError;
          setorIdToSave = newSetor.id;
        }
      }

      // 2. Prepare Data
      const dataToSave = {
        nome: formData.nome,
        marca: formData.marca,
        modelo: formData.modelo,
        patrimonio: formData.patrimonio,
        serie: formData.serie,
        setor_id: setorIdToSave,
        criticidade: formData.criticidade,
        status: formData.status
      };

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('equipamentos')
          .update(dataToSave)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('equipamentos')
          .insert([dataToSave]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchEquipamentos();
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const handleInterdict = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'interditado' ? 'ativo' : 'interditado';
    if (!window.confirm(`Deseja alterar o status para ${newStatus.toUpperCase()}?`)) return;

    try {
      const { error } = await supabase
        .from('equipamentos')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchEquipamentos();
    } catch (err: any) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  const filteredEquipamentos = equipamentos.filter(eq =>
    eq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventário</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Novo Equipamento
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por Tag, Marca, Modelo ou Nome..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Filters */}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tag</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Equipamento</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Setor</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Marca/Modelo</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {error ? (
                <tr><td colSpan={6} className="p-8 text-center text-red-500 font-bold">Erro: {error}</td></tr>
              ) : loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Carregando equipamentos...</td></tr>
              ) : filteredEquipamentos.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Nenhum equipamento encontrado.</td></tr>
              ) : (
                filteredEquipamentos.map(eq => (
                  <tr
                    key={eq.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    onClick={() => onSelect(eq.id)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-tight">
                        {eq.patrimonio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Box size={16} />
                        </div>
                        <span className="font-bold text-slate-800">{eq.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin size={14} />
                        {eq.setores?.nome || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{eq.marca}</p>
                        <p className="text-xs text-slate-400">{eq.modelo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${eq.status === 'ativo' ? 'bg-green-500' : eq.status === 'interditado' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                        <span className={`text-xs font-bold capitalize ${eq.status === 'ativo' ? 'text-green-700' : eq.status === 'interditado' ? 'text-red-700' : 'text-amber-700'}`}>
                          {eq.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Editar"
                          onClick={() => handleOpenModal(eq)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          title={eq.status === 'interditado' ? 'Liberar' : 'Interditar'}
                          onClick={() => handleInterdict(eq.id, eq.status)}
                          className={`p-2 rounded-lg transition-colors ${eq.status === 'interditado' ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`}
                        >
                          {eq.status === 'interditado' ? <CheckCircle size={18} /> : <Ban size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Equipamento *</label>
                  <input
                    required
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Monitor Multiparâmetro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tag/Patrimônio *</label>
                  <input
                    required
                    value={formData.patrimonio}
                    onChange={e => setFormData({ ...formData, patrimonio: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 00-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Marca</label>
                  <input
                    value={formData.marca}
                    onChange={e => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Modelo</label>
                  <input
                    value={formData.modelo}
                    onChange={e => setFormData({ ...formData, modelo: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nº de Série</label>
                  <input
                    value={formData.serie}
                    onChange={e => setFormData({ ...formData, serie: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Setor (Nome)</label>
                  <input
                    value={formData.setor_nome}
                    onChange={e => setFormData({ ...formData, setor_nome: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: UTI GERAL"
                    list="setores-list"
                  />
                  <datalist id="setores-list">
                    {setores.map(s => (
                      <option key={s.id} value={s.nome} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Criticidade</label>
                  <select
                    value={formData.criticidade}
                    onChange={e => setFormData({ ...formData, criticidade: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status Inicial</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="em_manutencao">Em Manutenção</option>
                    <option value="interditado">Interditado</option>
                    <option value="externo">Externo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                >
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
