import {
    MessageSquare,
    Bot,
    Pill,
    ShoppingBag,
    ArrowDown,
    TrendingUp,
    Globe,
} from 'lucide-react';
import React from 'react';

interface FunnelViewProps {
    totalSessions: number;
    totalMessages: number;
    topProductsCount: number;
    convertedSessions: number;
    conversionRate: number;
    whatsappClicks?: number;
    totalQuotes?: number;
    totalPageViews?: number;
    catalogViews?: number;
}

export function FunnelView({
    totalSessions,
    topProductsCount,
    convertedSessions,
    conversionRate,
    whatsappClicks = 0,
    totalQuotes = 0,
    totalPageViews = 0,
    catalogViews = 0,
}: FunnelViewProps) {
    const finalConversions = totalQuotes > 0 ? totalQuotes : convertedSessions;
    const baseTraffic = Math.max(
        totalPageViews,
        totalSessions + whatsappClicks,
        1,
    );
    const catalogCount = Math.max(catalogViews, topProductsCount);

    const steps = [
        {
            title: '1. Tráfico Servidor & Páginas Vistas',
            description:
                'Total de páginas web y portal entregados por el servidor',
            count: totalPageViews > 0 ? totalPageViews : baseTraffic,
            percentage: 100,
            icon: Globe,
            color: 'bg-purple-600',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
        {
            title: '2. Exploración de Fichas & Vademécum',
            description:
                'Visitas a fichas médicas de fármacos y vademécum descargable',
            count: catalogCount,
            percentage: Math.min(
                100,
                Math.round((catalogCount / baseTraffic) * 100),
            ),
            icon: Pill,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            title: '3. Consultas Clínicas Lira AI',
            description:
                'Visitantes que interactuaron con el asistente clínico 24/7',
            count: totalSessions,
            percentage: Math.min(
                100,
                Math.round((totalSessions / baseTraffic) * 100),
            ),
            icon: MessageSquare,
            color: 'bg-blue-600',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: '4. Intenciones de Contacto WhatsApp',
            description:
                'Clics en "Atención por WhatsApp" en ficha de producto y botón flotante',
            count: whatsappClicks,
            percentage: Math.min(
                100,
                Math.round((whatsappClicks / baseTraffic) * 100),
            ),
            icon: Bot,
            color: 'bg-cyan-500',
            textColor: 'text-cyan-600 dark:text-cyan-400',
        },
        {
            title: '5. Cotizaciones Formales Registradas',
            description:
                'Pedidos y cotizaciones generados en BD desde la bolsa de pedidos',
            count: finalConversions,
            percentage: conversionRate,
            icon: ShoppingBag,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        Embudo de Orientación & Conversión Comercial
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atribución desde la primera consulta médica hasta el
                        enlace de cotización formal.
                    </p>
                </div>
                <div className="text-right">
                    <span className="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {conversionRate}%
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">
                        Tasa de Cierre
                    </span>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`rounded-lg p-1.5 ${step.textColor} bg-slate-100 dark:bg-slate-800`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {step.title}
                                        </span>
                                        <span className="ml-2 hidden text-[11px] text-slate-400 sm:inline">
                                            ({step.description})
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right font-mono">
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {step.count}
                                    </span>
                                    <span className="ml-1.5 text-[10px] text-slate-400">
                                        ({step.percentage}%)
                                    </span>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className={`h-full ${step.color} rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.max(step.percentage, 2)}%`,
                                    }}
                                />
                            </div>

                            {idx < steps.length - 1 && (
                                <div className="my-0.5 flex justify-center">
                                    <ArrowDown className="h-3 w-3 text-slate-300 dark:text-slate-700" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
