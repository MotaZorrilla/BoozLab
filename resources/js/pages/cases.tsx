import { Head } from '@inertiajs/react';
import { Microscope, ClipboardCheck, ArrowRight } from 'lucide-react';
import BoozLayout from '@/layouts/booz-layout';

const MOCK_CASES = [
    {
        id: 1,
        title: 'Tratamiento de Acné Vulgaris Moderado',
        product: 'Clindamer + Salicis',
        duration: '12 semanas',
        description:
            'Paciente masculino de 17 años con lesiones inflamatorias persistentes. Reducción del 85% en pústulas tras ciclo completo.',
        image: 'https://placehold.co/600x400/e2e8f0/004aad?text=Caso+Acne+Clindamer',
    },
    {
        id: 2,
        title: 'Recuperación de Barrera Cutánea',
        product: 'Hidramer B5',
        duration: '14 días',
        description:
            'Evaluación de hidratación transepidérmica en piel xerótica post-procedimiento químico.',
        image: 'https://placehold.co/600x400/e2e8f0/004aad?text=Caso+Hidratacion+Hidramer',
    },
    {
        id: 3,
        title: 'Refuerzo Antioxidante Sistémico',
        product: 'Cevitmer (Vitamina C)',
        duration: '30 días',
        description:
            'Medición de marcadores de estrés oxidativo en pacientes con fatiga crónica y exposición UV.',
        image: 'https://placehold.co/600x400/e2e8f0/004aad?text=Caso+Vitamina+C+Cevitmer',
    },
];

export default function Cases() {
    return (
        <BoozLayout>
            <Head title="Casos Clínicos" />

            <header className="border-b border-slate-100 bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="flex items-center gap-4 text-4xl font-bold text-slate-900">
                        <Microscope className="h-10 w-10 text-blue-600" />
                        Evidencia <span className="text-blue-600">Clínica</span>
                    </h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Repositorio de estudios de caso y comparativas
                        terapéuticas documentadas bajo protocolos de observación
                        científica.
                    </p>
                </div>
            </header>

            <section className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {MOCK_CASES.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 rounded-full border border-blue-100 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-600 uppercase backdrop-blur">
                                        {item.duration}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-8">
                                    <h3 className="mb-2 text-xl leading-tight font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                        {item.title}
                                    </h3>
                                    <div className="mb-4 flex items-center gap-2">
                                        <ClipboardCheck className="h-4 w-4 text-green-500" />
                                        <span className="text-sm font-semibold text-slate-500">
                                            {item.product}
                                        </span>
                                    </div>
                                    <p className="flex-1 text-sm leading-relaxed text-slate-600">
                                        {item.description}
                                    </p>

                                    <button className="mt-8 flex w-full cursor-pointer items-center justify-between rounded-2xl bg-[#002072] p-4 font-bold text-white shadow-sm transition-all hover:bg-blue-800">
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
            <section className="bg-white py-12">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <div className="mb-6 inline-flex rounded-2xl bg-blue-50 p-4">
                        <Microscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
                        Todos los casos presentados han sido anonimizados y
                        cuentan con el consentimiento informado de los pacientes
                        para fines educativos y de investigación científica.
                    </p>
                </div>
            </section>
        </BoozLayout>
    );
}
