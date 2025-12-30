
import React, { useState } from 'react'
import { supabase } from 'src/lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight, UserCircle2 } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            navigate('/app')
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                <div className="text-center">
                    <div className="flex justify-center mb-8">
                        <img
                            src={logo}
                            alt="Logo da Plataforma"
                            className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                        />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Bem-vindo de volta!
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 font-medium">
                        Acesse sua conta para continuar.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-3 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-700 font-bold bg-slate-50 ring-1 ring-inset ring-slate-100 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white transition-all outline-none"
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
                                    className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-700 font-bold bg-slate-50 ring-1 ring-inset ring-slate-100 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                            Alert: {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end text-sm">
                        <Link
                            to="/forgot-password"
                            className="font-bold text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                        >
                            <Lock size={16} />
                            Recuperar Senha
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-2xl bg-blue-600 py-4 px-3 text-sm font-black uppercase tracking-widest text-white hover:bg-blue-700 shadow-xl shadow-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {loading ? 'Entrando...' : 'Entrar na Plataforma'}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-50">
                        <p className="text-sm text-slate-400">
                            Não tem uma conta?{' '}
                            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1 mt-2">
                                Criar conta agora <ArrowRight size={16} />
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
