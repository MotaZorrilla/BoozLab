import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Download, Printer, Search, Eye } from 'lucide-react';
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
    const [selectedReport, setSelectedReport] =
        useState<PharmacovigilanceReport | null>(null);

    const form = useForm({
        status: 'Pendiente',
        admin_notes: '',
    });

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchesStatus =
                statusFilter === 'all' || r.status === statusFilter;
            const matchesSeverity =
                severityFilter === 'all' || r.severity === severityFilter;
            const matchesSearch =
                !searchQuery ||
                r.ticket_number
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                r.product_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                r.reporter_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (r.batch_number &&
                    r.batch_number
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

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
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
                { title: 'Farmacovigilancia INH', href: '/admin/reports' },
            ]}
        >
            <Head title="Farmacovigilancia y Actas Sanitarias | Booz Laboratorio" />

            <div className="mx-auto max-w-7xl space-y-6 p-3 sm:p-6 lg:p-8 2xl:max-w-[1600px] 3xl:max-w-[1880px]">
                {/* Cabecera */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Farmacovigilancia Sanitaria INH "Rafael Rangel"
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de reportes de reacciones adversas,
                                trazabilidad de lotes y emisión de actas
                                oficiales.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/admin/reports/export-csv"
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
                                Todos los Estados ({reports.length})
                            </option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Resuelto">Resueltos</option>
                        </select>

                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Todas las Severidades</option>
                            <option value="Leve">Leve</option>
                            <option value="Moderada">Moderada</option>
                            <option value="Grave">Grave</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar ticket, producto o lote..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Tabla de Reportes */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Ticket INH</th>
                                    <th className="px-4 py-3">
                                        Fármaco & Lote
                                    </th>
                                    <th className="px-4 py-3">Severidad</th>
                                    <th className="px-4 py-3">Reportante</th>
                                    <th className="px-4 py-3">
                                        Estado Sanitario
                                    </th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-center text-slate-400"
                                        >
                                            No hay reportes de farmacovigilancia
                                            bajo estos criterios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((r) => (
                                        <tr
                                            key={r.id}
                                            className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                                                {r.ticket_number}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {r.product_name}
                                                </div>
                                                <div className="font-mono text-[10px] text-slate-400">
                                                    Lote:{' '}
                                                    {r.batch_number || 'N/D'} |
                                                    Vence:{' '}
                                                    {r.expiry_date || 'N/D'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getSeverityBadge(r.severity)}`}
                                                >
                                                    {r.severity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div>{r.reporter_name}</div>
                                                <div className="text-[10px] text-slate-400">
                                                    {r.reporter_type} (
                                                    {r.reporter_contact})
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(r.status)}`}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                                                {r.created_at
                                                    ? new Date(
                                                          r.created_at,
                                                      ).toLocaleDateString(
                                                          'es-VE',
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="space-x-2 px-4 py-3.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenReview(r)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-cyan-400"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Revisar</span>
                                                </button>
                                                <a
                                                    href={`/admin/reports/${r.id}/print`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
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
                    <Modal
                        isOpen={!!selectedReport}
                        onClose={() => setSelectedReport(null)}
                        title={`Dictamen Sanitario: ${selectedReport.ticket_number}`}
                    >
                        <form
                            onSubmit={handleStatusSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800">
                                <div>
                                    <strong>Fármaco:</strong>{' '}
                                    {selectedReport.product_name}
                                </div>
                                <div>
                                    <strong>Evento Adverso Reportado:</strong>{' '}
                                    {selectedReport.adverse_reaction}
                                </div>
                                <div>
                                    <strong>Reportante:</strong>{' '}
                                    {selectedReport.reporter_name} (
                                    {selectedReport.reporter_type} -{' '}
                                    {selectedReport.reporter_contact})
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Estado del Reporte
                                </label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) =>
                                        form.setData('status', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Revisión">
                                        En Revisión por Dirección Técnica
                                    </option>
                                    <option value="Resuelto">
                                        Resuelto y Notificado al INH
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Dictamen Clínico / Notas Administrativas
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
                                    placeholder="Detalles de la investigación, lote evaluado y medidas sanitarias adoptadas..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                <a
                                    href={`/admin/reports/${selectedReport.id}/print`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-cyan-400"
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>Ver Acta Oficial Imprimible</span>
                                </a>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedReport(null)}
                                        className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-800"
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
