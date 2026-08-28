import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function PediatricCalculator() {
    const [weight, setWeight] = useState<string>('');
    const [dosage, setDosage] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const calculate = () => {
        if (!weight) return;
        setLoading(true);
        // Mock logic: 15mg per kg
        setTimeout(() => {
            setDosage(parseFloat(weight) * 15);
            setLoading(false);
        }, 600);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
                <Calculator className="h-6 w-6" />
                <h3 className="text-xl font-bold">Calculadora de Dosis Pediátrica</h3>
            </div>
            
            <div className="p-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Peso del Paciente (kg)
                        </label>
                        <input 
                            type="number" 
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Ej: 12.5"
                            className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button 
                        onClick={calculate}
                        disabled={loading || !weight}
                        className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white hover:bg-blue-500 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : 'Calcular Dosis Recomendada'}
                    </button>

                    {dosage !== null && !loading && (
                        <div className="mt-8 rounded-2xl bg-blue-50 p-6 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-blue-600 mt-1" />
                                <div>
                                    <span className="text-sm font-bold text-blue-800 uppercase">Resultado Sugerido</span>
                                    <div className="text-3xl font-black text-blue-900 mt-1">
                                        {dosage} <span className="text-lg font-normal">mg / día</span>
                                    </div>
                                    <p className="mt-2 text-sm text-blue-600 leading-relaxed italic">
                                        *Este es un cálculo de referencia basado en protocolos estándar. Consulte siempre la etiqueta del producto.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex items-start gap-2 text-slate-400 bg-slate-50 p-4 rounded-xl text-xs">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p>Los cálculos realizados por esta herramienta IA son para uso exclusivo de profesionales de la salud capacitados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
