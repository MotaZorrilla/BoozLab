import { Head, useForm, router } from '@inertiajs/react';
import {
    Bot,
    Key,
    Sparkles,
    Send,
    CheckCircle2,
    Eye,
    EyeOff,
    Save,
    ShieldAlert,
    BookOpen,
    Plus,
    Trash2,
    Edit3,
    FileUp,
} from 'lucide-react';
import React, { useState } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';

interface KnowledgeDocument {
    id: number;
    title: string;
    slug: string;
    category:
        | 'vademecum'
        | 'farmacovigilancia'
        | 'comercial'
        | 'protocolo'
        | 'general';
    content: string;
    file_name?: string;
    file_path?: string;
    file_size_bytes: number;
    is_active: boolean;
    order: number;
    updated_at: string;
}

interface Guardrail {
    id: number;
    name: string;
    slug: string;
    type: 'bloqueo_estricto' | 'advertencia_sanitaria' | 'derivacion_humana';
    rule_instruction: string;
    is_active: boolean;
    is_system: boolean;
    order: number;
}

interface TestResult {
    success?: boolean;
    error?: string;
    response?: string;
    suggestedProducts?: { id: number | string; name: string }[];
    latencyMs?: number;
    tokens?: { prompt: number; completion: number; total: number };
    guardrailTriggered?: string | null;
    [key: string]: unknown;
}

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
        documents_count: number;
        active_documents_count: number;
        guardrails_count: number;
        active_guardrails_count: number;
    };
    knowledgeDocuments: KnowledgeDocument[];
    guardrails: Guardrail[];
}

export default function AdminAi({
    aiConfig,
    corpusStats,
    knowledgeDocuments = [],
    guardrails = [],
}: AiPageProps) {
    const [activeTab, setActiveTab] = useState<
        'config' | 'knowledge' | 'guardrails' | 'playground'
    >('knowledge');
    const [showKey, setShowKey] = useState(false);

    // Playground State
    const [testQuery, setTestQuery] = useState(
        '¿Para qué sirve Bactrocis y cuál es el procedimiento si un paciente presenta una reacción adversa?',
    );
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    // Modales de Documentos
    const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<KnowledgeDocument | null>(
        null,
    );
    const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(
        null,
    );
    const [deletingDoc, setDeletingDoc] = useState<KnowledgeDocument | null>(
        null,
    );

    // Modales de Guardrails
    const [isCreateGuardrailOpen, setIsCreateGuardrailOpen] = useState(false);
    const [editingGuardrail, setEditingGuardrail] = useState<Guardrail | null>(
        null,
    );
    const [deletingGuardrail, setDeletingGuardrail] =
        useState<Guardrail | null>(null);

    // Formulario de Configuración General
    const configForm = useForm({
        gemini_api_key: '',
        gemini_model: aiConfig.model || 'gemini-2.5-flash',
        lira_system_prompt: aiConfig.systemPrompt || '',
    });

    // Formulario de Creación de Documento
    const createDocForm = useForm({
        title: '',
        category: 'vademecum',
        content: '',
        file: null as File | null,
    });

    // Formulario de Edición de Documento
    const editDocForm = useForm({
        title: '',
        category: 'vademecum',
        content: '',
        is_active: true,
    });

    // Formulario de Creación de Guardrail
    const createGuardrailForm = useForm({
        name: '',
        type: 'advertencia_sanitaria',
        rule_instruction: '',
    });

    // Formulario de Edición de Guardrail
    const editGuardrailForm = useForm({
        name: '',
        type: 'advertencia_sanitaria',
        rule_instruction: '',
        is_active: true,
    });

    // Handlers
    const handleConfigSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        configForm.put('/admin/ai', { preserveScroll: true });
    };

    const handleCreateDocSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createDocForm.post('/admin/ai/documents', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateDocOpen(false);
                createDocForm.reset();
            },
        });
    };

    const handleOpenEditDoc = (doc: KnowledgeDocument) => {
        setEditingDoc(doc);
        editDocForm.setData({
            title: doc.title,
            category: doc.category,
            content: doc.content,
            is_active: doc.is_active,
        });
    };

    const handleEditDocSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDoc) return;
        editDocForm.put(`/admin/ai/documents/${editingDoc.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingDoc(null),
        });
    };

    const handleToggleDoc = (doc: KnowledgeDocument) => {
        router.post(
            `/admin/ai/documents/${doc.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDeleteDocConfirm = () => {
        if (!deletingDoc) return;
        router.delete(`/admin/ai/documents/${deletingDoc.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingDoc(null),
        });
    };

    // Guardrails Handlers
    const handleCreateGuardrailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createGuardrailForm.post('/admin/ai/guardrails', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateGuardrailOpen(false);
                createGuardrailForm.reset();
            },
        });
    };

    const handleOpenEditGuardrail = (guardrail: Guardrail) => {
        setEditingGuardrail(guardrail);
        editGuardrailForm.setData({
            name: guardrail.name,
            type: guardrail.type,
            rule_instruction: guardrail.rule_instruction,
            is_active: guardrail.is_active,
        });
    };

    const handleEditGuardrailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGuardrail) return;
        editGuardrailForm.put(`/admin/ai/guardrails/${editingGuardrail.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingGuardrail(null),
        });
    };

    const handleToggleGuardrail = (guardrail: Guardrail) => {
        router.post(
            `/admin/ai/guardrails/${guardrail.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDeleteGuardrailConfirm = () => {
        if (!deletingGuardrail) return;
        router.delete(`/admin/ai/guardrails/${deletingGuardrail.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingGuardrail(null),
        });
    };

    // Playground Execution
    const handleRunTest = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!testQuery.trim() || isTesting) return;

        setIsTesting(true);
        setTestResult(null);

        try {
            // Helper para obtener cookie XSRF-TOKEN si la meta tag no está o desfasada
            const getXsrfToken = () => {
                const match = document.cookie.match(
                    new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'),
                );
                return match ? decodeURIComponent(match[2]) : '';
            };

            const metaToken =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                )?.content || '';
            const xsrfCookie = getXsrfToken();

            const res = await fetch('/admin/ai/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(metaToken ? { 'X-CSRF-TOKEN': metaToken } : {}),
                    ...(xsrfCookie ? { 'X-XSRF-TOKEN': xsrfCookie } : {}),
                },
                body: JSON.stringify({ message: testQuery }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                setTestResult({
                    success: false,
                    error:
                        errorData?.message ||
                        `Error del servidor (${res.status}): No se pudo procesar la prueba.`,
                });
                return;
            }

            const data = await res.json();
            setTestResult(data);
        } catch {
            setTestResult({
                success: false,
                error: 'Error de conexión o timeout al comunicar con el servidor.',
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
                { title: 'Inteligencia Artificial', href: '/admin/ai' },
            ]}
        >
            <Head title="Centro de Entrenamiento y Guardrails de IA | Booz Laboratorio" />

            <div className="mx-auto max-w-7xl space-y-6 p-3 sm:p-6 lg:p-8 2xl:max-w-[1600px] 3xl:max-w-[1880px]">
                {/* Cabecera Principal */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-2xl bg-cyan-50 p-2.5 text-[#002072] dark:bg-cyan-950/40 dark:text-cyan-400">
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Centro de Entrenamiento & Guardrails de Lira AI
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de la base de conocimiento documental
                                RAG, reglas de contención sanitarias y modelo
                                Google Gemini.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ${
                                aiConfig.hasKey
                                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                        >
                            <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                            <span>
                                {aiConfig.hasKey
                                    ? `Gemini Activo (${aiConfig.model})`
                                    : 'Motor Determinista Local'}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Resumen de Telemetría */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-[11px] font-bold text-slate-400 uppercase">
                            Documentos en Corpus
                        </div>
                        <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                            {corpusStats.active_documents_count} /{' '}
                            {corpusStats.documents_count}
                        </div>
                        <div className="mt-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Entrenando a Lira
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-[11px] font-bold text-slate-400 uppercase">
                            Guardrails Sanitarios
                        </div>
                        <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                            {corpusStats.active_guardrails_count} /{' '}
                            {corpusStats.guardrails_count}
                        </div>
                        <div className="mt-0.5 text-[10px] font-semibold text-blue-600 dark:text-cyan-400">
                            Reglas de Contención
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-[11px] font-bold text-slate-400 uppercase">
                            Fármacos en Vademécum
                        </div>
                        <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                            {corpusStats.active_products}
                        </div>
                        <div className="mt-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                            En 4 Líneas Oficiales
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-[11px] font-bold text-slate-400 uppercase">
                            Fórmulas Bajo Récipe
                        </div>
                        <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                            {corpusStats.prescription_products}
                        </div>
                        <div className="mt-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            Antibióticos / Esteroides
                        </div>
                    </div>
                </div>

                {/* Navegación por Pestañas de Control */}
                <div className="scrollbar-none flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('knowledge')}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition-all ${
                            activeTab === 'knowledge'
                                ? 'bg-[#002072] text-white shadow-sm dark:bg-blue-600'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        <span>
                            Base de Conocimiento & Documentos RAG (
                            {knowledgeDocuments.length})
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('guardrails')}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition-all ${
                            activeTab === 'guardrails'
                                ? 'bg-[#002072] text-white shadow-sm dark:bg-blue-600'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                    >
                        <ShieldAlert className="h-4 w-4" />
                        <span>
                            Guardrails Sanitarios & Contención (
                            {guardrails.length})
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('playground')}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition-all ${
                            activeTab === 'playground'
                                ? 'bg-[#002072] text-white shadow-sm dark:bg-blue-600'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Simulador & Playground en Vivo</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('config')}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition-all ${
                            activeTab === 'config'
                                ? 'bg-[#002072] text-white shadow-sm dark:bg-blue-600'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                    >
                        <Key className="h-4 w-4" />
                        <span>Motor Gemini & Directriz Base</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* PESTAÑA 1: BASE DE CONOCIMIENTO & DOCUMENTOS DE ENTRENAMIENTO */}
                {/* ========================================================================= */}
                {activeTab === 'knowledge' && (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                    Corpus Clínico & Documentos Activos
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Cada documento activo se inyecta
                                    dinámicamente en el contexto de Lira para
                                    responder con precisión oficial.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsCreateDocOpen(true)}
                                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-[#002072] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-800 dark:bg-blue-600"
                            >
                                <FileUp className="h-4 w-4" />
                                <span>+ Cargar Nuevo Documento</span>
                            </button>
                        </div>

                        {/* Listado de Documentos */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {knowledgeDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className={`flex flex-col justify-between rounded-3xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-900 ${
                                        doc.is_active
                                            ? 'border-slate-200 dark:border-slate-800'
                                            : 'border-slate-200/60 opacity-60 dark:border-slate-800/60'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <span
                                                className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                    doc.category === 'vademecum'
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-cyan-300'
                                                        : doc.category ===
                                                            'farmacovigilancia'
                                                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                                          : doc.category ===
                                                              'comercial'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                }`}
                                            >
                                                {doc.category}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleDoc(doc)
                                                }
                                                className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                                                    doc.is_active
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}
                                                title="Activar o desactivar documento para el entrenamiento"
                                            >
                                                {doc.is_active
                                                    ? '● Entrenando a Lira'
                                                    : '○ Pausado'}
                                            </button>
                                        </div>

                                        <div>
                                            <h4 className="text-sm leading-snug font-bold text-slate-900 dark:text-white">
                                                {doc.title}
                                            </h4>
                                            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-400">
                                                <span>
                                                    {(
                                                        doc.file_size_bytes /
                                                        1024
                                                    ).toFixed(1)}{' '}
                                                    KB
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {doc.content.length.toLocaleString()}{' '}
                                                    caracteres
                                                </span>
                                            </div>
                                        </div>

                                        <p className="line-clamp-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5 font-mono text-xs text-[11px] leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                                            {doc.content.substring(0, 180)}...
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setViewingDoc(doc)}
                                            className="cursor-pointer text-[11px] font-bold text-blue-600 hover:underline dark:text-cyan-400"
                                        >
                                            Ver Contenido Completo →
                                        </button>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenEditDoc(doc)
                                                }
                                                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                                                title="Editar documento"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeletingDoc(doc)
                                                }
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                                title="Eliminar documento"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* PESTAÑA 2: GUARDRAILS SANITARIOS & REGLAS DE CONTENCIÓN */}
                {/* ========================================================================= */}
                {activeTab === 'guardrails' && (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                    Guardrails Sanitarios & Reglas de Contención
                                    Activas
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Límites regulatorios y éticos que Lira nunca
                                    puede violar en sus conversaciones con los
                                    pacientes y clientes.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsCreateGuardrailOpen(true)}
                                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-[#002072] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-800 dark:bg-blue-600"
                            >
                                <Plus className="h-4 w-4" />
                                <span>+ Nuevo Guardrail</span>
                            </button>
                        </div>

                        {/* Listado de Guardrails */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {guardrails.map((g) => (
                                <div
                                    key={g.id}
                                    className={`flex flex-col justify-between rounded-3xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-900 ${
                                        g.is_active
                                            ? 'border-slate-200 dark:border-slate-800'
                                            : 'border-slate-200/60 opacity-60 dark:border-slate-800/60'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <span
                                                className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                    g.type ===
                                                    'bloqueo_estricto'
                                                        ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : g.type ===
                                                            'advertencia_sanitaria'
                                                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-cyan-300'
                                                }`}
                                            >
                                                {g.type.replace('_', ' ')}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                {g.is_system && (
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:bg-slate-800">
                                                        Sistema
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleGuardrail(g)
                                                    }
                                                    className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                                                        g.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}
                                                >
                                                    {g.is_active
                                                        ? '● Activo'
                                                        : '○ Inactivo'}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {g.name}
                                            </h4>
                                        </div>

                                        <p className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                                            {g.rule_instruction}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenEditGuardrail(g)
                                            }
                                            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                                            title="Editar guardrail"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </button>

                                        {!g.is_system && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeletingGuardrail(g)
                                                }
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                                title="Eliminar guardrail"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* PESTAÑA 3: SIMULADOR & PLAYGROUND EN VIVO */}
                {/* ========================================================================= */}
                {activeTab === 'playground' && (
                    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                                <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                <span>
                                    Simulador Interactivo de Respuestas de Lira
                                    AI
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500">
                                Prueba cómo responderá Lira al integrar los
                                documentos de entrenamiento y los guardrails
                                sanitarios activos.
                            </p>
                        </div>

                        <form onSubmit={handleRunTest} className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Pregunta o Consulta de Prueba para Lira:
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={testQuery}
                                        onChange={(e) =>
                                            setTestQuery(e.target.value)
                                        }
                                        placeholder="Ej: ¿Qué medicamento tienen para pie diabético y cómo lo pido?"
                                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTesting}
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-cyan-500 disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>
                                            {isTesting
                                                ? 'Consultando...'
                                                : 'Probar'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Respuestas de ejemplo rápidas */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="font-bold text-slate-400">
                                Consultas frecuentes de prueba:
                            </span>
                            {[
                                '¿Qué tienen para el pie diabético?',
                                '¿Cómo reporto un lote en Farmacovigilancia?',
                                '¿Cómo cotizar al mayor para una farmacia?',
                                'Tengo una infección fuerte en la piel, ¿qué tomo?',
                            ].map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setTestQuery(q)}
                                    className="cursor-pointer rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Resultado de la Prueba */}
                        {testResult && (
                            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>
                                            Respuesta de Lira AI (
                                            {testResult.source}):
                                        </span>
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-400">
                                        {testResult.latency_ms} ms
                                    </span>
                                </div>
                                <div
                                    className="rounded-xl border border-slate-100 bg-white p-3.5 text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            testResult.response ||
                                            testResult.error,
                                    }}
                                />
                                {testResult.suggestedProducts &&
                                    testResult.suggestedProducts.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-1.5 dark:border-slate-700/60">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                Productos Vinculados:
                                            </span>
                                            {testResult.suggestedProducts.map(
                                                (p) => (
                                                    <span
                                                        key={p.id}
                                                        className="rounded-lg bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/40 dark:text-cyan-300"
                                                    >
                                                        {p.name}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}
                                {testResult.disclaimer && (
                                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
                                        {testResult.disclaimer}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================================================= */}
                {/* PESTAÑA 4: MOTOR GEMINI & DIRECTRIZ BASE */}
                {/* ========================================================================= */}
                {activeTab === 'config' && (
                    <form
                        onSubmit={handleConfigSubmit}
                        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                                <Key className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>
                                    Parámetros de Inferencia Google Gemini
                                </span>
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Clave de API Google Gemini
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? 'text' : 'password'}
                                        value={configForm.data.gemini_api_key}
                                        onChange={(e) =>
                                            configForm.setData(
                                                'gemini_api_key',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={
                                            aiConfig.maskedKey ||
                                            'Ingresa tu API Key (AIzaSy...)'
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 font-mono text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute top-2.5 right-3 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        {showKey ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Modelo LLM
                                </label>
                                <select
                                    value={configForm.data.gemini_model}
                                    onChange={(e) =>
                                        configForm.setData(
                                            'gemini_model',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="gemini-2.5-flash">
                                        Gemini 2.5 Flash (Recomendado - Baja
                                        latencia)
                                    </option>
                                    <option value="gemini-1.5-flash">
                                        Gemini 1.5 Flash (Respaldo)
                                    </option>
                                    <option value="gemini-1.5-pro">
                                        Gemini 1.5 Pro (Máxima capacidad)
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                Personalidad & Directriz Base (System Prompt)
                            </label>
                            <textarea
                                rows={4}
                                value={configForm.data.lira_system_prompt}
                                onChange={(e) =>
                                    configForm.setData(
                                        'lira_system_prompt',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white p-3 font-sans text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={configForm.processing}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#002072] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600"
                            >
                                <Save className="h-4 w-4" />
                                <span>
                                    {configForm.processing
                                        ? 'Guardando...'
                                        : 'Guardar Ajustes'}
                                </span>
                            </button>
                        </div>
                    </form>
                )}

                {/* ========================================================================= */}
                {/* MODALES: CREAR Y EDITAR DOCUMENTO DE ENTRENAMIENTO */}
                {/* ========================================================================= */}
                <Modal
                    isOpen={isCreateDocOpen}
                    show={isCreateDocOpen}
                    onClose={() => setIsCreateDocOpen(false)}
                    title="Cargar Documento de Entrenamiento (Corpus RAG)"
                >
                    <form
                        onSubmit={handleCreateDocSubmit}
                        className="max-h-[80vh] space-y-4 overflow-y-auto pr-1"
                    >
                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Título del Documento *
                            </label>
                            <input
                                type="text"
                                required
                                value={createDocForm.data.title}
                                onChange={(e) =>
                                    createDocForm.setData(
                                        'title',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej: Vademécum Completo Línea Tópica Booz"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Categoría Temática *
                                </label>
                                <select
                                    value={createDocForm.data.category}
                                    onChange={(e) =>
                                        createDocForm.setData(
                                            'category',
                                            e.target
                                                .value as KnowledgeDocument['category'],
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="vademecum">
                                        Vademécum & Fórmulas Clínicas
                                    </option>
                                    <option value="farmacovigilancia">
                                        Farmacovigilancia & RAM INH
                                    </option>
                                    <option value="comercial">
                                        Comercial, Cotizaciones & Envíos
                                    </option>
                                    <option value="protocolo">
                                        Protocolo & Atención al Paciente
                                    </option>
                                    <option value="general">
                                        Información General del Laboratorio
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Subir Archivo (.txt, .md, .csv)
                                </label>
                                <input
                                    type="file"
                                    accept=".txt,.md,.csv,.json"
                                    onChange={(e) =>
                                        createDocForm.setData(
                                            'file',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="w-full text-xs text-slate-600 file:mr-2 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-800 hover:file:bg-slate-200 dark:text-slate-400 dark:file:bg-slate-800 dark:file:text-cyan-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Contenido de Texto / Ficha Documental *
                            </label>
                            <textarea
                                rows={8}
                                value={createDocForm.data.content}
                                onChange={(e) =>
                                    createDocForm.setData(
                                        'content',
                                        e.target.value,
                                    )
                                }
                                placeholder="Pega aquí la información técnica, fórmulas, protocolos o notas de entrenamiento para Lira AI..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateDocOpen(false)}
                                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={createDocForm.processing}
                                className="cursor-pointer rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
                            >
                                Entrenar e Incorporar al Corpus
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* MODAL EDITAR DOCUMENTO */}
                {editingDoc && (
                    <Modal
                        isOpen={!!editingDoc}
                        show={!!editingDoc}
                        onClose={() => setEditingDoc(null)}
                        title={`Editar: ${editingDoc.title}`}
                    >
                        <form
                            onSubmit={handleEditDocSubmit}
                            className="max-h-[80vh] space-y-4 overflow-y-auto pr-1"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editDocForm.data.title}
                                    onChange={(e) =>
                                        editDocForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Categoría
                                </label>
                                <select
                                    value={editDocForm.data.category}
                                    onChange={(e) =>
                                        editDocForm.setData(
                                            'category',
                                            e.target
                                                .value as KnowledgeDocument['category'],
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="vademecum">
                                        Vademécum & Fórmulas Clínicas
                                    </option>
                                    <option value="farmacovigilancia">
                                        Farmacovigilancia & RAM INH
                                    </option>
                                    <option value="comercial">
                                        Comercial, Cotizaciones & Envíos
                                    </option>
                                    <option value="protocolo">
                                        Protocolo & Atención al Paciente
                                    </option>
                                    <option value="general">
                                        Información General del Laboratorio
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Contenido Completo
                                </label>
                                <textarea
                                    rows={10}
                                    required
                                    value={editDocForm.data.content}
                                    onChange={(e) =>
                                        editDocForm.setData(
                                            'content',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed outline-none dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editDocForm.data.is_active}
                                    onChange={(e) =>
                                        editDocForm.setData(
                                            'is_active',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded text-blue-600"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Activo para entrenamiento en Lira AI
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingDoc(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editDocForm.processing}
                                    className="cursor-pointer rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
                                >
                                    Actualizar Documento
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* MODAL VER CONTENIDO COMPLETO */}
                {viewingDoc && (
                    <Modal
                        isOpen={!!viewingDoc}
                        show={!!viewingDoc}
                        onClose={() => setViewingDoc(null)}
                        title={viewingDoc.title}
                        maxWidth="3xl"
                    >
                        <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-2 text-xs dark:border-slate-800">
                                <span className="font-mono font-bold text-blue-600 uppercase dark:text-cyan-400">
                                    Categoría: {viewingDoc.category}
                                </span>
                                <span>•</span>
                                <span className="font-mono text-slate-400">
                                    {(
                                        viewingDoc.file_size_bytes / 1024
                                    ).toFixed(1)}{' '}
                                    KB
                                </span>
                                <span>•</span>
                                <span
                                    className={
                                        viewingDoc.is_active
                                            ? 'font-bold text-emerald-600'
                                            : 'text-slate-400'
                                    }
                                >
                                    {viewingDoc.is_active
                                        ? 'Activo en Lira AI'
                                        : 'Pausado'}
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-800 select-text dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                                {viewingDoc.content}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setViewingDoc(null)}
                                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Cerrar Vista
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* MODAL ELIMINAR DOCUMENTO */}
                {deletingDoc && (
                    <Modal
                        isOpen={!!deletingDoc}
                        show={!!deletingDoc}
                        onClose={() => setDeletingDoc(null)}
                        title="Confirmar Eliminación de Documento"
                    >
                        <div className="space-y-4">
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                                ¿Estás seguro de que deseas retirar el documento{' '}
                                <strong>{deletingDoc.title}</strong> del corpus
                                de entrenamiento de Lira AI?
                            </p>
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setDeletingDoc(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteDocConfirm}
                                    className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                                >
                                    Eliminar del Corpus
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* ========================================================================= */}
                {/* MODALES: CREAR Y EDITAR GUARDRAILS SANITARIOS */}
                {/* ========================================================================= */}
                <Modal
                    isOpen={isCreateGuardrailOpen}
                    show={isCreateGuardrailOpen}
                    onClose={() => setIsCreateGuardrailOpen(false)}
                    title="Nuevo Guardrail Sanitario / Regla de Contención"
                >
                    <form
                        onSubmit={handleCreateGuardrailSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Nombre de la Regla o Guardrail *
                            </label>
                            <input
                                type="text"
                                required
                                value={createGuardrailForm.data.name}
                                onChange={(e) =>
                                    createGuardrailForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej: Prohibición de prescripción pediátrica no autorizada"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Tipo de Contención *
                            </label>
                            <select
                                value={createGuardrailForm.data.type}
                                onChange={(e) =>
                                    createGuardrailForm.setData(
                                        'type',
                                        e.target.value as Guardrail['type'],
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                            >
                                <option value="advertencia_sanitaria">
                                    Advertencia Sanitaria Obligatoria (Requiere
                                    Récipe, etc.)
                                </option>
                                <option value="bloqueo_estricto">
                                    Bloqueo Estricto (Cero automedicación / No
                                    diagnosticar)
                                </option>
                                <option value="derivacion_humana">
                                    Derivación a Soporte Humano
                                    (Farmacovigilancia / Ventas)
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Instrucción de Comportamiento para Lira AI *
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={
                                    createGuardrailForm.data.rule_instruction
                                }
                                onChange={(e) =>
                                    createGuardrailForm.setData(
                                        'rule_instruction',
                                        e.target.value,
                                    )
                                }
                                placeholder="Define exactamente qué debe hacer Lira ante esta situación..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed outline-none dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateGuardrailOpen(false)}
                                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={createGuardrailForm.processing}
                                className="cursor-pointer rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
                            >
                                Activar Guardrail
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* MODAL EDITAR GUARDRAIL */}
                {editingGuardrail && (
                    <Modal
                        isOpen={!!editingGuardrail}
                        show={!!editingGuardrail}
                        onClose={() => setEditingGuardrail(null)}
                        title={`Editar: ${editingGuardrail.name}`}
                    >
                        <form
                            onSubmit={handleEditGuardrailSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Nombre de la Regla *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editGuardrailForm.data.name}
                                    onChange={(e) =>
                                        editGuardrailForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Tipo de Contención *
                                </label>
                                <select
                                    value={editGuardrailForm.data.type}
                                    onChange={(e) =>
                                        editGuardrailForm.setData(
                                            'type',
                                            e.target.value as Guardrail['type'],
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="advertencia_sanitaria">
                                        Advertencia Sanitaria Obligatoria
                                    </option>
                                    <option value="bloqueo_estricto">
                                        Bloqueo Estricto
                                    </option>
                                    <option value="derivacion_humana">
                                        Derivación a Soporte Humano
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Instrucción de Comportamiento *
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={
                                        editGuardrailForm.data.rule_instruction
                                    }
                                    onChange={(e) =>
                                        editGuardrailForm.setData(
                                            'rule_instruction',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed outline-none dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editGuardrailForm.data.is_active}
                                    onChange={(e) =>
                                        editGuardrailForm.setData(
                                            'is_active',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded text-blue-600"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Guardrail Activo en Lira AI
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingGuardrail(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editGuardrailForm.processing}
                                    className="cursor-pointer rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
                                >
                                    Actualizar Guardrail
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* MODAL ELIMINAR GUARDRAIL */}
                {deletingGuardrail && (
                    <Modal
                        isOpen={!!deletingGuardrail}
                        show={!!deletingGuardrail}
                        onClose={() => setDeletingGuardrail(null)}
                        title="Eliminar Guardrail"
                    >
                        <div className="space-y-4">
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar la regla{' '}
                                <strong>{deletingGuardrail.name}</strong>?
                            </p>
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setDeletingGuardrail(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteGuardrailConfirm}
                                    className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </AppLayout>
    );
}
