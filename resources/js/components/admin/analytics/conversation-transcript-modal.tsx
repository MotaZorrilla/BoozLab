import { Bot, User, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

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

export function ConversationTranscriptModal({
    session,
    open,
    onClose,
}: TranscriptModalProps) {
    if (!session) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col overflow-hidden border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-[#0D172E]">
                <DialogHeader className="border-b border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                    Auditoría de Conversación Lira AI
                                    {session.converted_to_order && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            <CheckCircle2 className="h-3 w-3" />{' '}
                                            Pedido Generado
                                        </span>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                    UID: {session.session_uid} •{' '}
                                    {session.turn_count} turnos •{' '}
                                    {session.total_latency_ms} ms acumulados
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    {/* Barra de metadatos de sesión */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Origen: {session.url_ref || '/'}
                        </span>
                        {session.action && (
                            <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 font-mono text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                Acción: {session.action}
                            </span>
                        )}
                        {session.started_at && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                Iniciada:{' '}
                                {new Date(session.started_at).toLocaleString(
                                    'es-VE',
                                )}
                            </span>
                        )}
                    </div>
                </DialogHeader>

                {/* Lista de mensajes tipo chat */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-5 dark:bg-[#070C18]/60">
                    {session.messages && session.messages.length > 0 ? (
                        session.messages.map((msg) => {
                            const isUser = msg.role === 'user';

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    {!isUser && (
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                    )}

                                    <div className={`max-w-[82%] space-y-1.5`}>
                                        <div
                                            className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm sm:text-sm ${
                                                isUser
                                                    ? 'rounded-br-none bg-blue-600 text-white'
                                                    : 'rounded-bl-none border border-slate-200/80 bg-white text-slate-800 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100'
                                            }`}
                                        >
                                            {/* Renderizado de texto con soporte HTML seguro */}
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: msg.content,
                                                }}
                                                className="space-y-1 break-words"
                                            />
                                        </div>

                                        {/* Insignias y metadatos técnicos del mensaje */}
                                        <div
                                            className={`flex flex-wrap items-center gap-1.5 text-[10px] ${isUser ? 'justify-end text-slate-400' : 'justify-start text-slate-500'}`}
                                        >
                                            {!isUser && (
                                                <>
                                                    {msg.source && (
                                                        <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[9px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                            {msg.source}
                                                        </span>
                                                    )}
                                                    {msg.latency_ms > 0 && (
                                                        <span className="inline-flex items-center gap-0.5 font-mono text-slate-500">
                                                            <Clock className="h-2.5 w-2.5" />{' '}
                                                            {msg.latency_ms}ms
                                                        </span>
                                                    )}
                                                    {msg.guardrail_triggered && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                            <ShieldAlert className="h-2.5 w-2.5" />{' '}
                                                            {
                                                                msg.guardrail_triggered
                                                            }
                                                        </span>
                                                    )}
                                                    {msg.disclaimer_shown && (
                                                        <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                                                            ⚠️ Disclaimer
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            <span>
                                                {new Date(
                                                    msg.created_at,
                                                ).toLocaleTimeString('es-VE', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {isUser && (
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                            <User className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-10 text-center text-xs text-slate-400">
                            No hay mensajes registrados para esta sesión.
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        Cerrar Auditoría
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
