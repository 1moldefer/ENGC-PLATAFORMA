import { useEffect, useState } from 'react'
import { supabase } from 'src/lib/supabaseClient'
import { Plus } from 'lucide-react'

export default function Chamados() {
    const [chamados, setChamados] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchChamados()
    }, [])

    const fetchChamados = async () => {
        const { data, error } = await supabase
            .from('chamados')
            .select('*, setores(nome), equipamentos(nome)')
            .order('created_at', { ascending: false })

        if (data) setChamados(data)
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Chamados</h1>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-sky-600 font-medium text-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    Novo Chamado
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Título</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Setor</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Criticidade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-sm text-gray-500">Carregando chamados...</td></tr>
                            ) : chamados.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-sm text-gray-500">Nenhum chamado encontrado.</td></tr>
                            ) : (
                                chamados.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{c.titulo}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{c.setores?.nome || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 capitalize">
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{c.criticidade}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
