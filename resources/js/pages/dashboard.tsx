import { Head, Link } from '@inertiajs/react';
import { 
    Package, ShieldAlert, CheckCircle2, ArrowUpRight, Filter,
    MessageSquare, TrendingUp, Bot, Pill, Users, Settings,
    Building2, Sparkles, ChevronRight, ExternalLink, UserPlus
} from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { Product, ProductLine, PharmacovigilanceReport, Faq, Testimonial } from '@/types';

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
    top_chatbot_products: { id: number; name: string; presentation: string; chatbot_inquiries_count: number }[];
    top_quote_products: { id: number; name: string; presentation: string; quote_inquiries_count: number }[];
    top_viewed_products: { id: number; name: string; presentation: string; views_count: number }[];
    line_demand: { id: number; name: string; products_count: number; total_views: number; total_chatbot: number; total_quotes: number }[];
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
    stats = { total_products: 0, active_products: 0, pending_reports: 0, total_reports: 0, pending_messages: 0, total_messages: 0, total_lines: 0, total_quotes: 0 },
    analytics = {
        total_views: 0,
        total_chatbot_inquiries: 0,
        total_quote_inquiries: 0,
        top_chatbot_products: [],
        top_quote_products: [],
        top_viewed_products: [],
        line_demand: [],
    },
    products = [],
    productLines = [],
    reports = [],
    messages = [],
    faqs = [],
    testimonials = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }]}>
            <Head title="Consola de Administración Farmacéutica | Booz Laboratorio" />

            <div className="p-3 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1900px] mx-auto space-y-6 sm:space-y-8">
                {/* Cabecera Ejecutiva */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 text-[#002072] dark:text-cyan-400 text-xs font-bold mb-2">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>Planta Valle de Guanape • Anzoátegui</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Consola de Administración Farmacéutica
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                            Centro de mando y monitoreo en tiempo real de operaciones clínicas, catálogo vademécum, farmacovigilancia INH y gestión de demanda.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link
                            href="/admin/users?create=1"
                            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
                            title="Registrar nuevo usuario o personal institucional con asignación de rol"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Nuevo Registro / Usuario</span>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <span>Ver Portal Web</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 transition-all"
                        >
                            <Pill className="h-4 w-4" />
                            <span>Gestionar Catálogo</span>
                        </Link>
                    </div>
                </div>

                {/* Métricas y KPIs Superiores */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-[#0D172E] p-3.5 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Productos</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total_products}</h3>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{stats.active_products} activos</span>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#002072] dark:text-cyan-400 flex items-center justify-center">
                            <Package className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0D172E] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Líneas Oficiales</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total_lines}</h3>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Clasificación</span>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 flex items-center justify-center">
                            <Filter className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0D172E] p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-sm flex items-center justify-between bg-gradient-to-r from-white dark:from-[#0D172E] to-amber-50/20 dark:to-amber-950/30 transition-colors">
                        <div>
                            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Farmacovigilancia</span>
                            <h3 className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-0.5">{stats.pending_reports}</h3>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">Reportes INH</span>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0D172E] p-4 sm:p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-sm flex items-center justify-between bg-gradient-to-r from-white dark:from-[#0D172E] to-blue-50/20 dark:to-blue-950/30 transition-colors">
                        <div>
                            <span className="text-[11px] font-bold text-blue-900 dark:text-cyan-300 uppercase tracking-wider">Bandeja Mensajes</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total_messages ?? messages.length}</h3>
                            {(stats.pending_messages ?? 0) > 0 ? (
                                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-black animate-pulse">
                                    🔴 {stats.pending_messages} por responder
                                </span>
                            ) : (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Al día</span>
                            )}
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#002072] dark:text-cyan-400 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white dark:bg-[#0D172E] p-3.5 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-sm flex items-center justify-between bg-gradient-to-r from-white dark:from-[#0D172E] to-emerald-50/20 dark:to-emerald-950/30 transition-colors">
                        <div>
                            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Demanda Comercial</span>
                            <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">{stats.total_quotes ?? 0}</h3>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{analytics.total_quote_inquiries || 0} unidades</span>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Sección Principal: Las 4 Fichas Operativas de Enlace */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                <span>Operaciones Farmacéuticas Principales</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Acceso directo a las áreas de gestión especializada de Booz Laboratorio.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-4 sm:gap-5">
                        {/* Ficha 1: Gestión de Catálogo */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-blue-500/50 dark:hover:border-cyan-500/50 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#002072] dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Pill className="h-6 w-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                                        {stats.active_products} / {stats.total_products} Activos
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#002072] dark:group-hover:text-cyan-400 transition-colors">
                                        Gestión de Catálogo Farmacéutico
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                        Administración completa de los 18 fármacos de producción nacional, principios activos, posologías, números de registro sanitario INH, precios y stock.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Líneas Terapéuticas</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{stats.total_lines} Categorías</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Fichas Técnicas</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">100% Cuali-cuantitativas</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/admin/products"
                                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-[#002072] text-white hover:bg-blue-800 font-bold text-xs transition-all shadow-sm"
                                >
                                    <span>Ir a Gestión de Catálogo</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Ficha 2: Farmacovigilancia INH */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ShieldAlert className="h-6 w-6" />
                                    </div>
                                    {stats.pending_reports > 0 ? (
                                        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-xs animate-pulse">
                                            ⚠️ {stats.pending_reports} por Dictaminar
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                                            ✓ Casos Cerrados
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                        Farmacovigilancia INH
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                        Recepción de notificaciones de reacciones adversas (RAM), control estricto de lotes de planta, dictámenes técnicos y emisión de actas sanitarias para el INH.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Total Notificaciones</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{stats.total_reports} Registros</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Acta Sanitaria</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Imprimible / PDF Oficial</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/admin/reports"
                                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-700 text-white hover:bg-amber-800 font-bold text-xs transition-all shadow-sm"
                                >
                                    <span>Ir a Farmacovigilancia INH</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Ficha 3: Bandeja de Mensajes & Leads */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-rose-500/50 dark:hover:border-rose-500/50 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    {(stats.pending_messages ?? 0) > 0 ? (
                                        <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-black text-xs animate-pulse">
                                            🔴 {stats.pending_messages} Pendientes
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                                            ✓ Bandeja al Día
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                        Bandeja de Mensajes & Leads
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                        Seguimiento a contactos de farmacias, doctores y pacientes derivados desde el formulario web y el asistente inteligente Lira con respuesta directa por WhatsApp en 1-clic.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Mensajes Recibidos</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{stats.total_messages ?? messages.length} Contactos</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Canales Integrados</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Lira AI + Web Form</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                     href="/admin/messages"
                                     className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-rose-700 text-white hover:bg-rose-800 font-bold text-xs transition-all shadow-sm"
                                >
                                     <span>Ir a Bandeja de Mensajes</span>
                                     <ChevronRight className="h-4 w-4" />
                                 </Link>
                            </div>
                        </div>

                        {/* Ficha 4: Analítica de Demanda & Cotizaciones */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                                        {stats.total_quotes ?? 0} Cotizaciones
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        Analítica de Demanda & Cotizaciones
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                        Historial de pedidos por WhatsApp generados en la tienda, ranking de fármacos más consultados, unidades demandadas y desglose de interés por línea terapéutica.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Unidades Solicitadas</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{analytics.total_quote_inquiries || 0} Uds</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-[11px] block">Consultas en Catálogo</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{analytics.total_views || 0} Visitas</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link
                                     href="/admin/quotes"
                                     className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs transition-all shadow-sm"
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
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Sistema, Control y Parámetros Globales
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/admin/users"
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-center gap-3.5 group"
                        >
                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-slate-900 dark:text-white">Usuarios & Roles</div>
                                <div className="text-xs text-slate-400">Control de acceso RBAC y colaboradores</div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/ai"
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-400 dark:hover:border-cyan-500 transition-all flex items-center gap-3.5 group"
                        >
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-slate-900 dark:text-white">Lira AI & Gemini</div>
                                <div className="text-xs text-slate-400">Token, modelo y simulador de vademécum</div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all flex items-center gap-3.5 group"
                        >
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-slate-900 dark:text-white">Ajustes & WhatsApp</div>
                                <div className="text-xs text-slate-400">Número oficial y datos fiscales de planta</div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Footer Informativo de la Consola */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#002072]/5 to-[#842D44]/5 dark:from-[#002072]/20 dark:to-[#842D44]/20 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Plataforma Clínica operando bajo Buenas Prácticas de Manufactura (BPM) y normativas sanitarias INH.</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                        RIF: J-40906185-0 • Booz Laboratorio VGME, C.A.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
