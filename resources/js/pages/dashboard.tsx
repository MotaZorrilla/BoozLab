import { Head, Link } from '@inertiajs/react';
import {
    Package,
    ShieldAlert,
    CheckCircle2,
    Filter,
    MessageSquare,
    TrendingUp,
    Bot,
    Pill,
    Users,
    Settings,
    Building2,
    Sparkles,
    ChevronRight,
    ExternalLink,
    UserPlus,
} from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type {
    Product,
    ProductLine,
    PharmacovigilanceReport,
    Faq,
    Testimonial,
} from '@/types';

export interface MessageItem {
    id: number;
    type: string;
    source?: string;
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
    status: 'Pendiente' | 'En Gestión' | 'Contactado' | 'Resuelto';
    admin_notes?: string | null;
    created_at: string;
}

export interface AnalyticsData {
    total_views: number;
    total_chatbot_inquiries: number;
    total_quote_inquiries: number;
    top_chatbot_products: {
        id: number;
        name: string;
        presentation: string;
        chatbot_inquiries_count: number;
    }[];
    top_quote_products: {
        id: number;
        name: string;
        presentation: string;
        quote_inquiries_count: number;
    }[];
    top_viewed_products: {
        id: number;
        name: string;
        presentation: string;
        views_count: number;
    }[];
    line_demand: {
        id: number;
        name: string;
        products_count: number;
        total_views: number;
        total_chatbot: number;
        total_quotes: number;
    }[];
}

interface DashboardProps {
    stats: {
        total_products: number;
        active_products: number;
        pending_reports: number;
        total_reports: number;
        pending_messages?: number;
        total_messages?: number;
        total_lines: number;
        total_quotes?: number;
    };
    analytics?: AnalyticsData;
    products: Product[];
    productLines: ProductLine[];
    reports: PharmacovigilanceReport[];
    messages?: MessageItem[];
    faqs: Faq[];
    testimonials: Testimonial[];
}

export default function Dashboard({
    stats = {
        total_products: 0,
        active_products: 0,
        pending_reports: 0,
        total_reports: 0,
        pending_messages: 0,
        total_messages: 0,
        total_lines: 0,
        total_quotes: 0,
    },
    analytics = {
        total_views: 0,
        total_chatbot_inquiries: 0,
        total_quote_inquiries: 0,
        top_chatbot_products: [],
        top_quote_products: [],
        top_viewed_products: [],
        line_demand: [],
    },
}: DashboardProps) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
            ]}
        >
            <Head title="Consola de Administración Farmacéutica | Booz Laboratorio" />

            <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8 2xl:max-w-[1600px] 3xl:max-w-[1900px]">
                {/* Cabecera Ejecutiva */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#002072] dark:border-blue-800/50 dark:bg-blue-950/60 dark:text-cyan-400">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>Planta Valle de Guanape • Anzoátegui</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Consola de Administración Farmacéutica
                        </h1>
                        <p className="mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            Centro de mando y monitoreo en tiempo real de
                            operaciones clínicas, catálogo vademécum,
                            farmacovigilancia INH y gestión de demanda.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link
                            href="/admin/users?create=1"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all hover:bg-emerald-700 sm:px-4 sm:py-2.5 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            title="Registrar nuevo usuario o personal institucional con asignación de rol"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Nuevo Registro / Usuario</span>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:px-4 sm:py-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <span>Ver Portal Web</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#002072] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 sm:px-4 sm:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            <Pill className="h-4 w-4" />
                            <span>Gestionar Catálogo</span>
                        </Link>
                    </div>
                </div>

                {/* Métricas y KPIs Superiores */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-colors sm:p-5 dark:border-slate-800 dark:bg-[#0D172E]">
                        <div>
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Total Productos
                            </span>
                            <h3 className="mt-0.5 text-2xl font-black text-slate-900 dark:text-white">
                                {stats.total_products}
                            </h3>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.active_products} activos
                            </span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#002072] dark:bg-blue-950/60 dark:text-cyan-400">
                            <Package className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors sm:p-5 dark:border-slate-800 dark:bg-[#0D172E]">
                        <div>
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Líneas Oficiales
                            </span>
                            <h3 className="mt-0.5 text-2xl font-black text-slate-900 dark:text-white">
                                {stats.total_lines}
                            </h3>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                Clasificación
                            </span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
                            <Filter className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white bg-gradient-to-r from-white to-amber-50/20 p-4 shadow-sm transition-colors sm:p-5 dark:border-amber-900/60 dark:bg-[#0D172E] dark:from-[#0D172E] dark:to-amber-950/30">
                        <div>
                            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase dark:text-amber-300">
                                Farmacovigilancia
                            </span>
                            <h3 className="mt-0.5 text-2xl font-black text-amber-900 dark:text-amber-200">
                                {stats.pending_reports}
                            </h3>
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                Reportes INH
                            </span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-white bg-gradient-to-r from-white to-blue-50/20 p-4 shadow-sm transition-colors sm:p-5 dark:border-blue-900/60 dark:bg-[#0D172E] dark:from-[#0D172E] dark:to-blue-950/30">
                        <div>
                            <span className="text-[11px] font-bold tracking-wider text-blue-900 uppercase dark:text-cyan-300">
                                Bandeja Mensajes
                            </span>
                            <h3 className="mt-0.5 text-2xl font-black text-slate-900 dark:text-white">
                                {stats.total_messages ?? messages.length}
                            </h3>
                            {(stats.pending_messages ?? 0) > 0 ? (
                                <span className="animate-pulse text-[10px] font-black text-rose-600 dark:text-rose-400">
                                    🔴 {stats.pending_messages} por responder
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    ✓ Al día
                                </span>
                            )}
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#002072] dark:bg-blue-950/80 dark:text-cyan-400">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between rounded-2xl border border-emerald-200 bg-white bg-gradient-to-r from-white to-emerald-50/20 p-3.5 shadow-sm transition-colors sm:col-span-1 sm:p-5 lg:col-span-1 dark:border-emerald-900/60 dark:bg-[#0D172E] dark:from-[#0D172E] dark:to-emerald-950/30">
                        <div>
                            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
                                Demanda Comercial
                            </span>
                            <h3 className="mt-0.5 text-2xl font-black text-emerald-900 dark:text-emerald-200">
                                {stats.total_quotes ?? 0}
                            </h3>
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                {analytics.total_quote_inquiries || 0} unidades
                            </span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Sección Principal: Las 4 Fichas Operativas de Enlace */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                <Sparkles className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                <span>
                                    Operaciones Farmacéuticas Principales
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Acceso directo a las áreas de gestión
                                especializada de Booz Laboratorio.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 3xl:grid-cols-4">
                        {/* Ficha 1: Gestión de Catálogo */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-500/50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#002072] transition-transform group-hover:scale-110 dark:bg-blue-950/80 dark:text-cyan-400">
                                        <Pill className="h-6 w-6" />
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        {stats.active_products} /{' '}
                                        {stats.total_products} Activos
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-[#002072] dark:text-white dark:group-hover:text-cyan-400">
                                        Gestión de Catálogo Farmacéutico
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Administración completa de los 18
                                        fármacos de producción nacional,
                                        principios activos, posologías, números
                                        de registro sanitario INH, precios y
                                        stock.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2 text-xs dark:border-slate-800/80">
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Líneas Terapéuticas
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {stats.total_lines} Categorías
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Fichas Técnicas
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            100% Cuali-cuantitativas
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/admin/products"
                                    className="inline-flex w-full items-center justify-between rounded-2xl bg-[#002072] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-800"
                                >
                                    <span>Ir a Gestión de Catálogo</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Ficha 2: Farmacovigilancia INH */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 transition-transform group-hover:scale-110 dark:bg-amber-950/80 dark:text-amber-400">
                                        <ShieldAlert className="h-6 w-6" />
                                    </div>
                                    {stats.pending_reports > 0 ? (
                                        <span className="animate-pulse rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                                            ⚠️ {stats.pending_reports} por
                                            Dictaminar
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            ✓ Casos Cerrados
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                                        Farmacovigilancia INH
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Recepción de notificaciones de
                                        reacciones adversas (RAM), control
                                        estricto de lotes de planta, dictámenes
                                        técnicos y emisión de actas sanitarias
                                        para el INH.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2 text-xs dark:border-slate-800/80">
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Total Notificaciones
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {stats.total_reports} Registros
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Acta Sanitaria
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            Imprimible / PDF Oficial
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/admin/reports"
                                    className="inline-flex w-full items-center justify-between rounded-2xl bg-amber-700 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-800"
                                >
                                    <span>Ir a Farmacovigilancia INH</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Ficha 3: Bandeja de Mensajes & Leads */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-rose-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-rose-500/50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition-transform group-hover:scale-110 dark:bg-rose-950/80 dark:text-rose-400">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    {(stats.pending_messages ?? 0) > 0 ? (
                                        <span className="animate-pulse rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                                            🔴 {stats.pending_messages}{' '}
                                            Pendientes
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            ✓ Bandeja al Día
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400">
                                        Bandeja de Mensajes & Leads
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Seguimiento a contactos de farmacias,
                                        doctores y pacientes derivados desde el
                                        formulario web y el asistente
                                        inteligente Lira con respuesta directa
                                        por WhatsApp en 1-clic.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2 text-xs dark:border-slate-800/80">
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Mensajes Recibidos
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {stats.total_messages ??
                                                messages.length}{' '}
                                            Contactos
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Canales Integrados
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            Lira AI + Web Form
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/admin/messages"
                                    className="inline-flex w-full items-center justify-between rounded-2xl bg-rose-700 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-800"
                                >
                                    <span>Ir a Bandeja de Mensajes</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Ficha 4: Analítica de Demanda & Cotizaciones */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-950/80 dark:text-emerald-400">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        {stats.total_quotes ?? 0} Cotizaciones
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                        Analítica de Demanda & Cotizaciones
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Historial de pedidos por WhatsApp
                                        generados en la tienda, ranking de
                                        fármacos más consultados, unidades
                                        demandadas y desglose de interés por
                                        línea terapéutica.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2 text-xs dark:border-slate-800/80">
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Unidades Solicitadas
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {analytics.total_quote_inquiries ||
                                                0}{' '}
                                            Uds
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-400">
                                            Consultas en Catálogo
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {analytics.total_views || 0} Visitas
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/admin/quotes"
                                    className="inline-flex w-full items-center justify-between rounded-2xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800"
                                >
                                    <span>Ir a Cotizaciones & Demanda</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Módulos de Sistema y Control */}
                <div className="pt-2">
                    <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Sistema, Control y Parámetros Globales
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Link
                            href="/admin/users"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
                        >
                            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 transition-transform group-hover:scale-110 dark:bg-blue-950 dark:text-cyan-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    Usuarios & Roles
                                </div>
                                <div className="text-xs text-slate-400">
                                    Control de acceso RBAC y colaboradores
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/ai"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-500"
                        >
                            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700 transition-transform group-hover:scale-110 dark:bg-cyan-950 dark:text-cyan-400">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    Lira AI & Gemini
                                </div>
                                <div className="text-xs text-slate-400">
                                    Token, modelo y simulador de vademécum
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                        >
                            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700 transition-transform group-hover:scale-110 dark:bg-slate-800 dark:text-slate-300">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    Ajustes & WhatsApp
                                </div>
                                <div className="text-xs text-slate-400">
                                    Número oficial y datos fiscales de planta
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Footer Informativo de la Consola */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-[#002072]/5 to-[#842D44]/5 p-5 text-xs text-slate-500 sm:flex-row dark:border-slate-800/80 dark:from-[#002072]/20 dark:to-[#842D44]/20 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                            Plataforma Clínica operando bajo Buenas Prácticas de
                            Manufactura (BPM) y normativas sanitarias INH.
                        </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                        RIF: J-40906185-0 • Booz Laboratorio VGME, C.A.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
