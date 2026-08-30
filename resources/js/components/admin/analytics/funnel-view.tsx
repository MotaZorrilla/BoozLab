import React from 'react';
import { MessageSquare, Bot, Pill, ShoppingBag, ArrowDown, TrendingUp } from 'lucide-react';

interface FunnelViewProps {
    totalSessions: number;
    totalMessages: number;
    topProductsCount: number;
    convertedSessions: number;
    conversionRate: number;
    whatsappClicks?: number;
    totalQuotes?: number;
}

export function FunnelView({
    totalSessions,
    totalMessages,
    topProductsCount,
    convertedSessions,
    conversionRate,
    whatsappClicks = 0,
    totalQuotes = 0,
}: FunnelViewProps) {
    const finalConversions = totalQuotes > 0 ? totalQuotes : convertedSessions;
    const baseTotal = Math.max(totalSessions + whatsappClicks, 1);

    const steps = [
        {
            title: '1. Consultas Lira AI',
            description: 'Visitantes que interactuaron con el asistente clínico',
            count: totalSessions,
            percentage: Math.round((totalSessions / baseTotal) * 100),
            icon: MessageSquare,
            color: 'bg-blue-600',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: '2. Intenciones de Contacto WhatsApp',
            description: 'Clics en "Atención por WhatsApp" en ficha de producto y botón flotante',
            count: whatsappClicks,
            percentage: Math.round((whatsappClicks / baseTotal) * 100),
            icon: Bot,
            color: 'bg-cyan-500',
            textColor: 'text-cyan-600 dark:text-cyan-400',
        },
        {
            title: '3. Fármacos y Vademécum Recomendados',
            description: 'Sesiones donde se sugirieron productos del vademécum oficial',
            count: topProductsCount,
            percentage: totalSessions > 0 ? Math.min(100, Math.round((topProductsCount / totalSessions) * 100)) : 0,
            icon: Pill,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            title: '4. Cotizaciones Formales Registradas',
            description: 'Pedidos y cotizaciones generados en BD desde la bolsa de pedidos',
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
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Embudo de Orientación & Conversión Comercial
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atribución desde la primera consulta médica hasta el enlace de cotización formal.
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {conversionRate}%
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">Tasa de Cierre</span>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${step.textColor} bg-slate-100 dark:bg-slate-800`}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{step.title}</span>
                                        <span className="hidden sm:inline text-[11px] text-slate-400 ml-2">({step.description})</span>
                                    </div>
                                </div>
                                <div className="text-right font-mono">
                                    <span className="font-bold text-slate-900 dark:text-white">{step.count}</span>
                                    <span className="text-[10px] text-slate-400 ml-1.5">({step.percentage}%)</span>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${step.color} rounded-full transition-all duration-500`}
                                    style={{ width: `${Math.max(step.percentage, 2)}%` }}
                                />
                            </div>

                            {idx < steps.length - 1 && (
                                <div className="flex justify-center my-0.5">
                                    <ArrowDown className="w-3 h-3 text-slate-300 dark:text-slate-700" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
