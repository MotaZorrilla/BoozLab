import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Bot, User, Clock, ShieldAlert, Cpu, Sparkles, CheckCircle2, X } from 'lucide-react';

interface ChatMessageItem {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    source?: string | null;
    model?: string | null;
    latency_ms: number;
    prompt_tokens?: number | null;
    completion_tokens?: number | null;
    disclaimer_shown: boolean;
    guardrail_triggered?: string | null;
    created_at: string;
}

interface ChatSessionDetail {
    id: number;
    session_uid: string;
    first_query?: string | null;
    url_ref?: string | null;
    turn_count: number;
    total_latency_ms: number;
    last_source?: string | null;
    action?: string | null;
    converted_to_order: boolean;
    started_at?: string | null;
    ended_at?: string | null;
    messages?: ChatMessageItem[];
}

interface TranscriptModalProps {
    session: ChatSessionDetail | null;
    open: boolean;
    onClose: () => void;
}

export function ConversationTranscriptModal({ session, open, onClose }: TranscriptModalProps) {
    if (!session) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 shadow-2xl">
                <DialogHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    Auditoría de Conversación Lira AI
                                    {session.converted_to_order && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                                            <CheckCircle2 className="w-3 h-3" /> Pedido Generado
                                        </span>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                    UID: {session.session_uid} • {session.turn_count} turnos • {session.total_latency_ms} ms acumulados
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    {/* Barra de metadatos de sesión */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono text-[11px]">
                            Origen: {session.url_ref || '/'}
                        </span>
                        {session.action && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded font-mono text-[11px] border border-amber-300 dark:border-amber-800">
                                Acción: {session.action}
                            </span>
                        )}
                        {session.started_at && (
                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                Iniciada: {new Date(session.started_at).toLocaleString('es-VE')}
                            </span>
                        )}
                    </div>
                </DialogHeader>

                {/* Lista de mensajes tipo chat */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-[#070C18]/60">
                    {session.messages && session.messages.length > 0 ? (
                        session.messages.map((msg) => {
                            const isUser = msg.role === 'user';

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    {!isUser && (
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center shadow-md">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div className={`max-w-[82%] space-y-1.5`}>
                                        <div
                                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                                                isUser
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                                            }`}
                                        >
                                            {/* Renderizado de texto con soporte HTML seguro */}
                                            <div
                                                dangerouslySetInnerHTML={{ __html: msg.content }}
                                                className="break-words space-y-1"
                                            />
                                        </div>

                                        {/* Insignias y metadatos técnicos del mensaje */}
                                        <div className={`flex flex-wrap items-center gap-1.5 text-[10px] ${isUser ? 'justify-end text-slate-400' : 'justify-start text-slate-500'}`}>
                                            {!isUser && (
                                                <>
                                                    {msg.source && (
                                                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[9px] text-slate-700 dark:text-slate-300">
                                                            {msg.source}
                                                        </span>
                                                    )}
                                                    {msg.latency_ms > 0 && (
                                                        <span className="inline-flex items-center gap-0.5 font-mono text-slate-500">
                                                            <Clock className="w-2.5 h-2.5" /> {msg.latency_ms}ms
                                                        </span>
                                                    )}
                                                    {msg.guardrail_triggered && (
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[9px]">
                                                            <ShieldAlert className="w-2.5 h-2.5" /> {msg.guardrail_triggered}
                                                        </span>
                                                    )}
                                                    {msg.disclaimer_shown && (
                                                        <span className="text-amber-600 dark:text-amber-400 font-semibold text-[9px]">
                                                            ⚠️ Disclaimer
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            <span>
                                                {new Date(msg.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {isUser && (
                                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">
                            No hay mensajes registrados para esta sesión.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                    >
                        Cerrar Auditoría
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
