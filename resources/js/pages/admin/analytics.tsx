import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    Bot,
    Search,
    Filter,
    Download,
    Eye,
    Clock,
    ShieldAlert,
    Cpu,
    Sparkles,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    RefreshCw,
    Calendar,
    ArrowRight,
    ShoppingBag,
    HelpCircle,
    Globe,
} from 'lucide-react';
import React, { useState } from 'react';
import { ConversationTranscriptModal } from '@/components/admin/analytics/conversation-transcript-modal';
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
    osBreakdown = [],
    currentPeriod = '7d',
    sessions,
    filters,
}: AnalyticsProps) {
    const [activeTab, setActiveTab] = useState<'health' | 'conversations' | 'funnel' | 'traffic'>('health');
    const [selectedPeriod, setSelectedPeriod] = useState(filters.period || currentPeriod);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sourceFilter, setSourceFilter] = useState(filters.source || 'all');
    const [fromDate, setFromDate] = useState(filters.from || '');
    const [toDate, setToDate] = useState(filters.to || '');

    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [loadingTranscript, setLoadingTranscript] = useState(false);

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
            { preserveState: true, replace: true }
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
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSourceFilter('all');
        setFromDate('');
        setToDate('');
        router.get('/admin/analytics', {}, { preserveState: true, replace: true });
    };

    const handleOpenSession = async (session: ChatSessionItem) => {
        setLoadingTranscript(true);
        try {
            const res = await fetch(`/admin/analytics/conversations/${session.id}`);
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

            <div className="w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Cabecera Principal */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D172E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Telemetría & Mirador Clínico de Lira AI
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                En Producción
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                            Auditoría de orientaciones farmacéuticas, tiempos de respuesta de Gemini AI, guardrails clínicos y embudo comercial hacia pedidos.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/admin/analytics/export-csv"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </a>
                        <button
                            type="button"
                            onClick={() => router.reload()}
                            className="p-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition"
                            title="Recargar métricas"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Métricas de Tráfico del Servidor (Zero-Latency) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                                Páginas Vistas
                            </span>
                            <Globe className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                            {kpis.total_page_views || 0}
                        </div>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                            +{kpis.today_page_views || 0} servidas hoy
                        </span>
                    </div>

                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Visitantes Únicos
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                            {kpis.total_unique_visitors || 0}
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            +{kpis.today_unique_visitors || 0} únicos hoy
                        </span>
                    </div>

                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Fichas de Fármacos
                        </span>
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                            {kpis.catalog_views || 0}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                            Vistas de catálogo y vademécum
                        </span>
                    </div>

                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Ratio Catálogo / Visitas
                        </span>
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
                            {kpis.total_page_views ? Math.round(((kpis.catalog_views || 0) / kpis.total_page_views) * 100) : 0}%
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                            Interés en productos
                        </span>
                    </div>
                </div>

                {/* Cuadrícula de KPIs Rápidos Multi-Canal */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {/* 1. Lira AI Sesiones */}
                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Sesiones Lira AI
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                            {kpis.total_sessions}
                        </div>
                        <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-medium block truncate">
                            {kpis.lira_deep_count || 0} profundas / {kpis.lira_bounces_count || 0} breves
                        </span>
                    </div>

                    {/* 2. Clics WhatsApp */}
                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Clics WhatsApp
                        </span>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                            {kpis.whatsapp_clicks_total || 0}
                        </div>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium block">
                            +{kpis.whatsapp_clicks_today || 0} intención hoy
                        </span>
                    </div>

                    {/* 3. Cotizaciones Formales */}
                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Cotizaciones BD
                        </span>
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                            {kpis.total_quotes || kpis.converted_sessions}
                        </div>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block">
                            Bolsa de pedidos formal
                        </span>
                    </div>

                    {/* 4. Mensajes Web */}
                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Mensajes Web
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                            {kpis.total_web_messages || 0}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                            Formularios de contacto
                        </span>
                    </div>

                    {/* 5. Latencia Promedio */}
                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Latencia Lira
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                            {kpis.avg_latency_ms} <span className="text-xs font-normal text-slate-400">ms</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                            {kpis.gemini_calls_count} Gemini / {kpis.deterministic_calls_count} Local
                        </span>
                    </div>

                    {/* 6. Tasa de Conversión */}
                    <div className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Tasa Conversión
                        </span>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                            {kpis.conversion_rate}%
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                            Cierre comercial global
                        </span>
                    </div>
                </div>

                {/* Selector de Pestañas */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('health')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                            activeTab === 'health'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Salud & Tendencias
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('traffic')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                            activeTab === 'traffic'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Tráfico, Secciones & Dispositivos
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('conversations')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                            activeTab === 'conversations'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Mirador de Conversaciones ({sessions.total})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('funnel')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                            activeTab === 'funnel'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Embudo Comercial
                    </button>
                </div>

                {/* CONTENIDO PESTAÑA 1: SALUD Y TENDENCIAS */}
                {activeTab === 'health' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Gráfica de Tendencia (2 columnas) */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Curva de Consultas, Tráfico y Fuentes
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Páginas vistas, sesiones Lira, Gemini AI y WhatsApp en el periodo seleccionado.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 font-mono block">Periodo Activo</span>
                                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase font-mono">
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
                        <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                                    Fármacos más Recomendados
                                </h3>
                                <span className="text-[10px] text-slate-400 font-mono">Top 5</span>
                            </div>

                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((p, i) => (
                                        <div key={p.id} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-[10px]">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {p.presentation}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                                                {p.count} veces
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-xs">
                                    Aún no hay recomendaciones farmacológicas registradas.
                                </div>
                            )}

                            {/* Guardrails Sanitarios */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                                    Guardrails Sanitarios Disparados
                                </h4>
                                {guardrailStats.length > 0 ? (
                                    <div className="space-y-2">
                                        {guardrailStats.map((g, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-[11px]">
                                                <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                                                    {g.name}
                                                </span>
                                                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                                                    {g.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-[11px] text-slate-400 block">
                                        No se han registrado contenciones clínicas críticas.
                                    </span>
                                )}
                            </div>

                            {/* Top Páginas Más Visitadas (Servidor) */}
                            {topPages && topPages.length > 0 && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-purple-500" />
                                        Páginas Más Visitadas (Servidor)
                                    </h4>
                                    <div className="space-y-2">
                                        {topPages.map((pg, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-[11px]">
                                                <span className="text-slate-600 dark:text-slate-400 font-mono truncate max-w-[200px]" title={pg.url_path}>
                                                    {pg.url_path === '/' ? '/ (Inicio)' : pg.url_path}
                                                </span>
                                                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                    Vistas en Periodo ({selectedPeriod.toUpperCase()})
                                </span>
                                <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
                                    {kpis.period_page_views || kpis.today_page_views || 0}
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    De {kpis.total_page_views || 0} acumuladas en histórico
                                </span>
                            </div>

                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                    Visitantes Únicos ({selectedPeriod.toUpperCase()})
                                </span>
                                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                                    {kpis.period_unique_visitors || kpis.today_unique_visitors || 0}
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    De {kpis.total_unique_visitors || 0} personas únicas registradas
                                </span>
                            </div>

                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                    Vistas Fichas Fármacos
                                </span>
                                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2 font-mono">
                                    {kpis.period_catalog_views || kpis.catalog_views || 0}
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    Interés específico en vademécum
                                </span>
                            </div>

                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                    Interacción WhatsApp
                                </span>
                                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                                    {kpis.whatsapp_clicks_period || kpis.whatsapp_clicks_today || 0}
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    Clics de intención en este periodo
                                </span>
                            </div>
                        </div>

                        {/* Grid de 3 Columnas: Secciones del Sitio, Navegadores/Dispositivos, y Rutas de Entrada */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna 1: Distribución por Secciones */}
                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-blue-600" />
                                        Secciones Más Navegadas
                                    </h3>
                                    <span className="text-[10px] text-slate-400 font-mono">Tráfico</span>
                                </div>

                                <div className="space-y-3">
                                    {sectionsBreakdown.length > 0 ? (
                                        sectionsBreakdown.map((sec, idx) => {
                                            const secNames: Record<string, string> = {
                                                home: 'Inicio (Landing Page)',
                                                product: 'Fichas de Medicamentos',
                                                vademecum: 'Vademécum Oficial',
                                                farmacovigilancia: 'Canal Farmacovigilancia',
                                                tools: 'Herramientas Clínicas',
                                                glossary: 'Glosario Farmacéutico',
                                                cases: 'Casos Clínicos',
                                                other: 'Otras Rutas',
                                            };
                                            const totalSecViews = sectionsBreakdown.reduce((a, b) => a + Number(b.views), 0) || 1;
                                            const pct = Math.round((Number(sec.views) / totalSecViews) * 100);

                                            return (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {secNames[sec.section] || sec.section}
                                                        </span>
                                                        <span className="font-mono text-slate-500 font-medium">
                                                            {sec.views} vistas ({pct}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-slate-400">Sin datos registrados aún.</p>
                                    )}
                                </div>
                            </div>

                            {/* Columna 2: Dispositivos y Navegadores */}
                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-cyan-600" />
                                    Entorno Tecnológico
                                </h3>

                                <div className="space-y-3">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                        Dispositivos
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {devicesBreakdown.map((dev, idx) => (
                                            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                                                    {dev.device_type}
                                                </span>
                                                <span className="font-mono text-sm font-black text-blue-600 dark:text-cyan-400">
                                                    {dev.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                            Navegadores
                                        </span>
                                        <div className="space-y-1.5">
                                            {browsersBreakdown.map((br, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                                                        {br.browser}
                                                    </span>
                                                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                        {br.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna 3: Top Rutas de Aterrizaje / Entrada */}
                            <div className="bg-white dark:bg-[#0D172E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                                    Páginas de Entrada (Landing)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Primera URL que impacta el visitante al iniciar su sesión de navegación.
                                </p>

                                <div className="space-y-2.5">
                                    {topEntryPaths.length > 0 ? (
                                        topEntryPaths.map((entry, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 text-xs">
                                                <div className="flex items-center gap-2 truncate max-w-[210px]">
                                                    <span className="w-4 h-4 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate" title={entry.path}>
                                                        {entry.path === '/' ? '/ (Página Inicio)' : entry.path}
                                                    </span>
                                                </div>
                                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex-shrink-0">
                                                    {entry.count}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400">Registrando primeras visitas...</p>
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
                            className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row flex-wrap items-center gap-3"
                        >
                            <div className="relative flex-1 min-w-[220px] w-full">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar en preguntas o ID de sesión..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                                />
                            </div>

                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                                <option value="all">Todas las Fuentes</option>
                                <option value="gemini_api">Gemini AI</option>
                                <option value="deterministic_product_match">Coincidencia de Fármaco</option>
                                <option value="deterministic_pharmacovigilance">Farmacovigilancia</option>
                                <option value="deterministic_quote">Cotización / Precios</option>
                                <option value="deterministic_contact">Contacto Administración</option>
                            </select>

                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                                />
                                <span className="text-xs text-slate-400">a</span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                                >
                                    Filtrar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </form>

                        {/* Vista Móvil de Tarjetas Táctiles */}
                        <div className="block md:hidden space-y-3">
                            {sessions.data.map((s) => (
                                <div
                                    key={s.id}
                                    className="bg-white dark:bg-[#0D172E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                                            {s.session_uid}
                                        </span>
                                        {s.converted_to_order ? (
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                                                Pedido
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] rounded-full">
                                                Consulta
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                                        "{s.first_query || 'Consulta vacía o bienvenida'}"
                                    </p>

                                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                        <span>{s.turn_count} turnos • {s.total_latency_ms}ms</span>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenSession(s)}
                                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Ver Diálogo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vista Tabular en Escritorio */}
                        <div className="hidden md:block bg-white dark:bg-[#0D172E] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="p-3.5">ID Sesión</th>
                                        <th className="p-3.5">Inicio</th>
                                        <th className="p-3.5">Turnos</th>
                                        <th className="p-3.5">Latencia</th>
                                        <th className="p-3.5">Fuente</th>
                                        <th className="p-3.5">Primera Consulta</th>
                                        <th className="p-3.5">Pedido</th>
                                        <th className="p-3.5 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {sessions.data.length > 0 ? (
                                        sessions.data.map((s) => (
                                            <tr
                                                key={s.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition"
                                            >
                                                <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                                                    {s.session_uid.substring(0, 16)}...
                                                </td>
                                                <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                    {s.started_at ? new Date(s.started_at).toLocaleDateString('es-VE') : 'N/A'}
                                                </td>
                                                <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {s.turn_count}
                                                </td>
                                                <td className="p-3.5 font-mono text-slate-500">
                                                    {s.total_latency_ms} ms
                                                </td>
                                                <td className="p-3.5">
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                                                        {s.last_source || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-slate-800 dark:text-slate-200 max-w-xs truncate font-medium">
                                                    {s.first_query || '—'}
                                                </td>
                                                <td className="p-3.5">
                                                    {s.converted_to_order ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full">
                                                            <CheckCircle2 className="w-3 h-3" /> Sí
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400">No</span>
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenSession(s)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold rounded-lg transition"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Ver Diálogo
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-12 text-slate-400 text-xs">
                                                No se encontraron sesiones registradas con los filtros actuales.
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
                                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white font-bold'
                                                : link.url
                                                ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                                                : 'text-slate-400 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CONTENIDO PESTAÑA 3: EMBUDO COMERCIAL */}
                {activeTab === 'funnel' && (
                    <div className="bg-white dark:bg-[#0D172E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl">
                        <FunnelView
                            totalSessions={kpis.total_sessions}
                            totalMessages={kpis.total_messages}
                            topProductsCount={topProducts.reduce((acc, p) => acc + p.count, 0)}
                            convertedSessions={kpis.converted_sessions}
                            conversionRate={kpis.conversion_rate}
                            whatsappClicks={kpis.whatsapp_clicks_total || 0}
                            totalQuotes={kpis.total_quotes || kpis.converted_sessions}
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
