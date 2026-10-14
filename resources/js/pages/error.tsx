import { Head, Link } from '@inertiajs/react';
import {
    FileQuestion,
    Home,
    Search,
    ShieldAlert,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
} from 'lucide-react';
import React, { useState } from 'react';
import SearchModal from '@/components/search-modal';
import BoozLayout from '@/layouts/booz-layout';
import { appUrl } from '@/lib/utils';
import type { Product } from '@/types';

interface ErrorPageProps {
    status?: number;
    message?: string;
}

export default function ErrorPage({
    status = 404,
    message = 'La formulación médica, sección o recurso clínico no fue encontrado en el catálogo oficial.',
}: ErrorPageProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const titleMap: Record<number, string> = {
        404: 'Registro Clínico No Encontrado (404)',
        403: 'Acceso Restringido a la Consola (403)',
        500: 'Incidencia en el Servidor Farmacéutico (500)',
        503: 'Servicio en Mantenimiento Programado (503)',
    };

    const title = titleMap[status] || `Error Clínico (${status})`;

    return (
        <BoozLayout>
            <Head title={`${status} - Booz Laboratorio`} />

            <div className="flex min-h-[75vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-cyan-400">
                        <ShieldAlert className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                        <span>Notificación del Sistema Farmacéutico</span>
                    </div>

                    {/* Status Code Visual */}
                    <div className="relative mt-6 flex justify-center">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white shadow-xl dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                            <span className="text-4xl font-black tracking-tight text-[#002072] dark:text-cyan-400">
                                {status}
                            </span>
                            <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-600 p-2 text-white shadow-md dark:bg-cyan-500 dark:text-slate-950">
                                <FileQuestion className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="mt-8 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                        {title}
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {message}
                    </p>

                    {/* Quick navigation actions */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href={appUrl('/')}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002072] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-blue-900/30 sm:w-auto dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                        >
                            <Home className="h-4 w-4" />
                            <span>Volver al Catálogo Principal</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                            <span>Buscar Producto o Principio Activo</span>
                        </button>
                    </div>

                    {/* Help card */}
                    <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-left text-xs text-slate-600 dark:border-slate-800 dark:bg-[#0D172E]/60 dark:text-slate-400">
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>Sugerencias para continuar navegando:</span>
                        </div>
                        <ul className="mt-2.5 list-inside list-disc space-y-1.5 pl-1">
                            <li>
                                Verifique que la dirección URL o código del producto no contenga errores tipográficos.
                            </li>
                            <li>
                                Si buscaba una presentación magistral, puede consultar a <strong>Lira (IA Asistente Médica)</strong> desde el botón inferior derecho.
                            </li>
                            <li>
                                Para emergencias de abastecimiento o Farmacovigilancia, contáctenos directamente al canal oficial en Valle de Guanape.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                products={[]}
            />
        </BoozLayout>
    );
}
