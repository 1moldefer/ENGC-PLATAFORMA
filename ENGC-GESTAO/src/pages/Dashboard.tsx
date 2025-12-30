import { Ticket, Wrench, ClipboardList, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
    { name: 'Chamados Abertos', value: '12', icon: Ticket, color: 'bg-blue-500', link: '/app/chamados' },
    { name: 'OS em Execução', value: '4', icon: Wrench, color: 'bg-green-500', link: '/app/os' },
    { name: 'Rondas Pendentes', value: '2', icon: ClipboardList, color: 'bg-purple-500', link: '/app/rondas' },
    { name: 'Equip. Interditados', value: '3', icon: AlertTriangle, color: 'bg-red-500', link: '/app/equipamentos' },
]

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <Link
                        key={item.name}
                        to={item.link}
                        className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="p-5 flex items-center">
                            <div className={`rounded-lg p-3 ${item.color}`}>
                                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6 min-h-[200px]">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Atividades Recentes</h3>
                    <p className="text-gray-500 text-sm">Nenhuma atividade recente encontrada.</p>
                </div>
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6 min-h-[200px]">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Status dos Equipamentos</h3>
                    <div className="flex items-center justify-center h-full pb-6 text-gray-400">
                        Gráfico aqui
                    </div>
                </div>
            </div>
        </div>
    )
}
