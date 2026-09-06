import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    Search,
    Download,
    Eye,
    ShieldAlert,
    Cpu,
    CheckCircle2,
    RefreshCw,
    ArrowRight,
    ShoppingBag,
    Globe,
} from 'lucide-react';
import React, { useState } from 'react';
import { FunnelView } from '@/components/admin/analytics/funnel-view';
import { TrendChart } from '@/components/admin/analytics/trend-chart';
import AppLayout from '@/layouts/app-layout';

interface KPIProps {
    total_sessions: number;
    today_sessions: number;
    total_messages: number;
    avg_latency_ms: number;
    gemini_calls_count: number;
    deterministic_calls_count: number;
    guardrails_triggered_count: number;
    conversion_rate: number;
    converted_sessions: number;
    whatsapp_clicks_total?: number;
    whatsapp_clicks_today?: number;
    lira_bounces_count?: number;
    lira_deep_count?: number;
    total_web_messages?: number;
    total_quotes?: number;
    total_page_views?: number;
    today_page_views?: number;
    total_unique_visitors?: number;
    today_unique_visitors?: number;
    catalog_views?: number;
}

interface ChartPoint {
    date: string;
    label: string;
    sessions: number;
    gemini: number;
    deterministic: number;
    whatsapp?: number;
    views?: number;
    uniques?: number;
}

interface TopProduct {
    id: number;
    name: string;
    presentation: string;
    count: number;
}

interface TopPage {
    url_path: string;
    section: string;
    total_views: number;
    total_uniques: number;
}

interface GuardrailStat {
    name: string;
    count: number;
}

interface ChatSessionItem {
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
    messages_count: number;
}

interface SectionStat {
    section: string;
    views: number;
    uniques: number;
}

interface EntryPathStat {
    path: string;
    count: number;
}

interface DeviceStat {
    device_type: string;
    count: number;
}

interface BrowserStat {
    browser: string;
    count: number;
}

interface OsStat {
    os: string;
    count: number;
}

interface AnalyticsProps {
    kpis: KPIProps & {
        period_sessions?: number;
        period_page_views?: number;
        period_unique_visitors?: number;
        period_catalog_views?: number;
        whatsapp_clicks_period?: number;
    };
    chartData: ChartPoint[];
    topPages?: TopPage[];
    topProducts: TopProduct[];
    guardrailStats: GuardrailStat[];
    sectionsBreakdown?: SectionStat[];
    topEntryPaths?: EntryPathStat[];
    devicesBreakdown?: DeviceStat[];
    browsersBreakdown?: BrowserStat[];
    osBreakdown?: OsStat[];
    currentPeriod?: string;
    sessions: {
        data: ChatSessionItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        period?: string;
        search: string;
        source: string;
        from: string;
        to: string;
    };
}

export default function Analytics({
    kpis,
    chartData,
    topPages = [],
    topProducts,
    guardrailStats,
    sectionsBreakdown = [],
    topEntryPaths = [],
    devicesBreakdown = [],
    browsersBreakdown = [],
    currentPeriod = '7d',
    sessions,
    filters,
}: AnalyticsProps) {
    const [activeTab, setActiveTab] = useState<
        'health' | 'conversations' | 'funnel' | 'traffic'
    >('health');
    const [selectedPeriod, setSelectedPeriod] = useState(
        filters.period || currentPeriod,
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sourceFilter, setSourceFilter] = useState(filters.source || 'all');
    const [fromDate, setFromDate] = useState(filters.from || '');
    const [toDate, setToDate] = useState(filters.to || '');

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        router.get(
            '/admin/analytics',
            {
                period: newPeriod,
                search: searchTerm || undefined,
                source: sourceFilter !== 'all' ? sourceFilter : undefined,
                from: fromDate || undefined,
                to: toDate || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleApplyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/analytics',
            {
                period: selectedPeriod,
                search: searchTerm,
                source: sourceFilter !== 'all' ? sourceFilter : undefined,
                from: fromDate || undefined,
                to: toDate || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSourceFilter('all');
        setFromDate('');
        setToDate('');
        router.get(
            '/admin/analytics',
            {},
            { preserveState: true, replace: true },
        );
    };

    const handleOpenSession = async (session: ChatSessionItem) => {
        setLoadingTranscript(true);
        try {
            const res = await fetch(
                `/admin/analytics/conversations/${session.id}`,
            );
            const data = await res.json();
            if (data.success) {
                setSelectedSession(data.session);
            }
        } catch (err) {
            console.error('Error cargando transcripción:', err);
        } finally {
            setLoadingTranscript(false);
        }
    };

    const breadcrumbs = [
        { title: 'Consola Principal', href: '/dashboard' },
        { title: 'Telemetría Lira AI', href: '/admin/analytics' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Telemetría & Mirador Lira AI" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 2xl:max-w-[1536px] 3xl:max-w-[1840px]">
                {/* Cabecera Principal */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center dark:border-slate-800 dark:bg-[#0D172E]">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-xl bg-blue-600/10 p-2 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <Activity className="h-6 w-6" />
                            </div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Telemetría & Mirador Clínico de Lira AI
                            </h1>
                            <span className="hidden items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 sm:inline-flex dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                En Producción
                            </span>
                        </div>
                        <p className="mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            Auditoría de orientaciones farmacéuticas, tiempos de
                            respuesta de Gemini AI, guardrails clínicos y embudo
                            comercial hacia pedidos.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/admin/analytics/export-csv"
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Download className="h-4 w-4" />
                            Exportar CSV
                        </a>
                        <button
                            type="button"
                            onClick={() => router.reload()}
                            className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/60"
                            title="Recargar métricas"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Métricas de Tráfico del Servidor (Zero-Latency) */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-4 shadow-sm dark:border-blue-900/50 dark:from-blue-950/30 dark:to-slate-900/40">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-[#002072] uppercase dark:text-cyan-300">
                                Páginas Vistas
                            </span>
                            <Globe className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                        </div>
                        <div className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                            {kpis.total_page_views || 0}
                        </div>
                        <span className="text-[10px] font-medium text-blue-700 dark:text-cyan-300">
                            +{kpis.today_page_views || 0} servidas hoy
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Visitantes Únicos
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                            {kpis.total_unique_visitors || 0}
                        </div>
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            +{kpis.today_unique_visitors || 0} únicos hoy
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Fichas de Fármacos
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-[#002072] dark:text-cyan-400">
                            {kpis.catalog_views || 0}
                        </div>
                        <span className="block text-[10px] text-slate-400">
                            Vistas de catálogo y vademécum
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Ratio Catálogo / Visitas
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-blue-600 dark:text-blue-400">
                            {kpis.total_page_views
                                ? Math.round(
                                      ((kpis.catalog_views || 0) /
                                          kpis.total_page_views) *
                                          100,
                                  )
                                : 0}
                            %
                        </div>
                        <span className="block text-[10px] text-slate-400">
                            Interés en productos
                        </span>
                    </div>
                </div>

                {/* Cuadrícula de KPIs Rápidos Multi-Canal */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                    {/* 1. Lira AI Sesiones */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Sesiones Lira AI
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                            {kpis.total_sessions}
                        </div>
                        <span className="block truncate text-[10px] font-medium text-blue-600 dark:text-cyan-400">
                            {kpis.lira_deep_count || 0} profundas /{' '}
                            {kpis.lira_bounces_count || 0} breves
                        </span>
                    </div>

                    {/* 2. Clics WhatsApp */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Clics WhatsApp
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {kpis.whatsapp_clicks_total || 0}
                        </div>
                        <span className="block text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                            +{kpis.whatsapp_clicks_today || 0} intención hoy
                        </span>
                    </div>

                    {/* 3. Cotizaciones Formales */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Cotizaciones BD
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-blue-700 dark:text-cyan-400">
                            {kpis.total_quotes || kpis.converted_sessions}
                        </div>
                        <span className="block text-[10px] text-blue-700 dark:text-cyan-300">
                            Bolsa de pedidos formal
                        </span>
                    </div>

                    {/* 4. Mensajes Web */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Mensajes Web
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                            {kpis.total_web_messages || 0}
                        </div>
                        <span className="block text-[10px] text-slate-400">
                            Formularios de contacto
                        </span>
                    </div>

                    {/* 5. Latencia Promedio */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Latencia Lira
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                            {kpis.avg_latency_ms}{' '}
                            <span className="text-xs font-normal text-slate-400">
                                ms
                            </span>
                        </div>
                        <span className="block truncate text-[10px] text-slate-400">
                            {kpis.gemini_calls_count} Gemini /{' '}
                            {kpis.deterministic_calls_count} Local
                        </span>
                    </div>

                    {/* 6. Tasa de Conversión */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Tasa Conversión
                        </span>
                        <div className="mt-1 font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {kpis.conversion_rate}%
                        </div>
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                            Cierre comercial global
                        </span>
                    </div>
                </div>

                {/* Selector de Pestañas */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-1 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('health')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'health'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        Salud & Tendencias
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('traffic')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'traffic'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        Tráfico, Secciones & Dispositivos
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('conversations')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'conversations'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        Mirador de Conversaciones ({sessions.total})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('funnel')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'funnel'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        Embudo Comercial
                    </button>
                </div>

                {/* CONTENIDO PESTAÑA 1: SALUD Y TENDENCIAS */}
                {activeTab === 'health' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Gráfica de Tendencia (2 columnas) */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-[#0D172E]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Curva de Consultas, Tráfico y Fuentes
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Páginas vistas, sesiones Lira, Gemini AI
                                        y WhatsApp en el periodo seleccionado.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-mono text-[10px] text-slate-400">
                                        Periodo Activo
                                    </span>
                                    <span className="font-mono text-xs font-bold text-blue-600 uppercase dark:text-cyan-400">
                                        {selectedPeriod}
                                    </span>
                                </div>
                            </div>
                            <TrendChart
                                data={chartData}
                                currentPeriod={selectedPeriod}
                                onPeriodChange={handlePeriodChange}
                            />
                        </div>

                        {/* Top Productos Consultados */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                                    Fármacos más Recomendados
                                </h3>
                                <span className="font-mono text-[10px] text-slate-400">
                                    Top 5
                                </span>
                            </div>

                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <span className="block font-bold text-slate-800 dark:text-slate-200">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {p.presentation}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="rounded bg-blue-50 px-2 py-0.5 font-mono font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                                {p.count} veces
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center text-xs text-slate-400">
                                    Aún no hay recomendaciones farmacológicas
                                    registradas.
                                </div>
                            )}

                            {/* Guardrails Sanitarios */}
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                                <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                                    Guardrails Sanitarios Disparados
                                </h4>
                                {guardrailStats.length > 0 ? (
                                    <div className="space-y-2">
                                        {guardrailStats.map((g, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between text-[11px]"
                                            >
                                                <span className="max-w-[200px] truncate text-slate-600 dark:text-slate-400">
                                                    {g.name}
                                                </span>
                                                <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                                    {g.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="block text-[11px] text-slate-400">
                                        No se han registrado contenciones
                                        clínicas críticas.
                                    </span>
                                )}
                            </div>

                            {/* Top Páginas Más Visitadas (Servidor) */}
                            {topPages && topPages.length > 0 && (
                                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <Globe className="h-3.5 w-3.5 text-purple-500" />
                                        Páginas Más Visitadas (Servidor)
                                    </h4>
                                    <div className="space-y-2">
                                        {topPages.map((pg, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between text-[11px]"
                                            >
                                                <span
                                                    className="max-w-[200px] truncate font-mono text-slate-600 dark:text-slate-400"
                                                    title={pg.url_path}
                                                >
                                                    {pg.url_path === '/'
                                                        ? '/ (Inicio)'
                                                        : pg.url_path}
                                                </span>
                                                <span className="rounded bg-purple-50 px-1.5 py-0.5 font-mono font-bold text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                                                    {pg.total_views} vistas
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CONTENIDO PESTAÑA: TRÁFICO, SECCIONES & DISPOSITIVOS */}
                {activeTab === 'traffic' && (
                    <div className="space-y-6">
                        {/* Resumen de Tráfico del Periodo Seleccionado vs Histórico */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <span className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Vistas en Periodo (
                                    {selectedPeriod.toUpperCase()})
                                </span>
                                <div className="mt-2 font-mono text-3xl font-black text-[#002072] dark:text-cyan-400">
                                    {kpis.period_page_views ||
                                        kpis.today_page_views ||
                                        0}
                                </div>
                                <span className="mt-1 block text-[11px] text-slate-400">
                                    De {kpis.total_page_views || 0} acumuladas
                                    en histórico
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <span className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Visitantes Únicos (
                                    {selectedPeriod.toUpperCase()})
                                </span>
                                <div className="mt-2 font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {kpis.period_unique_visitors ||
                                        kpis.today_unique_visitors ||
                                        0}
                                </div>
                                <span className="mt-1 block text-[11px] text-slate-400">
                                    De {kpis.total_unique_visitors || 0}{' '}
                                    personas únicas registradas
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <span className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Vistas Fichas Fármacos
                                </span>
                                <div className="mt-2 font-mono text-3xl font-black text-blue-700 dark:text-cyan-400">
                                    {kpis.period_catalog_views ||
                                        kpis.catalog_views ||
                                        0}
                                </div>
                                <span className="mt-1 block text-[11px] text-slate-400">
                                    Interés específico en vademécum
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <span className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Interacción WhatsApp
                                </span>
                                <div className="mt-2 font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {kpis.whatsapp_clicks_period ||
                                        kpis.whatsapp_clicks_today ||
                                        0}
                                </div>
                                <span className="mt-1 block text-[11px] text-slate-400">
                                    Clics de intención en este periodo
                                </span>
                            </div>
                        </div>

                        {/* Grid de 3 Columnas: Secciones del Sitio, Navegadores/Dispositivos, y Rutas de Entrada */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Columna 1: Distribución por Secciones */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                        <Globe className="h-4 w-4 text-blue-600" />
                                        Secciones Más Navegadas
                                    </h3>
                                    <span className="font-mono text-[10px] text-slate-400">
                                        Tráfico
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {sectionsBreakdown.length > 0 ? (
                                        sectionsBreakdown.map((sec, idx) => {
                                            const secNames: Record<
                                                string,
                                                string
                                            > = {
                                                home: 'Inicio (Landing Page)',
                                                product:
                                                    'Fichas de Medicamentos',
                                                vademecum: 'Vademécum Oficial',
                                                farmacovigilancia:
                                                    'Canal Farmacovigilancia',
                                                tools: 'Herramientas Clínicas',
                                                glossary:
                                                    'Glosario Farmacéutico',
                                                cases: 'Casos Clínicos',
                                                other: 'Otras Rutas',
                                            };
                                            const totalSecViews =
                                                sectionsBreakdown.reduce(
                                                    (a, b) =>
                                                        a + Number(b.views),
                                                    0,
                                                ) || 1;
                                            const pct = Math.round(
                                                (Number(sec.views) /
                                                    totalSecViews) *
                                                    100,
                                            );

                                            return (
                                                <div
                                                    key={idx}
                                                    className="space-y-1"
                                                >
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {secNames[
                                                                sec.section
                                                            ] || sec.section}
                                                        </span>
                                                        <span className="font-mono font-medium text-slate-500">
                                                            {sec.views} vistas (
                                                            {pct}%)
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
                                                            style={{
                                                                width: `${pct}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-slate-400">
                                            Sin datos registrados aún.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Columna 2: Dispositivos y Navegadores */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <Cpu className="h-4 w-4 text-cyan-600" />
                                    Entorno Tecnológico
                                </h3>

                                <div className="space-y-3">
                                    <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Dispositivos
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {devicesBreakdown.map((dev, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center dark:border-slate-700/60 dark:bg-slate-800/60"
                                            >
                                                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                                    {dev.device_type}
                                                </span>
                                                <span className="font-mono text-sm font-black text-blue-600 dark:text-cyan-400">
                                                    {dev.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                                        <span className="mb-2 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                            Navegadores
                                        </span>
                                        <div className="space-y-1.5">
                                            {browsersBreakdown.map(
                                                (br, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between text-xs"
                                                    >
                                                        <span className="font-medium text-slate-600 dark:text-slate-400">
                                                            {br.browser}
                                                        </span>
                                                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-900 dark:bg-slate-800 dark:text-white">
                                                            {br.count}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna 3: Top Rutas de Aterrizaje / Entrada */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                                    Páginas de Entrada (Landing)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Primera URL que impacta el visitante al
                                    iniciar su sesión de navegación.
                                </p>

                                <div className="space-y-2.5">
                                    {topEntryPaths.length > 0 ? (
                                        topEntryPaths.map((entry, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs dark:border-slate-700/60 dark:bg-slate-800/50"
                                            >
                                                <div className="flex max-w-[210px] items-center gap-2 truncate">
                                                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-[10px] font-bold text-blue-600">
                                                        {idx + 1}
                                                    </span>
                                                    <span
                                                        className="truncate font-mono text-slate-700 dark:text-slate-300"
                                                        title={entry.path}
                                                    >
                                                        {entry.path === '/'
                                                            ? '/ (Página Inicio)'
                                                            : entry.path}
                                                    </span>
                                                </div>
                                                <span className="flex-shrink-0 rounded bg-emerald-50 px-2 py-0.5 font-mono font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                    {entry.count}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400">
                                            Registrando primeras visitas...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENIDO PESTAÑA 2: MIRADOR DE CONVERSACIONES */}
                {activeTab === 'conversations' && (
                    <div className="space-y-4">
                        {/* Barra de Filtros */}
                        <form
                            onSubmit={handleApplyFilters}
                            className="flex flex-col flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-[#0D172E]"
                        >
                            <div className="relative w-full min-w-[220px] flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar en preguntas o ID de sesión..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <select
                                value={sourceFilter}
                                onChange={(e) =>
                                    setSourceFilter(e.target.value)
                                }
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="all">Todas las Fuentes</option>
                                <option value="gemini_api">Gemini AI</option>
                                <option value="deterministic_product_match">
                                    Coincidencia de Fármaco
                                </option>
                                <option value="deterministic_pharmacovigilance">
                                    Farmacovigilancia
                                </option>
                                <option value="deterministic_quote">
                                    Cotización / Precios
                                </option>
                                <option value="deterministic_contact">
                                    Contacto Administración
                                </option>
                            </select>

                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(e.target.value)
                                    }
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                                <span className="text-xs text-slate-400">
                                    a
                                </span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                                >
                                    Filtrar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </form>

                        {/* Vista Móvil de Tarjetas Táctiles */}
                        <div className="block space-y-3 md:hidden">
                            {sessions.data.map((s) => (
                                <div
                                    key={s.id}
                                    className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="max-w-[180px] truncate font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                            {s.session_uid}
                                        </span>
                                        {s.converted_to_order ? (
                                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                Pedido
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                Consulta
                                            </span>
                                        )}
                                    </div>

                                    <p className="line-clamp-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                                        "
                                        {s.first_query ||
                                            'Consulta vacía o bienvenida'}
                                        "
                                    </p>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-[11px] text-slate-400 dark:border-slate-800/60">
                                        <span>
                                            {s.turn_count} turnos •{' '}
                                            {s.total_latency_ms}ms
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenSession(s)}
                                            className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400"
                                        >
                                            <Eye className="h-3.5 w-3.5" /> Ver
                                            Diálogo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vista Tabular en Escritorio */}
                        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-[#0D172E]">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                    <tr>
                                        <th className="p-3.5">ID Sesión</th>
                                        <th className="p-3.5">Inicio</th>
                                        <th className="p-3.5">Turnos</th>
                                        <th className="p-3.5">Latencia</th>
                                        <th className="p-3.5">Fuente</th>
                                        <th className="p-3.5">
                                            Primera Consulta
                                        </th>
                                        <th className="p-3.5">Pedido</th>
                                        <th className="p-3.5 text-right">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {sessions.data.length > 0 ? (
                                        sessions.data.map((s) => (
                                            <tr
                                                key={s.id}
                                                className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                                            >
                                                <td className="p-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                                    {s.session_uid.substring(
                                                        0,
                                                        16,
                                                    )}
                                                    ...
                                                </td>
                                                <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                                                    {s.started_at
                                                        ? new Date(
                                                              s.started_at,
                                                          ).toLocaleDateString(
                                                              'es-VE',
                                                          )
                                                        : 'N/A'}
                                                </td>
                                                <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {s.turn_count}
                                                </td>
                                                <td className="p-3.5 font-mono text-slate-500">
                                                    {s.total_latency_ms} ms
                                                </td>
                                                <td className="p-3.5">
                                                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {s.last_source || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="max-w-xs truncate p-3.5 font-medium text-slate-800 dark:text-slate-200">
                                                    {s.first_query || '—'}
                                                </td>
                                                <td className="p-3.5">
                                                    {s.converted_to_order ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                            <CheckCircle2 className="h-3 w-3" />{' '}
                                                            Sí
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400">
                                                            No
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenSession(s)
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/60"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />{' '}
                                                        Ver Diálogo
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="py-12 text-center text-xs text-slate-400"
                                            >
                                                No se encontraron sesiones
                                                registradas con los filtros
                                                actuales.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {sessions.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1 pt-2">
                                {sessions.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-blue-600 font-bold text-white'
                                                : link.url
                                                  ? 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                                                  : 'pointer-events-none text-slate-400'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CONTENIDO PESTAÑA 3: EMBUDO COMERCIAL */}
                {activeTab === 'funnel' && (
                    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                        <FunnelView
                            totalSessions={kpis.total_sessions}
                            totalMessages={kpis.total_messages}
                            topProductsCount={topProducts.reduce(
                                (acc, p) => acc + p.count,
                                0,
                            )}
                            convertedSessions={kpis.converted_sessions}
                            conversionRate={kpis.conversion_rate}
                            whatsappClicks={kpis.whatsapp_clicks_total || 0}
                            totalQuotes={
                                kpis.total_quotes || kpis.converted_sessions
                            }
                            totalPageViews={kpis.total_page_views || 0}
                            catalogViews={kpis.catalog_views || 0}
                        />
                    </div>
                )}
            </div>

            {/* Modal de Transcripción Turno a Turno */}
            <ConversationTranscriptModal
                session={selectedSession}
                open={!!selectedSession}
                onClose={() => setSelectedSession(null)}
            />
        </AppLayout>
    );
}
