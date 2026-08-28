import { Head } from '@inertiajs/react';
import { TrendingUp, ShoppingBag, MessageCircle, ArrowUpRight, BarChart2, Package } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface QuoteItem {
    id: number;
    quote_id: number;
    product_id: number;
    quantity: number;
    product?: {
        name: string;
        presentation: string;
        price: number;
    };
}

interface QuoteRecord {
    id: number;
    customer_type: string;
    notes: string | null;
    status: string;
    created_at: string;
    items: QuoteItem[];
}

interface TopProduct {
    id: number;
    name: string;
    slug: string;
    quote_inquiries_count: number;
    price: number;
}

interface QuotesPageProps {
    quotes: {
        data: QuoteRecord[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total_quotes: number;
        total_units_demanded: number;
    };
    topProducts: TopProduct[];
}

export default function AdminQuotes({ quotes, stats, topProducts }: QuotesPageProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Cotizaciones & Demanda', href: '/admin/quotes' }]}>
            <Head title="Cotizaciones y Analítica de Demanda | Booz Laboratorio" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Cotizaciones de Tienda & Demanda Comercial
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Trazabilidad de pedidos armados en la bolsa de compras y solicitudes de cotización por WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Métricas Resumen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total_quotes}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cotizaciones Registradas</div>
                        </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total_units_demanded}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unidades Farmacéuticas Solicitadas</div>
                        </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                            <BarChart2 className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{topProducts.length}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fármacos con Demanda Activa</div>
                        </div>
                    </div>
                </div>

                {/* Grid con Ranking y Listado */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Listado de Cotizaciones (2 cols) */}
                    <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Historial de Cotizaciones Solicitadas ({quotes.total})</span>
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="py-3 px-4">ID Cotización</th>
                                        <th className="py-3 px-4">Tipo Cliente</th>
                                        <th className="py-3 px-4">Ítems Solicitados</th>
                                        <th className="py-3 px-4">Fecha y Hora</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {quotes.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-400">
                                                No hay solicitudes de cotización registradas todavía.
                                            </td>
                                        </tr>
                                    ) : (
                                        quotes.data.map((q) => (
                                            <tr key={q.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                    #COT-{String(q.id).padStart(4, '0')}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[11px]">
                                                        {q.customer_type || 'Paciente'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="space-y-1">
                                                        {q.items?.map((item) => (
                                                            <div key={item.id} className="flex items-center gap-1.5 text-[11px]">
                                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                                    {item.quantity}x
                                                                </span>
                                                                <span>{item.product?.name || `Fármaco #${item.product_id}`}</span>
                                                                <span className="text-slate-400">({item.product?.presentation})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{q.created_at}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Ranking de Productos Más Cotizados (1 col) */}
                    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <BarChart2 className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                            <span>Top Fármacos con Mayor Demanda</span>
                        </h2>

                        <div className="space-y-3">
                            {topProducts.length === 0 ? (
                                <p className="text-xs text-slate-400 py-4 text-center">Sin métricas de cotización acumuladas.</p>
                            ) : (
                                topProducts.map((p, idx) => (
                                    <div key={p.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-[#002072] dark:text-cyan-400 font-black text-xs flex items-center justify-center">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">${Number(p.price || 0).toFixed(2)} USD</div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                                {p.quote_inquiries_count} cotiz.
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
