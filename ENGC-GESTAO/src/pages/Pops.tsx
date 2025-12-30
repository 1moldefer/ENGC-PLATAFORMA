import { useState } from 'react'
import React from 'react'
import { supabase } from 'src/lib/supabaseClient'
import { Send, Bot, FileText, AlertCircle } from 'lucide-react'

interface Source {
    id: string
    titulo: string
    versao: string
    conteudo: string
}

interface Message {
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
}

export default function Pops() {
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Olá! Sou seu assistente técnico. Tenho acesso a todos os POPs cadastrados. Qual sua dúvida?' }
    ])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        const userMsg = query
        setQuery('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.functions.invoke('ai-chat-pop', {
                body: { question: userMsg }
            })

            if (error) throw error

            if (data) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.answer,
                    sources: data.sources
                }])
            }
        } catch (err: any) {
            console.error('Full error:', err)
            const errorMsg = err?.message || err?.error_description || 'Erro desconhecido.'
            setError(`Erro ao conectar: ${errorMsg}`)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um problema ao processar sua solicitação.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-primary" />
                    Procedimentos (POPs) & Assistente IA
                </h1>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-emerald-600 text-white'}`}>
                                    {msg.role === 'user' ? 'U' : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>

                                    {/* Sources citations */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs font-semibold mb-1 opacity-70">Fontes consultadas:</p>
                                            <ul className="space-y-1">
                                                {msg.sources.map(src => (
                                                    <li key={src.id} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        {src.titulo} (v{src.versao})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center">
                            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pergunte sobre um procedimento (ex: Como calibrar o monitor multiparamétrico?)"
                            className="flex-1 rounded-lg border-gray-300 focus:ring-primary focus:border-primary px-4 py-3 shadow-sm ring-1 ring-inset ring-gray-300"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="bg-primary text-white rounded-lg px-6 py-2 font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
