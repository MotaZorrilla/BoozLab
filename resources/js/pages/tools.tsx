import { Head } from '@inertiajs/react';
import { Stethoscope, BrainCircuit, Activity } from 'lucide-react';
import PediatricCalculator from '@/components/pediatric-calculator';
import BoozLayout from '@/layouts/booz-layout';

export default function Tools() {
    return (
        <BoozLayout>
            <Head title="Herramientas Clínicas" />

            <header className="relative overflow-hidden bg-slate-900 py-16 text-white">
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="flex items-center gap-4 text-4xl font-bold tracking-tight sm:text-5xl">
                        <BrainCircuit className="h-10 w-10 text-blue-400" />
                        Clinical <span className="text-blue-400">Hub</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-slate-300">
                        Acceda a herramientas de precisión diseñadas para
                        optimizar la práctica médica diaria y la seguridad del
                        paciente.
                    </p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 translate-x-1/2 skew-x-12 bg-blue-600/10"></div>
            </header>

            <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                        {/* Sidebar / List */}
                        <div className="space-y-6 lg:col-span-1">
                            <h2 className="border-b pb-4 text-2xl font-bold text-slate-900">
                                Utilidades Disponibles
                            </h2>
                            <div className="space-y-2">
                                <button className="flex w-full items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 font-bold text-blue-700 transition-all">
                                    <Activity className="h-5 w-5" />
                                    Calculadora Pediátrica
                                </button>
                                <button className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl border border-transparent p-4 text-slate-400 transition-all hover:bg-slate-50">
                                    <Stethoscope className="h-5 w-5" />
                                    Buscador de Interacciones (Próximamente)
                                </button>
                            </div>
                        </div>

                        {/* Tool Content */}
                        <div className="lg:col-span-2">
                            <PediatricCalculator />
                        </div>
                    </div>
                </div>
            </section>
        </BoozLayout>
    );
}
