import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/modal';
import { Send, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ChatMessage {
    sender: 'user' | 'lira';
    text: string;
    suggestedProducts?: Array<{
        id: number;
        name: string;
        slug: string;
        presentation: string;
    }>;
    disclaimer?: string | null;
}

interface LiraAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LiraAssistantModal({ isOpen, onClose }: LiraAssistantModalProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: 'lira',
            text: '¡Hola! 🐾 Soy <strong>Lira</strong>, la asistente virtual oficial de <strong>Booz Laboratorio</strong>. Estoy aquí para orientarte sobre nuestro vademécum, principios activos, posología y las 4 líneas terapéuticas registradas. ¿Qué producto o área de salud deseas consultar hoy?',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (queryText?: string) => {
        const textToSend = queryText || input;
        if (!textToSend.trim() || isLoading) return;

        const userMsg: ChatMessage = { sender: 'user', text: textToSend };
        setMessages((prev) => [...prev, userMsg]);
        if (!queryText) setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message: textToSend }),
            });

            if (response.ok) {
                const data = await response.json();
                const liraMsg: ChatMessage = {
                    sender: 'lira',
                    text: data.reply,
                    suggestedProducts: data.suggestedProducts,
                    disclaimer: data.disclaimer,
                };
                setMessages((prev) => [...prev, liraMsg]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'lira',
                        text: 'Disculpa, tuve un inconveniente conectando con el catálogo central. Por favor intenta de nuevo.',
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'lira',
                    text: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickChips = [
        'Pie Diabético (Bactrocis)',
        'Fórmula de Bacumer',
        '4 Líneas de productos',
        'Farmacovigilancia INH',
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lira | Asistente Virtual Booz Laboratorio">
            <div className="bg-slate-900 -m-6 p-6 h-[560px] flex flex-col rounded-b-2xl">
                {/* Lira Header Banner with Animated Waving Mascot */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                    <div className="relative h-14 w-14 rounded-2xl bg-blue-950/80 border border-blue-500/40 p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                        <img 
                            src="/assets/img/lira_saludo_animado.gif" 
                            alt="Lira Asistente Virtual Saludando" 
                            className="h-full w-full object-cover rounded-xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/img/lira_real_head_avatar.png';
                            }}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-base">Lira</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                <Sparkles className="h-2.5 w-2.5" /> Asistente Inteligente
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">Booz Laboratorio VGME, C.A. • Orientación Farmacéutica</p>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-sm">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'lira' && (
                                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border border-blue-400/50 shadow-md bg-blue-950">
                                    <img 
                                        src="/assets/img/lira_head_avatar.png" 
                                        alt="Lira" 
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="max-w-[85%] space-y-2">
                                <div
                                    className={`p-3.5 rounded-2xl ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                                            : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: msg.text }}
                                />

                                {/* Suggested Products Cards */}
                                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                                    <div className="mt-2 space-y-1.5 pl-1">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                                            Productos en catálogo oficial:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.suggestedProducts.map((p) => (
                                                <Link
                                                    key={p.id}
                                                    href={`/producto/${p.slug}`}
                                                    onClick={onClose}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-900/60 border border-blue-500/30 text-xs text-blue-300 transition-colors"
                                                >
                                                    <span>{p.name}</span>
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Anti-Automedicación Mandatory Disclaimer */}
                                {msg.disclaimer && (
                                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                                        <ShieldAlert className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" />
                                        <span>{msg.disclaimer}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 items-center text-xs text-slate-400 italic">
                            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border border-blue-400/50 animate-pulse bg-blue-950">
                                <img 
                                    src="/assets/img/lira_head_avatar.png" 
                                    alt="Lira" 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <span className="animate-pulse">Lira está consultando el vademécum de Booz Laboratorio...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Chips (Contained without overflowing) */}
                <div className="pt-2 pb-2 flex flex-wrap gap-1.5">
                    {quickChips.map((chip, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(chip)}
                            className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-blue-900/50 text-slate-300 border border-slate-700 hover:border-blue-400/40 transition-colors cursor-pointer"
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                {/* Input form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="relative flex items-center pt-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregúntale a Lira sobre medicamentos, fórmulas o dosis..."
                        className="w-full rounded-2xl border-slate-700 bg-slate-800/90 pl-4 pr-12 py-3 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-600/30"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </Modal>
    );
}
