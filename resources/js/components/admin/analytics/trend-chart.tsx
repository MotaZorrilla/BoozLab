import React, { useState } from 'react';

interface ChartPoint {
    date: string;
    label: string;
    sessions: number;
    gemini: number;
    deterministic: number;
}

interface TrendChartProps {
    data: ChartPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-52 text-slate-400 dark:text-slate-500 text-sm">
                No hay suficientes datos de sesiones para graficar.
            </div>
        );
    }

    const maxVal = Math.max(...data.map(d => Math.max(d.sessions, d.gemini, d.deterministic, 1)), 5);

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
    const sessionPoints = data.map((d, i) => `${getX(i)},${getY(d.sessions)}`).join(' ');
    const geminiPoints = data.map((d, i) => `${getX(i)},${getY(d.gemini)}`).join(' ');
    const detPoints = data.map((d, i) => `${getX(i)},${getY(d.deterministic)}`).join(' ');

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                        Sesiones Totales
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
                        Inferencia Gemini
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        Motor Determinista
                    </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-mono">Últimos 7 días</span>
            </div>

            <div className="relative w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-44 sm:h-52 overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Líneas horizontales de guía */}
                    {[0, 0.5, 1].map((ratio, idx) => {
                        const y = height - paddingY - ratio * (height - paddingY * 2);
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
                                    className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono"
                                >
                                    {val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Línea Sesiones Totales (Azul) */}
                    <polyline
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={sessionPoints}
                    />

                    {/* Línea Gemini (Cian) */}
                    <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={geminiPoints}
                    />

                    {/* Línea Determinista (Esmeralda) */}
                    <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={detPoints}
                    />

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
                                    className="fill-blue-600 stroke-white dark:stroke-slate-900 stroke-2"
                                />
                                <text
                                    x={cx}
                                    y={height - 6}
                                    textAnchor="middle"
                                    className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium"
                                >
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip flotante */}
                {hoveredIdx !== null && data[hoveredIdx] && (
                    <div
                        className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700 pointer-events-none z-10 flex gap-3 font-mono"
                    >
                        <div>
                            <span className="block text-slate-400 text-[10px]">{data[hoveredIdx].label}</span>
                            <span className="font-bold text-blue-400">{data[hoveredIdx].sessions} Sesiones</span>
                        </div>
                        <div className="border-l border-slate-700 pl-3">
                            <span className="block text-cyan-400 text-[10px]">Gemini: {data[hoveredIdx].gemini}</span>
                            <span className="block text-emerald-400 text-[10px]">Det.: {data[hoveredIdx].deterministic}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
