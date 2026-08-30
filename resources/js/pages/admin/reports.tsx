import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Download, Printer, Search, Filter, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';
import type { PharmacovigilanceReport } from '@/types';

interface ReportsPageProps {
    reports: PharmacovigilanceReport[];
}

export default function AdminReports({ reports }: ReportsPageProps) {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<PharmacovigilanceReport | null>(null);

    const form = useForm({
        status: 'Pendiente',
        admin_notes: '',
    });

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
            const matchesSearch =
                !searchQuery ||
                r.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (r.batch_number && r.batch_number.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesStatus && matchesSeverity && matchesSearch;
        });
    }, [reports, statusFilter, severityFilter, searchQuery]);

    const handleOpenReview = (report: PharmacovigilanceReport) => {
        setSelectedReport(report);
        form.setData({
            status: report.status,
            admin_notes: report.admin_notes || '',
        });
    };

    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReport) return;

        form.put(`/admin/reports/${selectedReport.id}/status`, {
            onSuccess: () => setSelectedReport(null),
        });
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'Grave':
                return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200';
            case 'Moderada':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
            default:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Resuelto':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            case 'En Revisión':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            default:
                return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Farmacovigilancia INH', href: '/admin/reports' }]}>
            <Head title="Farmacovigilancia y Actas Sanitarias | Booz Laboratorio" />

            <div className="p-3 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1880px] mx-auto space-y-6">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Farmacovigilancia Sanitaria INH "Rafael Rangel"
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de reportes de reacciones adversas, trazabilidad de lotes y emisión de actas oficiales.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/admin/reports/export-csv"
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
                            <option value="all">Todos los Estados ({reports.length})</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Resuelto">Resueltos</option>
                        </select>

                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 outline-none"
                        >
                            <option value="all">Todas las Severidades</option>
                            <option value="Leve">Leve</option>
                            <option value="Moderada">Moderada</option>
                            <option value="Grave">Grave</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar ticket, producto o lote..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {/* Tabla de Reportes */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">Ticket INH</th>
                                    <th className="py-3 px-4">Fármaco & Lote</th>
                                    <th className="py-3 px-4">Severidad</th>
                                    <th className="py-3 px-4">Reportante</th>
                                    <th className="py-3 px-4">Estado Sanitario</th>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
                                            No hay reportes de farmacovigilancia bajo estos criterios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                {r.ticket_number}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{r.product_name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">
                                                    Lote: {r.batch_number || 'N/D'} | Vence: {r.expiry_date || 'N/D'}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(r.severity)}`}>
                                                    {r.severity}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div>{r.reporter_name}</div>
                                                <div className="text-[10px] text-slate-400">{r.reporter_type} ({r.reporter_contact})</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(r.status)}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                                                {new Date(r.created_at).toLocaleDateString('es-VE')}
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenReview(r)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Revisar</span>
                                                </button>
                                                <a
                                                    href={`/admin/reports/${r.id}/print`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                    title="Imprimir Acta INH"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL DE REVISIÓN Y DICTAMEN TÉCNICO */}
                {selectedReport && (
                    <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title={`Dictamen Sanitario: ${selectedReport.ticket_number}`}>
                        <form onSubmit={handleStatusSubmit} className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
                                <div><strong>Fármaco:</strong> {selectedReport.product_name}</div>
                                <div><strong>Evento Adverso Reportado:</strong> {selectedReport.adverse_reaction}</div>
                                <div><strong>Reportante:</strong> {selectedReport.reporter_name} ({selectedReport.reporter_type} - {selectedReport.reporter_contact})</div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Estado del Reporte</label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Revisión">En Revisión por Dirección Técnica</option>
                                    <option value="Resuelto">Resuelto y Notificado al INH</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Dictamen Clínico / Notas Administrativas</label>
                                <textarea
                                    rows={4}
                                    value={form.data.admin_notes}
                                    onChange={(e) => form.setData('admin_notes', e.target.value)}
                                    placeholder="Detalles de la investigación, lote evaluado y medidas sanitarias adoptadas..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                <a
                                    href={`/admin/reports/${selectedReport.id}/print`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline"
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>Ver Acta Oficial Imprimible</span>
                                </a>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedReport(null)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="px-5 py-2 rounded-xl bg-[#002072] text-white text-xs font-bold shadow hover:bg-blue-800"
                                    >
                                        Guardar Dictamen
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
