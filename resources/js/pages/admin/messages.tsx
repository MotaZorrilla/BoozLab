import { Head, useForm } from '@inertiajs/react';
import { MessageSquare, Download, Search, Filter, Bot, Mail, Phone, MessageCircle, CheckCircle2, Clock, Eye, Send } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';
import type { Message } from '@/types';

interface MessagesPageProps {
    messages: Message[];
}

export default function AdminMessages({ messages }: MessagesPageProps) {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const form = useForm({
        status: 'Pendiente',
        admin_notes: '',
    });

    const filteredMessages = useMemo(() => {
        return messages.filter((m) => {
            const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
            const isLira = m.source === 'lira_chatbot' || m.type === 'lira';
            const matchesSource =
                sourceFilter === 'all' ||
                (sourceFilter === 'lira' && isLira) ||
                (sourceFilter === 'web' && !isLira);

            const matchesSearch =
                !searchQuery ||
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (m.phone && m.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
                m.message.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesSource && matchesSearch;
        });
    }, [messages, statusFilter, sourceFilter, searchQuery]);

    const handleOpenReview = (message: Message) => {
        setSelectedMessage(message);
        form.setData({
            status: message.status,
            admin_notes: message.admin_notes || '',
        });
    };

    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMessage) return;

        form.put(`/admin/messages/${selectedMessage.id}/status`, {
            onSuccess: () => setSelectedMessage(null),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Resuelto':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            case 'Contactado':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            case 'En Gestión':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            default:
                return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse';
        }
    };

    const buildWhatsAppReplyUrl = (msg: Message) => {
        if (!msg.phone) return null;
        const clean = msg.phone.replace(/\D/g, '');
        const text = `Hola ${msg.name}, te contactamos desde la Dirección Administrativa de Booz Laboratorio respecto a tu mensaje: "${msg.message.substring(0, 80)}..."`;
        return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Mensajes & Leads', href: '/admin/messages' }]}>
            <Head title="Bandeja de Mensajes y Leads | Booz Laboratorio" />

            <div className="p-3 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1880px] mx-auto space-y-6">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Bandeja de Mensajes & Leads Comerciales
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Contactos recibidos a través del formulario web y transferidos por la asistente Lira AI.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/admin/messages/export-csv"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow cursor-pointer transition-all"
                    >
                        <Download className="h-4 w-4" />
                        <span>Exportar a Excel / CSV</span>
                    </a>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 outline-none"
                        >
                            <option value="all">Todos los Estados ({messages.length})</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="En Gestión">En Gestión</option>
                            <option value="Contactado">Contactados</option>
                            <option value="Resuelto">Resueltos</option>
                        </select>

                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 outline-none"
                        >
                            <option value="all">Todos los Canales</option>
                            <option value="lira">Asistente Lira AI</option>
                            <option value="web">Formulario Web</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar nombre, correo o texto..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                </div>

                {/* Tabla de Mensajes */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">Canal</th>
                                    <th className="py-3 px-4">Remitente</th>
                                    <th className="py-3 px-4">Teléfono / WhatsApp</th>
                                    <th className="py-3 px-4">Consulta / Mensaje</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
                                            No hay mensajes o leads bajo estos criterios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((m) => {
                                        const isLira = m.source === 'lira_chatbot' || m.type === 'lira';
                                        const waUrl = buildWhatsAppReplyUrl(m);

                                        return (
                                            <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    {isLira ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">
                                                            <Bot className="h-3 w-3" />
                                                            <span>Lira AI</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                            <Mail className="h-3 w-3" />
                                                            <span>Web</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                                    <div>{m.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono font-normal">{m.email}</div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                                                    {m.phone || 'No aportado'}
                                                </td>
                                                <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                                                    {m.message}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(m.status)}`}>
                                                        {m.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                                                    {new Date(m.created_at).toLocaleDateString('es-VE')}
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenReview(m)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Gestionar</span>
                                                    </button>

                                                    {waUrl && (
                                                        <a
                                                            href={waUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                                                            title="Responder directamente por WhatsApp"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL DE GESTIÓN Y NOTAS DE SEGUIMIENTO */}
                {selectedMessage && (
                    <Modal isOpen={!!selectedMessage} onClose={() => setSelectedMessage(null)} title={`Gestión de Contacto: ${selectedMessage.name}`}>
                        <form onSubmit={handleStatusSubmit} className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
                                <div><strong>Remitente:</strong> {selectedMessage.name} ({selectedMessage.email})</div>
                                <div><strong>Teléfono:</strong> {selectedMessage.phone || 'No registrado'}</div>
                                <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
                                    <strong>Consulta / Requerimiento:</strong>
                                    <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Estado de Seguimiento</label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Gestión">En Gestión</option>
                                    <option value="Contactado">Contactado</option>
                                    <option value="Resuelto">Resuelto</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Notas Administrativas / Dictamen</label>
                                <textarea
                                    rows={4}
                                    value={form.data.admin_notes}
                                    onChange={(e) => form.setData('admin_notes', e.target.value)}
                                    placeholder="Anotaciones internas del equipo de ventas o atención al cliente..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                {buildWhatsAppReplyUrl(selectedMessage) ? (
                                    <a
                                        href={buildWhatsAppReplyUrl(selectedMessage)!}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        <span>Abrir WhatsApp 1-Clic</span>
                                    </a>
                                ) : <div />}

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedMessage(null)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="px-5 py-2 rounded-xl bg-[#002072] text-white text-xs font-bold shadow hover:bg-blue-800"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </AppLayout>
    );
}
