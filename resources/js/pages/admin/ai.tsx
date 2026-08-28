import { Head, useForm } from '@inertiajs/react';
import { Bot, Key, Sparkles, Send, CheckCircle2, AlertTriangle, Clock, RefreshCw, Eye, EyeOff, Save, ShieldAlert, Cpu } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface AiPageProps {
    aiConfig: {
        hasKey: boolean;
        maskedKey: string;
        model: string;
        systemPrompt: string;
    };
    corpusStats: {
        total_products: number;
        active_products: number;
        prescription_products: number;
        lines_count: number;
    };
}

export default function AdminAi({ aiConfig, corpusStats }: AiPageProps) {
    const [showKey, setShowKey] = useState(false);
    const [testQuery, setTestQuery] = useState('¿Para qué sirve Bactrocis y cuál es su posología?');
    const [testResult, setTestResult] = useState<any>(null);
    const [isTesting, setIsTesting] = useState(false);

    const configForm = useForm({
        gemini_api_key: '',
        gemini_model: aiConfig.model || 'gemini-2.5-flash',
        lira_system_prompt: aiConfig.systemPrompt || '',
    });

    const handleConfigSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        configForm.put('/admin/ai', {
            preserveScroll: true,
        });
    };

    const handleRunTest = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!testQuery.trim() || isTesting) return;

        setIsTesting(true);
        setTestResult(null);

        try {
            const res = await fetch('/admin/ai/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                },
                body: JSON.stringify({ message: testQuery }),
            });

            const data = await res.json();
            setTestResult(data);
        } catch (err: any) {
            setTestResult({
                success: false,
                error: 'Error de red o timeout al comunicar con el servidor.',
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Inteligencia Artificial', href: '/admin/ai' }]}>
            <Head title="Consola de Inteligencia Artificial (Lira AI) | Booz Laboratorio" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400">
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Consola de Inteligencia Artificial & Lira AI
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de credenciales Google Gemini, inyección del corpus clínico de 18 productos y simulador en vivo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Split-View de Alta Densidad */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* PANEL IZQUIERDO: CONFIGURACIÓN (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {configForm.recentlySuccessful && (
                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Ajustes de Inteligencia Artificial guardados correctamente.</span>
                            </div>
                        )}

                        <form onSubmit={handleConfigSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Key className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                    <span>Credenciales y Modelo LLM</span>
                                </h2>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                    aiConfig.hasKey 
                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' 
                                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                                }`}>
                                    {aiConfig.hasKey ? '● API Key Activa' : 'Modo Determinista'}
                                </span>
                            </div>

                            {/* API Key Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Clave de API Google Gemini (AI Studio)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? 'text' : 'password'}
                                        value={configForm.data.gemini_api_key}
                                        onChange={(e) => configForm.setData('gemini_api_key', e.target.value)}
                                        placeholder={aiConfig.maskedKey || 'Ingresa tu API Key (AIzaSy...)'}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 pl-3 pr-10 focus:ring-2 focus:ring-blue-600 outline-none font-mono transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                    {aiConfig.hasKey 
                                        ? `Clave registrada (${aiConfig.maskedKey}). Deja este campo vacío si deseas mantenerla.`
                                        : 'Sin clave registrada. El sistema opera mediante el motor clínico local determinista.'}
                                </p>
                            </div>

                            {/* Modelo Selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Modelo de Inferencia Activo
                                </label>
                                <select
                                    value={configForm.data.gemini_model}
                                    onChange={(e) => configForm.setData('gemini_model', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                >
                                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado - Baja latencia y alta precisión clínica)</option>
                                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Respaldo)</option>
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Máximo razonamiento)</option>
                                </select>
                            </div>

                            {/* Editor de System Prompt */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Personalidad & Directriz Base (System Prompt)
                                    </label>
                                    <span className="text-[10px] text-slate-400">Personalizable</span>
                                </div>
                                <textarea
                                    rows={4}
                                    value={configForm.data.lira_system_prompt}
                                    onChange={(e) => configForm.setData('lira_system_prompt', e.target.value)}
                                    placeholder="Instrucciones base para Lira..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors leading-relaxed font-sans"
                                />
                                <div className="mt-1.5 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300">
                                    <strong className="text-blue-700 dark:text-cyan-400">🛡️ Guardrails Inmutables:</strong> El backend concatena automáticamente las reglas de Cero Automedicación, Venta bajo Récipe Médico y los 18 fármacos clasificados por sus 4 líneas para evitar manipulaciones accidentales.
                                </div>
                            </div>

                            {/* Botón Guardar */}
                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={configForm.processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{configForm.processing ? 'Guardando...' : 'Guardar Ajustes de IA'}</span>
                                </button>
                            </div>
                        </form>

                        {/* Telemetría del Corpus */}
                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                <span>Estado del Corpus Farmacéutico Dinámico</span>
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="text-base font-black text-[#002072] dark:text-cyan-400">{corpusStats.total_products}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Fármacos Totales</div>
                                </div>
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{corpusStats.active_products}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Activos en IA</div>
                                </div>
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="text-base font-black text-amber-600 dark:text-amber-400">{corpusStats.prescription_products}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Bajo Récipe</div>
                                </div>
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="text-base font-black text-purple-600 dark:text-purple-400">{corpusStats.lines_count}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Líneas Oficiales</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PANEL DERECHO: SIMULADOR Y PLAYGROUND CLÍNICO (5 cols) */}
                    <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                <span>Simulador Clínico en Vivo</span>
                            </h2>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                                Entorno de Prueba
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Prueba preguntas complejas o consultas comerciales para validar la coherencia y latencia de respuesta antes de ponerlas a disposición del público.
                        </p>

                        {/* Escenarios Rápidos */}
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                '¿Qué tienen para el pie diabético?',
                                '¿Cuál es la dosis de Albemer en niños?',
                                'Quiero contactar al administrador para cotizar al mayor',
                            ].map((sample) => (
                                <button
                                    key={sample}
                                    type="button"
                                    onClick={() => {
                                        setTestQuery(sample);
                                    }}
                                    className="text-[10px] font-semibold py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-left"
                                >
                                    {sample.substring(0, 32)}...
                                </button>
                            ))}
                        </div>

                        {/* Input de Prueba */}
                        <form onSubmit={handleRunTest} className="space-y-3 pt-2">
                            <div>
                                <textarea
                                    rows={2}
                                    value={testQuery}
                                    onChange={(e) => setTestQuery(e.target.value)}
                                    placeholder="Escribe una pregunta para Lira..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs p-3 focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isTesting || !testQuery.trim()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isTesting ? (
                                        <>
                                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                            <span>Evaluando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-3.5 w-3.5" />
                                            <span>Probar Conexión & Respuesta</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Resultado de la Prueba */}
                        {testResult && (
                            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in fade-in">
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        {testResult.success ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-emerald-700 dark:text-emerald-300">Respuesta Exitosa</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                <span className="text-red-700 dark:text-red-300">Error de Ejecución</span>
                                            </>
                                        )}
                                    </div>

                                    {testResult.latency_ms !== undefined && (
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            <span>{testResult.latency_ms} ms</span>
                                        </div>
                                    )}
                                </div>

                                {testResult.success ? (
                                    <div className="space-y-2">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                            Origen: <span className="text-slate-700 dark:text-slate-200">{testResult.source}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-xs">
                                            {testResult.response}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                                        {testResult.error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
