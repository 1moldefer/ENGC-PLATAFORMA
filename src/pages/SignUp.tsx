
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User, ArrowRight, UserPlus } from 'lucide-react'

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })

        if (error) {
            setError(error.message)
        } else {
            if (data.session) {
                navigate('/app')
            } else {
                setError('Conta criada! Verifique seu email para confirmar o cadastro.')
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 transform -rotate-3 hover:-rotate-6 transition-transform">
                        <UserPlus size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Crie sua conta
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 font-medium">
                        Comece a usar o sistema agora mesmo.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-3 mb-1 block">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-700 font-bold bg-slate-50 ring-1 ring-inset ring-slate-100 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 focus:bg-white transition-all outline-none"
                                    placeholder="Seu nome"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-3 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-700 font-bold bg-slate-50 ring-1 ring-inset ring-slate-100 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 focus:bg-white transition-all outline-none"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-3 mb-1 block">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-700 font-bold bg-slate-50 ring-1 ring-inset ring-slate-100 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 focus:bg-white transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${error.includes('conta criada') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-2xl bg-emerald-600 py-4 px-3 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {loading ? 'Criando...' : 'Criar Conta Grátis'}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-50">
                        <p className="text-sm text-slate-400">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 flex items-center justify-center gap-1 mt-2">
                                Fazer login <ArrowRight size={16} />
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
