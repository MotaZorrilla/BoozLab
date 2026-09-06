import { Head, useForm } from '@inertiajs/react';
import {
    MessageSquare,
    Download,
    Search,
    Bot,
    Mail,
    MessageCircle,
    Eye,
} from 'lucide-react';
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
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(
        null,
    );

    const form = useForm({
        status: 'Pendiente',
        admin_notes: '',
    });

    const filteredMessages = useMemo(() => {
        return messages.filter((m) => {
            const matchesStatus =
                statusFilter === 'all' || m.status === statusFilter;
            const isLira = m.source === 'lira_chatbot' || m.type === 'lira';
            const matchesSource =
                sourceFilter === 'all' ||
                (sourceFilter === 'lira' && isLira) ||
                (sourceFilter === 'web' && !isLira);

            const matchesSearch =
                !searchQuery ||
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (m.phone &&
                    m.phone
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
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
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
                { title: 'Mensajes & Leads', href: '/admin/messages' },
            ]}
        >
            <Head title="Bandeja de Mensajes y Leads | Booz Laboratorio" />

            <div className="mx-auto max-w-7xl space-y-6 p-3 sm:p-6 lg:p-8 2xl:max-w-[1600px] 3xl:max-w-[1880px]">
                {/* Cabecera */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Bandeja de Mensajes & Leads Comerciales
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Contactos recibidos a través del formulario web
                                y transferidos por la asistente Lira AI.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/admin/messages/export-csv"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        <Download className="h-4 w-4" />
                        <span>Exportar a Excel / CSV</span>
                    </a>
                </div>

                {/* Filtros */}
                <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">
                                Todos los Estados ({messages.length})
                            </option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="En Gestión">En Gestión</option>
                            <option value="Contactado">Contactados</option>
                            <option value="Resuelto">Resueltos</option>
                        </select>

                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Todos los Canales</option>
                            <option value="lira">Asistente Lira AI</option>
                            <option value="web">Formulario Web</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar nombre, correo o texto..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Tabla de Mensajes */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Canal</th>
                                    <th className="px-4 py-3">Remitente</th>
                                    <th className="px-4 py-3">
                                        Teléfono / WhatsApp
                                    </th>
                                    <th className="px-4 py-3">
                                        Consulta / Mensaje
                                    </th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-center text-slate-400"
                                        >
                                            No hay mensajes o leads bajo estos
                                            criterios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((m) => {
                                        const isLira =
                                            m.source === 'lira_chatbot' ||
                                            m.type === 'lira';
                                        const waUrl = buildWhatsAppReplyUrl(m);

                                        return (
                                            <tr
                                                key={m.id}
                                                className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="px-4 py-3.5">
                                                    {isLira ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
                                                            <Bot className="h-3 w-3" />
                                                            <span>Lira AI</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            <Mail className="h-3 w-3" />
                                                            <span>Web</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                                    <div>{m.name}</div>
                                                    <div className="font-mono text-[10px] font-normal text-slate-400">
                                                        {m.email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                                                    {m.phone || 'No aportado'}
                                                </td>
                                                <td className="max-w-xs truncate px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                                    {m.message}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(m.status)}`}
                                                    >
                                                        {m.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                                                    {m.created_at
                                                        ? new Date(
                                                              m.created_at,
                                                          ).toLocaleDateString(
                                                              'es-VE',
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className="space-x-2 px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenReview(m)
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-cyan-400"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Gestionar</span>
                                                    </button>

                                                    {waUrl && (
                                                        <a
                                                            href={waUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
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
                    <Modal
                        isOpen={!!selectedMessage}
                        onClose={() => setSelectedMessage(null)}
                        title={`Gestión de Contacto: ${selectedMessage.name}`}
                    >
                        <form
                            onSubmit={handleStatusSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800">
                                <div>
                                    <strong>Remitente:</strong>{' '}
                                    {selectedMessage.name} (
                                    {selectedMessage.email})
                                </div>
                                <div>
                                    <strong>Teléfono:</strong>{' '}
                                    {selectedMessage.phone || 'No registrado'}
                                </div>
                                <div className="border-t border-slate-200 pt-1 dark:border-slate-700">
                                    <strong>Consulta / Requerimiento:</strong>
                                    <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Estado de Seguimiento
                                </label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) =>
                                        form.setData('status', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Gestión">
                                        En Gestión
                                    </option>
                                    <option value="Contactado">
                                        Contactado
                                    </option>
                                    <option value="Resuelto">Resuelto</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Notas Administrativas / Dictamen
                                </label>
                                <textarea
                                    rows={4}
                                    value={form.data.admin_notes}
                                    onChange={(e) =>
                                        form.setData(
                                            'admin_notes',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Anotaciones internas del equipo de ventas o atención al cliente..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                {buildWhatsAppReplyUrl(selectedMessage) ? (
                                    <a
                                        href={
                                            buildWhatsAppReplyUrl(
                                                selectedMessage,
                                            )!
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow transition-all hover:bg-emerald-700"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        <span>Abrir WhatsApp 1-Clic</span>
                                    </a>
                                ) : (
                                    <div />
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedMessage(null)}
                                        className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-800"
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
