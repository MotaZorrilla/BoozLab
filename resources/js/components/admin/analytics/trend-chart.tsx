import React, { useState } from 'react';

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

interface TrendChartProps {
    data: ChartPoint[];
    currentPeriod?: string;
    onPeriodChange?: (period: string) => void;
}

export function TrendChart({
    data,
    currentPeriod = '7d',
    onPeriodChange,
}: TrendChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Toggle para visibilidad de series en el gráfico
    const [visibleSeries, setVisibleSeries] = useState({
        views: true,
        sessions: true,
        gemini: true,
        deterministic: true,
        whatsapp: true,
    });

    const toggleSeries = (key: keyof typeof visibleSeries) => {
        setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex h-52 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                No hay suficientes datos de sesiones para graficar.
            </div>
        );
    }

    const periods = [
        { id: '7d', label: '7 Días' },
        { id: '15d', label: '15 Días' },
        { id: '30d', label: '1 Mes' },
        { id: '6m', label: '6 Meses' },
        { id: '1y', label: '1 Año' },
        { id: 'all', label: 'Histórico' },
    ];

    const maxVal = Math.max(
        ...data.map((d) =>
            Math.max(
                visibleSeries.sessions ? d.sessions : 0,
                visibleSeries.gemini ? d.gemini : 0,
                visibleSeries.deterministic ? d.deterministic : 0,
                visibleSeries.whatsapp ? d.whatsapp || 0 : 0,
                visibleSeries.views ? d.views || 0 : 0,
                1,
            ),
        ),
        5,
    );

    const width = 640;
    const height = 180;
    const paddingX = 40;
    const paddingY = 24;

    const getX = (idx: number) => {
        if (data.length <= 1) return width / 2;
        return paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
    };

    const getY = (val: number) => {
        const usableHeight = height - paddingY * 2;
        return height - paddingY - (val / maxVal) * usableHeight;
    };

    // Puntos para líneas
    const sessionPoints = data
        .map((d, i) => `${getX(i)},${getY(d.sessions)}`)
        .join(' ');
    const geminiPoints = data
        .map((d, i) => `${getX(i)},${getY(d.gemini)}`)
        .join(' ');
    const detPoints = data
        .map((d, i) => `${getX(i)},${getY(d.deterministic)}`)
        .join(' ');
    const waPoints = data
        .map((d, i) => `${getX(i)},${getY(d.whatsapp || 0)}`)
        .join(' ');
    const viewsPoints = data
        .map((d, i) => `${getX(i)},${getY(d.views || 0)}`)
        .join(' ');

    return (
        <div className="w-full space-y-3">
            {/* Barra Superior con Selector de Periodo y Filtro de Series */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                {/* Botones de Periodo */}
                <div className="no-scrollbar inline-flex items-center overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700/60 dark:bg-slate-800/80">
                    {periods.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() =>
                                onPeriodChange && onPeriodChange(p.id)
                            }
                            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-bold whitespace-nowrap transition-all ${
                                currentPeriod === p.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Filtros Interactivos de Series */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3">
                    <button
                        type="button"
                        onClick={() => toggleSeries('views')}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            visibleSeries.views
                                ? 'border-purple-300 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                        }`}
                        title="Alternar visibilidad de Páginas Vistas"
                    >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-500" />
                        Páginas Vistas
                    </button>

                    <button
                        type="button"
                        onClick={() => toggleSeries('sessions')}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            visibleSeries.sessions
                                ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                        }`}
                        title="Alternar visibilidad de Sesiones Lira"
                    >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
                        Sesiones Lira
                    </button>

                    <button
                        type="button"
                        onClick={() => toggleSeries('gemini')}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            visibleSeries.gemini
                                ? 'border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300'
                                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                        }`}
                        title="Alternar visibilidad de Gemini AI"
                    >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                        Gemini AI
                    </button>

                    <button
                        type="button"
                        onClick={() => toggleSeries('deterministic')}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            visibleSeries.deterministic
                                ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                        }`}
                        title="Alternar visibilidad de Motor Local"
                    >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                        Motor Local
                    </button>

                    <button
                        type="button"
                        onClick={() => toggleSeries('whatsapp')}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            visibleSeries.whatsapp
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                        }`}
                        title="Alternar visibilidad de Clics WhatsApp"
                    >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        WhatsApp
                    </button>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-44 w-full overflow-visible sm:h-52"
                    preserveAspectRatio="none"
                >
                    {/* Líneas horizontales de guía */}
                    {[0, 0.5, 1].map((ratio, idx) => {
                        const y =
                            height - paddingY - ratio * (height - paddingY * 2);
                        const val = Math.round(ratio * maxVal);
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingX}
                                    y1={y}
                                    x2={width - paddingX}
                                    y2={y}
                                    stroke="currentColor"
                                    strokeDasharray="4 4"
                                    className="text-slate-200 dark:text-slate-800"
                                />
                                <text
                                    x={paddingX - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-slate-400 font-mono text-[10px] dark:fill-slate-500"
                                >
                                    {val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Línea Sesiones Totales (Azul) */}
                    {visibleSeries.sessions && (
                        <polyline
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={sessionPoints}
                        />
                    )}

                    {/* Línea Gemini (Cian) */}
                    {visibleSeries.gemini && (
                        <polyline
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={geminiPoints}
                        />
                    )}

                    {/* Línea Determinista (Ámbar) */}
                    {visibleSeries.deterministic && (
                        <polyline
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={detPoints}
                        />
                    )}

                    {/* Línea Clics WhatsApp (Esmeralda) */}
                    {visibleSeries.whatsapp && (
                        <polyline
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={waPoints}
                        />
                    )}

                    {/* Línea Páginas Vistas (Púrpura punteada) */}
                    {visibleSeries.views && (
                        <polyline
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2.5"
                            strokeDasharray="4 3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={viewsPoints}
                        />
                    )}

                    {/* Puntos interactivos */}
                    {data.map((d, i) => {
                        const cx = getX(i);
                        const cy = getY(d.sessions);
                        const isHovered = hoveredIdx === i;

                        return (
                            <g
                                key={i}
                                className="cursor-pointer transition-transform"
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isHovered ? 6 : 4}
                                    className="fill-blue-600 stroke-white stroke-2 dark:stroke-slate-900"
                                />
                                <text
                                    x={cx}
                                    y={height - 6}
                                    textAnchor="middle"
                                    className="fill-slate-500 text-[10px] font-medium dark:fill-slate-400"
                                >
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip flotante */}
                {hoveredIdx !== null && data[hoveredIdx] && (
                    <div className="pointer-events-none absolute top-2 left-1/2 z-10 flex -translate-x-1/2 gap-3 rounded-xl border border-slate-700 bg-slate-900/95 px-3.5 py-2 font-mono text-xs text-white shadow-xl dark:bg-slate-800/95">
                        <div>
                            <span className="block text-[10px] text-slate-400">
                                {data[hoveredIdx].label}
                            </span>
                            <span className="font-bold text-blue-400">
                                {data[hoveredIdx].sessions} Sesiones
                            </span>
                            <span className="mt-0.5 block text-[10px] text-purple-300">
                                {data[hoveredIdx].views || 0} Vistas (
                                {data[hoveredIdx].uniques || 0} Únicos)
                            </span>
                        </div>
                        <div className="space-y-0.5 border-l border-slate-700 pl-3">
                            <span className="block text-[10px] text-cyan-400">
                                Gemini: {data[hoveredIdx].gemini}
                            </span>
                            <span className="block text-[10px] text-amber-400">
                                Local: {data[hoveredIdx].deterministic}
                            </span>
                            <span className="block text-[10px] text-emerald-400">
                                WhatsApp: {data[hoveredIdx].whatsapp || 0}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
