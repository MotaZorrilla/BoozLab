import { Calculator, AlertCircle, CheckCircle2, Scale, Clock, Baby, HelpCircle, ShieldAlert } from 'lucide-react';
import React, { useState, useMemo } from 'react';

type CalculationMethod = 'clark' | 'weighted' | 'young';

export default function PediatricCalculator() {
    const [method, setMethod] = useState<CalculationMethod>('clark');

    // Estado para Regla de Clark
    const [clarkWeight, setClarkWeight] = useState<string>('');
    const [clarkAdultDose, setClarkAdultDose] = useState<string>('500');

    // Estado para Régimen Ponderado (mg/kg/día)
    const [weightedWeight, setWeightedWeight] = useState<string>('');
    const [weightedRegimen, setWeightedRegimen] = useState<string>('15');
    const [weightedDosesPerDay, setWeightedDosesPerDay] = useState<number>(2); // 2 = cada 12h

    // Estado para Regla de Young
    const [youngAge, setYoungAge] = useState<string>('');
    const [youngAdultDose, setYoungAdultDose] = useState<string>('400');

    // Presets pediátricos de referencia rápida
    const handleSelectPreset = (regimen: string, doses: number) => {
        setMethod('weighted');
        setWeightedRegimen(regimen);
        setWeightedDosesPerDay(doses);
    };

    // Cálculos clínicos deterministas (SPEC.md §3)
    const calculationResult = useMemo(() => {
        if (method === 'clark') {
            const w = parseFloat(clarkWeight);
            const dAdult = parseFloat(clarkAdultDose);
            if (isNaN(w) || w <= 0 || isNaN(dAdult) || dAdult <= 0) return null;

            // Dped = (Pkg / 70) * Dadulto
            const result = (w / 70.0) * dAdult;
            return {
                primary: Math.round(result * 10) / 10,
                unit: 'mg / dosis',
                formula: `Dosis = (${w} kg / 70) × ${dAdult} mg`,
                description: 'Cálculo basado en la Regla estándar de Clark para ajuste ponderal sobre la dosis de adulto (70 kg).',
                warning: w > 60 ? 'Paciente con peso cercano al adulto (≥60 kg). Evaluar empleo de dosis completa de adulto.' : null,
            };
        }

        if (method === 'weighted') {
            const w = parseFloat(weightedWeight);
            const r = parseFloat(weightedRegimen);
            if (isNaN(w) || w <= 0 || isNaN(r) || r <= 0) return null;

            // Ddiaria = Pkg * R(mg/kg)
            const dailyTotal = w * r;
            const perDose = dailyTotal / weightedDosesPerDay;
            const hoursInterval = 24 / weightedDosesPerDay;

            return {
                primary: Math.round(perDose * 10) / 10,
                unit: `mg cada ${hoursInterval} horas`,
                secondary: `${Math.round(dailyTotal * 10) / 10} mg / día total`,
                formula: `Dosis diaria = ${w} kg × ${r} mg/kg = ${Math.round(dailyTotal * 10) / 10} mg/día dividido en ${weightedDosesPerDay} tomas`,
                description: `Posología ajustada por régimen ponderado diario de ${r} mg/kg/día fraccionado en ${weightedDosesPerDay} tomas cada ${hoursInterval} horas.`,
                warning: null,
            };
        }

        if (method === 'young') {
            const age = parseFloat(youngAge);
            const dAdult = parseFloat(youngAdultDose);
            if (isNaN(age) || age <= 0 || isNaN(dAdult) || dAdult <= 0) return null;

            // Dped = [Eaños / (Eaños + 12)] * Dadulto
            const result = (age / (age + 12.0)) * dAdult;
            return {
                primary: Math.round(result * 10) / 10,
                unit: 'mg / dosis estimada',
                formula: `Dosis = [${age} años / (${age} + 12)] × ${dAdult} mg`,
                description: 'Regla de Young aplicada para niños entre 1 y 12 años sin disponibilidad de báscula de pesaje.',
                warning: age < 1 || age > 12 ? 'La Regla de Young está calibrada estrictamente para pacientes de 1 a 12 años de edad.' : null,
            };
        }

        return null;
    }, [method, clarkWeight, clarkAdultDose, weightedWeight, weightedRegimen, weightedDosesPerDay, youngAge, youngAdultDose]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-w-2xl mx-auto transition-colors">
            {/* Encabezado Clínico Oficial */}
            <div className="bg-[#002072] dark:bg-blue-950 p-6 text-white flex items-center justify-between border-b border-blue-900/40">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
                        <Calculator className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Calculadora de Dosis Pediátrica</h3>
                        <p className="text-xs text-blue-200 font-medium">Algoritmos Clínicos de Clark, Young y Régimen Ponderado</p>
                    </div>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                    Vademécum Booz
                </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
                {/* Selector de Método Farmacológico */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Selecciona el Método de Cálculo Clínico:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => setMethod('clark')}
                            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                method === 'clark'
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 text-[#002072] dark:text-cyan-400 shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            <Scale className="h-4 w-4" />
                            <span>Regla de Clark</span>
                            <span className="text-[9px] font-normal text-slate-400">Por Peso (kg)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod('weighted')}
                            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                method === 'weighted'
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 text-[#002072] dark:text-cyan-400 shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            <Clock className="h-4 w-4" />
                            <span>mg / kg / día</span>
                            <span className="text-[9px] font-normal text-slate-400">Régimen Diario</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod('young')}
                            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                method === 'young'
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 text-[#002072] dark:text-cyan-400 shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            <Baby className="h-4 w-4" />
                            <span>Regla de Young</span>
                            <span className="text-[9px] font-normal text-slate-400">Por Edad (Años)</span>
                        </button>
                    </div>
                </div>

                {/* Formulario Dinámico según Método */}
                {method === 'clark' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Peso del Paciente (kg) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={clarkWeight}
                                    onChange={(e) => setClarkWeight(e.target.value)}
                                    placeholder="Ej: 21.0"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Dosis Adulto de Referencia (mg) *
                                </label>
                                <input
                                    type="number"
                                    step="10"
                                    value={clarkAdultDose}
                                    onChange={(e) => setClarkAdultDose(e.target.value)}
                                    placeholder="Ej: 500"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {method === 'weighted' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        {/* Atajos de presets clínicos */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                            <span className="text-slate-400 font-bold shrink-0">Atajos clínicos:</span>
                            <button
                                type="button"
                                onClick={() => handleSelectPreset('15', 2)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 font-medium transition-colors shrink-0 cursor-pointer"
                            >
                                Albemer / Antiparasitario (15 mg/kg c/12h)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSelectPreset('10', 3)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 font-medium transition-colors shrink-0 cursor-pointer"
                            >
                                Analgésico infantil (10 mg/kg c/8h)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Peso del Paciente (kg) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={weightedWeight}
                                    onChange={(e) => setWeightedWeight(e.target.value)}
                                    placeholder="Ej: 16.0"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Régimen (mg / kg / día) *
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={weightedRegimen}
                                    onChange={(e) => setWeightedRegimen(e.target.value)}
                                    placeholder="Ej: 15"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Frecuencia de Tomas *
                                </label>
                                <select
                                    value={weightedDosesPerDay}
                                    onChange={(e) => setWeightedDosesPerDay(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value={1}>1 toma al día (cada 24h)</option>
                                    <option value={2}>2 tomas al día (cada 12h)</option>
                                    <option value={3}>3 tomas al día (cada 8h)</option>
                                    <option value={4}>4 tomas al día (cada 6h)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {method === 'young' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Edad del Niño (Años: 1 a 12) *
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    max="12"
                                    value={youngAge}
                                    onChange={(e) => setYoungAge(e.target.value)}
                                    placeholder="Ej: 4"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Dosis Adulto de Referencia (mg) *
                                </label>
                                <input
                                    type="number"
                                    step="10"
                                    value={youngAdultDose}
                                    onChange={(e) => setYoungAdultDose(e.target.value)}
                                    placeholder="Ej: 400"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel de Resultados Clínicos Reactivo */}
                {calculationResult ? (
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-blue-950/40 p-6 border border-blue-200/80 dark:border-blue-800/60 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-cyan-400">
                                    Dosis Pediátrica Recomendada
                                </span>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {calculationResult.primary}
                                    </span>
                                    <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-cyan-400">
                                        {calculationResult.unit}
                                    </span>
                                    {calculationResult.secondary && (
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold ml-2">
                                            {calculationResult.secondary}
                                        </span>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-blue-200/50 dark:border-slate-700 space-y-1">
                                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
                                        {calculationResult.formula}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {calculationResult.description}
                                    </p>
                                </div>

                                {calculationResult.warning && (
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{calculationResult.warning}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400 dark:text-slate-500 text-xs">
                        <HelpCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        Ingresa los parámetros clínicos arriba para calcular la dosificación de forma instantánea.
                    </div>
                )}

                {/* Descargo Ético & Regulatorio INH */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldAlert className="h-4 w-4 text-[#002072] dark:text-cyan-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <strong>Aviso Farmacológico Oficial (INH Rafael Rangel):</strong> Esta calculadora es una herramienta de referencia matemática orientada exclusivamente a profesionales de la salud. Los cálculos no reemplazan el juicio médico clínico ni la valoración de la función renal y hepática del paciente.
                    </p>
                </div>
            </div>
        </div>
    );
}
