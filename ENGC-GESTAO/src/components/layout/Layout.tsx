import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Ticket, Wrench, ClipboardList, BookOpen, LogOut, Settings } from 'lucide-react'
import { useAuth } from 'src/contexts/AuthContext'
import { cn } from 'src/lib/utils'

export default function AppLayout() {
    const { signOut, profile } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const navItems = [
        { name: 'Dashboard', to: '/app', icon: LayoutDashboard, exact: true },
        { name: 'Chamados', to: '/app/chamados', icon: Ticket },
        { name: 'Ordens de Serviço', to: '/app/os', icon: Wrench },
        { name: 'Rondas', to: '/app/rondas', icon: ClipboardList },
        { name: 'Inventário', to: '/app/equipamentos', icon: Settings },
        { name: 'POPs', to: '/app/pops', icon: BookOpen },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white">EC</div>
                    <span className="font-bold text-lg tracking-tight">Engenharia Clínica</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            end={item.exact}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-800 text-sky-400 border-l-4 border-sky-500"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-slate-400 capitalize">{profile?.role || 'Tecnico'}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col relative w-full">
                {/* Mobile Header */}
                <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white">EC</div>
                        <span className="font-bold">Engenharia Clínica</span>
                    </div>
                    <button onClick={handleSignOut}><LogOut className="w-5 h-5" /></button>
                </header>

                <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
