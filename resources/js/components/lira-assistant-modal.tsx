import { Link } from '@inertiajs/react';
import {
    Send,
    Sparkles,
    ShieldAlert,
    ArrowRight,
    UserCheck,
    Phone,
    Mail,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/modal';

interface ChatMessage {
    id?: string;
    sender: 'user' | 'lira';
    text: string;
    suggestedProducts?: Array<{
        id: number;
        name: string;
        slug: string;
        presentation: string;
    }>;
    disclaimer?: string | null;
    isContactForm?: boolean;
    contactSubmitted?: boolean;
}

interface LiraAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LiraAssistantModal({
    isOpen,
    onClose,
}: LiraAssistantModalProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init-1',
            sender: 'lira',
            text: '¡Hola! 🐾 Soy <strong>Lira</strong>, la asistente virtual de <strong>Booz Laboratorio</strong>. Estoy aquí para orientarte sobre nuestro vademécum, principios activos y líneas terapéuticas.<br><br>Si necesitas <strong>comunicarte directamente con nuestro equipo administrativo o dirección técnica</strong> para pedidos al mayor, alianzas o consultas, indícalo o usa el botón directo y te asistiré de inmediato.',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Formulario de contacto dentro del chat
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState(
        'Solicito información comercial y contacto con el equipo administrativo de Booz Laboratorio.',
    );
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);
    const [contactSuccessId, setContactSuccessId] = useState<string | null>(
        null,
    );

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const getSessionUid = () => {
        try {
            let uid = sessionStorage.getItem('booz_lira_session_uid');
            if (!uid) {
                uid =
                    'ses_' +
                    Math.random().toString(36).substring(2, 11) +
                    '_' +
                    Date.now();
                sessionStorage.setItem('booz_lira_session_uid', uid);
            }
            return uid;
        } catch {
            return 'ses_anon_' + Date.now();
        }
    };

    const handleSend = async (queryText?: string) => {
        const textToSend = queryText || input;
        if (!textToSend.trim() || isLoading) return;

        const isContactIntent =
            /contactar|administra|hablar con el equipo|hablar con el administrador|dejar mensaje|comprar al mayor/i.test(
                textToSend,
            );

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: textToSend,
        };
        setMessages((prev) => [...prev, userMsg]);
        if (!queryText) setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    message: textToSend,
                    session_uid: getSessionUid(),
                    url_ref:
                        typeof window !== 'undefined'
                            ? window.location.pathname
                            : '/',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const liraMsg: ChatMessage = {
                    id: `lira-${Date.now()}`,
                    sender: 'lira',
                    text: data.reply,
                    suggestedProducts: data.suggestedProducts,
                    disclaimer: data.disclaimer,
                    isContactForm:
                        data.action === 'show_contact_form' || isContactIntent,
                };
                setMessages((prev) => [...prev, liraMsg]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `lira-err-${Date.now()}`,
                        sender: 'lira',
                        text: 'Disculpa, tuve un inconveniente conectando con el catálogo central. Por favor intenta de nuevo.',
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `lira-neterr-${Date.now()}`,
                    sender: 'lira',
                    text: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent, msgId?: string) => {
        e.preventDefault();
        if (!contactName.trim() || !contactEmail.trim() || isSubmittingContact)
            return;

        setIsSubmittingContact(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    type: 'lira',
                    source: 'lira_chatbot',
                    name: contactName,
                    phone: contactPhone || null,
                    email: contactEmail,
                    subject: 'Contacto solicitado vía Lira Asistente Virtual',
                    message: contactMessage,
                }),
            });

            if (res.ok) {
                if (msgId) {
                    setContactSuccessId(msgId);
                }
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `lira-ack-${Date.now()}`,
                        sender: 'lira',
                        text: `✅ <strong>¡Mensaje entregado con éxito a la administración de Booz Laboratorio!</strong><br><br>Gracias <strong>${contactName}</strong>, he emitido una notificación directa a la directiva y equipo comercial. Te contactarán prontamente por WhatsApp/teléfono o correo electrónico.<br><br>¿Puedo orientarte en alguna otra consulta de nuestros medicamentos o fórmulas?`,
                    },
                ]);
                setContactName('');
                setContactPhone('');
                setContactEmail('');
            } else {
                alert(
                    'No se pudo enviar el mensaje. Por favor verifica los datos e intenta nuevamente.',
                );
            }
        } catch {
            alert('Error de conexión al enviar el mensaje.');
        } finally {
            setIsSubmittingContact(false);
        }
    };

    const quickChips = [
        '💬 Contactar al Administrador',
        'Pie Diabético (Bactrocis)',
        'Fórmula de Bacumer',
        '4 Líneas de productos',
        'Farmacovigilancia INH',
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Lira | Asistente Virtual Booz Laboratorio"
        >
            <div className="-m-6 flex h-[78dvh] flex-col rounded-b-2xl bg-slate-900 p-4 sm:h-[580px] sm:p-6">
                {/* Lira Header Banner with Official 3D Mascot */}
                <div className="flex items-center gap-3.5 border-b border-slate-800 pb-3 sm:pb-4">
                    <div className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-cyan-300 bg-gradient-to-b from-white via-white to-blue-50 p-1 shadow-lg ring-2 shadow-cyan-500/20 ring-white/20 sm:h-14 sm:w-14">
                        <img
                            src="/assets/img/lira_avatar_animated.gif"
                            alt="Lira Asistente Virtual Oficial"
                            className="h-full w-full rounded-xl object-cover transition-transform group-hover:scale-105"
                        />
                        <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-500"></span>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="flex items-center gap-1.5 text-sm font-bold text-white sm:text-base">
                                Lira
                                <span className="text-xs font-normal text-cyan-400">
                                    🐾
                                </span>
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                                <Sparkles className="h-2.5 w-2.5" /> Asistente
                                Inteligente
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 sm:text-xs">
                            Booz Laboratorio VGME, C.A. • Orientación
                            Farmacéutica Oficial
                        </p>
                    </div>
                </div>

                {/* Messages Container */}
                <div
                    role="log"
                    aria-live="polite"
                    className="flex-1 space-y-3.5 overflow-y-auto py-3 pr-1 text-xs sm:text-sm"
                >
                    {/* Tarjeta de Bienvenida con Lira Oficial animada en cuerpo entero cuando el chat recién se abre */}
                    {messages.length === 1 && (
                        <div className="flex items-center gap-3.5 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-900 p-3.5 shadow-md sm:p-4">
                            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center sm:h-24 sm:w-24">
                                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/95 to-cyan-100/90 opacity-85 blur-md" />
                                <img
                                    src="/assets/img/lira_greeting_animated.gif"
                                    alt="Lira Mascota Oficial"
                                    className="relative z-10 h-full w-full object-contain drop-shadow-md transition-transform hover:scale-105"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
                                    Mascota & Asistente Oficial 3D
                                </span>
                                <p className="text-xs leading-relaxed text-slate-300">
                                    ¡Hola! Conoce nuestro vademécum clínico o
                                    conecta con nuestra dirección técnica y
                                    comercial.
                                </p>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`flex gap-2.5 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'lira' && (
                                <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border-2 border-cyan-300 bg-gradient-to-b from-white via-white to-blue-50 p-0.5 shadow-md ring-1 ring-white/30 sm:h-8 sm:w-8">
                                    <img
                                        src="/assets/img/lira_avatar_animated.gif"
                                        alt="Lira"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="max-w-[88%] space-y-2 sm:max-w-[85%]">
                                <div
                                    className={`rounded-2xl p-3 sm:p-3.5 ${
                                        msg.sender === 'user'
                                            ? 'rounded-tr-none bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                            : 'rounded-tl-none border border-slate-700/80 bg-slate-800 text-slate-200'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.text,
                                    }}
                                />

                                {/* Formulario de Contacto Embebido en Chat si el usuario solicita conectar con Administración */}
                                {msg.isContactForm && (
                                    <div className="space-y-3 rounded-2xl border border-blue-500/40 bg-slate-800/90 p-3.5 text-slate-200 shadow-lg sm:p-4">
                                        {contactSuccessId === msg.id ? (
                                            <div className="flex items-center gap-2 py-2 text-xs font-bold text-emerald-400">
                                                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                                <span>
                                                    ¡Mensaje transmitido a la
                                                    administración de Booz
                                                    Laboratorio!
                                                </span>
                                            </div>
                                        ) : (
                                            <form
                                                onSubmit={(e) =>
                                                    handleContactSubmit(
                                                        e,
                                                        msg.id,
                                                    )
                                                }
                                                className="space-y-2.5"
                                            >
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                                                    <UserCheck className="h-4 w-4 text-cyan-400" />
                                                    <span>
                                                        Formulario de Contacto
                                                        con Administración Booz
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    <div>
                                                        <label className="mb-0.5 block text-[10px] text-slate-400">
                                                            Nombre Completo *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={contactName}
                                                            onChange={(e) =>
                                                                setContactName(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Ej. Dr. Carlos Mendoza"
                                                            required
                                                            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-0.5 block text-[10px] text-slate-400">
                                                            Teléfono / WhatsApp
                                                        </label>
                                                        <div className="relative">
                                                            <Phone className="absolute top-2 left-2.5 h-3.5 w-3.5 text-slate-500" />
                                                            <input
                                                                type="text"
                                                                value={
                                                                    contactPhone
                                                                }
                                                                onChange={(e) =>
                                                                    setContactPhone(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="+58 414 0000000"
                                                                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-1.5 pr-2.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-0.5 block text-[10px] text-slate-400">
                                                        Correo Electrónico *
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute top-2 left-2.5 h-3.5 w-3.5 text-slate-500" />
                                                        <input
                                                            type="email"
                                                            value={contactEmail}
                                                            onChange={(e) =>
                                                                setContactEmail(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="correo@ejemplo.com"
                                                            required
                                                            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-1.5 pr-2.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-0.5 block text-[10px] text-slate-400">
                                                        Mensaje o Consulta para
                                                        Administración
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={contactMessage}
                                                        onChange={(e) =>
                                                            setContactMessage(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        placeholder="Motivo del contacto, pedido al mayor o consulta..."
                                                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={
                                                        isSubmittingContact ||
                                                        !contactName ||
                                                        !contactEmail
                                                    }
                                                    className="inline-flex min-h-[36px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:opacity-50"
                                                >
                                                    {isSubmittingContact ? (
                                                        <>
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            <span>
                                                                Enviando
                                                                notificación al
                                                                Administrador...
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="h-3.5 w-3.5" />
                                                            <span>
                                                                Enviar Mensaje
                                                                al Administrador
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {/* Suggested Products Cards */}
                                {msg.suggestedProducts &&
                                    msg.suggestedProducts.length > 0 && (
                                        <div className="mt-2 space-y-1.5 pl-1">
                                            <p className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                                                Productos en catálogo oficial:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.suggestedProducts.map(
                                                    (p) => (
                                                        <Link
                                                            key={p.id}
                                                            href={`/producto/${p.slug}`}
                                                            onClick={onClose}
                                                            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-xl border border-blue-500/30 bg-slate-800 px-3 py-1.5 text-xs text-blue-300 transition-colors hover:bg-blue-900/60"
                                                        >
                                                            <span>
                                                                {p.name}
                                                            </span>
                                                            <ArrowRight className="h-3 w-3" />
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Anti-Automedicación Disclaimer */}
                                {msg.disclaimer && (
                                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] leading-relaxed text-amber-300">
                                        <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                                        <span>{msg.disclaimer}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-3 text-xs text-slate-400 italic">
                            <div className="h-7 w-7 flex-shrink-0 animate-pulse overflow-hidden rounded-full border border-blue-400/50 bg-blue-950 sm:h-8 sm:w-8">
                                <img
                                    src="/assets/img/lira_head_avatar.png"
                                    alt="Lira"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <span className="animate-pulse">
                                Lira está consultando el vademécum de Booz
                                Laboratorio...
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Chips */}
                <div className="no-scrollbar flex gap-1.5 overflow-x-auto pt-2 pb-2">
                    {quickChips.map((chip, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(chip)}
                            className="min-h-[32px] flex-shrink-0 cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-blue-400/40 hover:bg-blue-900/50"
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
                        placeholder="Pregúntale a Lira sobre medicamentos o solicita contactar al equipo..."
                        className="w-full rounded-2xl border-slate-700 bg-slate-800/90 py-3 pr-12 pl-4 text-sm text-white placeholder-slate-400 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Enviar consulta a Lira"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
                <p className="pt-2 text-center text-[10px] font-medium text-slate-500">
                    🛡️ Orientación clínica de cortesía • Supervisión sanitaria
                    conforme a normativas del INH Rafael Rangel.
                </p>
            </div>
        </Modal>
    );
}
