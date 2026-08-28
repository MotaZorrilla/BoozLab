import { Head } from '@inertiajs/react';
import { Microscope, ClipboardCheck, ArrowRight } from 'lucide-react';
import BoozLayout from '@/layouts/booz-layout';

const MOCK_CASES = [
    { 
        id: 1, 
        title: 'Tratamiento de Acné Vulgaris Moderado', 
        product: 'Clindamer + Salicis', 
        duration: '12 semanas',
        description: 'Paciente masculino de 17 años con lesiones inflamatorias persistentes. Reducción del 85% en pústulas tras ciclo completo.',
        image: 'https://placehold.co/600x400/e2e8f0/004aad?text=Caso+Acne+Clindamer'
    },
    { 
        id: 2, 
        title: 'Recuperación de Barrera Cutánea', 
        product: 'Hidramer B5', 
        duration: '14 días',
        description: 'Evaluación de hidratación transepidérmica en piel xerótica post-procedimiento químico.',
        image: 'https://placehold.co/600x400/e2e8f0/004aad?text=Caso+Hidratacion+Hidramer'
    },
    { 
        id: 3, 
        title: 'Refuerzo Antioxidante Sistémico', 
        product: 'Cevitmer (Vitamina C)', 
        duration: '30 días',
        description: 'Medición de marcadores de estrés oxidativo en pacientes con fatiga crónica y exposición UV.',
        image: 'https://placehold.co/600x400/e2e8f0/004aad?text=Caso+Vitamina+C+Cevitmer'
    },
];

export default function Cases() {
    return (
        <BoozLayout>
            <Head title="Casos Clínicos" />
            
            <header className="bg-white py-16 border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-4">
                        <Microscope className="text-blue-600 h-10 w-10" />
                        Evidencia <span className="text-blue-600">Clínica</span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-3xl">
                        Repositorio de estudios de caso y comparativas terapéuticas documentadas bajo protocolos de observación científica.
                    </p>
                </div>
            </header>

            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {MOCK_CASES.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col hover:shadow-xl transition-all group">
                                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest border border-blue-100">
                                        {item.duration}
                                    </div>
                                </div>
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ClipboardCheck className="h-4 w-4 text-green-500" />
                                        <span className="text-sm font-semibold text-slate-500">{item.product}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed flex-1">
                                        {item.description}
                                    </p>
                                    
                                    <button className="mt-8 flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        Ver Protocolo Completo
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scientific Disclaimer */}
            <section className="py-12 bg-white">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <div className="inline-flex p-4 bg-blue-50 rounded-2xl mb-6">
                        <Microscope className="text-blue-600 h-6 w-6" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
                        Todos los casos presentados han sido anonimizados y cuentan con el consentimiento informado de los pacientes para fines educativos y de investigación científica.
                    </p>
                </div>
            </section>
        </BoozLayout>
    );
}
