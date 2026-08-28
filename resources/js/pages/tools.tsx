import { Head } from '@inertiajs/react';
import { Stethoscope, BrainCircuit, Activity } from 'lucide-react';
import PediatricCalculator from '@/components/pediatric-calculator';
import BoozLayout from '@/layouts/booz-layout';

export default function Tools() {
    return (
        <BoozLayout>
            <Head title="Herramientas Clínicas" />
            
            <header className="bg-slate-900 py-16 text-white overflow-hidden relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl flex items-center gap-4">
                        <BrainCircuit className="h-10 w-10 text-blue-400" />
                        Clinical <span className="text-blue-400">Hub</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-slate-300">
                        Acceda a herramientas de precisión diseñadas para optimizar la práctica médica diaria y la seguridad del paciente.
                    </p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-blue-600/10 skew-x-12 translate-x-1/2"></div>
            </header>

            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Sidebar / List */}
                        <div className="lg:col-span-1 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Utilidades Disponibles</h2>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 font-bold transition-all">
                                    <Activity className="h-5 w-5" />
                                    Calculadora Pediátrica
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 border border-transparent hover:bg-slate-50 transition-all cursor-not-allowed">
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
