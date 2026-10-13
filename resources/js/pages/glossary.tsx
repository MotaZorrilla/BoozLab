import { Head } from '@inertiajs/react';
import { Search, BookOpen, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import BoozLayout from '@/layouts/booz-layout';

interface GlossaryTerm {
    term: string;
    category: 'Farmacología' | 'Dermatología' | 'Fitoterapia' | 'Bioquímica' | 'Regulatorio';
    definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
    {
        term: 'Ácido Salicílico',
        category: 'Dermatología',
        definition: 'Betahidroxiácido queratolítico y comedolítico. Disuelve los desmosomas entre corneocitos, promoviendo la exfoliación suave del estrato córneo y desobstruyendo los folículos pilosebáceos en pieles con acné y queratosis.',
    },
    {
        term: 'Albendazol',
        category: 'Farmacología',
        definition: 'Antihelmíntico de amplio espectro derivado del bencimidazol. Inhibe la polimerización de la tubulina en los microtúbulos de nematodos, cestodos y protozoarios, causando su agotamiento energético y muerte.',
    },
    {
        term: 'Amikacina',
        category: 'Farmacología',
        definition: 'Antibiótico bactericida aminoglucósido semisintético de amplio espectro. Se une irreversiblemente a la subunidad ribosomal 30S bacteriana bloqueando la síntesis proteica en infecciones graves por bacilos gramnegativos aerobios.',
    },
    {
        term: 'Árnica Montana',
        category: 'Fitoterapia',
        definition: 'Planta medicinal perenne cuyos extractos contienen helenalina y lactonas sesquiterpénicas con demostrada acción antiinflamatoria, antiequimótica y analgésica tópica para contusiones, distensiones musculares y hematomas.',
    },
    {
        term: 'Astringente',
        category: 'Dermatología',
        definition: 'Sustancia que al aplicarse tópicamente provoca la coagulación o precipitación de proteínas celulares superficiales, reduciendo el exudado dérmico, la secreción sebácea y el edema inflamatorio local.',
    },
    {
        term: 'Bactericida',
        category: 'Farmacología',
        definition: 'Fármaco o compuesto antimicrobiano que induce la lisis y muerte celular irreversible de bacterias patógenas a concentraciones terapéuticas alcanzables.',
    },
    {
        term: 'Bacteriostático',
        category: 'Farmacología',
        definition: 'Agente que frena el crecimiento y la reproducción bacteriana sin provocar directamente su lisis inmediata, permitiendo que las defensas inmunitarias del huésped erradiquen la infección.',
    },
    {
        term: 'Betametasona',
        category: 'Farmacología',
        definition: 'Glucocorticoide sintético fluorado de alta potencia terapéutica. Ejerce una enérgica acción antiinflamatoria, antipruriginosa y vasoconstrictora en dermatosis crónicas y cuadros inflamatorios agudos.',
    },
    {
        term: 'Biodisponibilidad',
        category: 'Farmacología',
        definition: 'Fracción (F) y velocidad a la que un principio activo se absorbe a partir de una forma farmacéutica determinada y accede inalterado a la circulación sistémica para ejercer su efecto terapéutico.',
    },
    {
        term: 'Biofilm Bacteriano',
        category: 'Bioquímica',
        definition: 'Complejo ecosistema de microorganismos sésiles embebidos en una matriz extracelular protectora de exopolisacáridos, responsable de la cronicidad y la refractariedad a antimicrobianos en infecciones cutáneas.',
    },
    {
        term: 'Calamina',
        category: 'Dermatología',
        definition: 'Preparación farmacéutica de carbonato u óxido de zinc con óxido férrico. Empleada como protector cutáneo antipruriginoso, secante y refrescante en eritemas solares, varicela y dermatitis de contacto.',
    },
    {
        term: 'Centella Asiática',
        category: 'Fitoterapia',
        definition: 'Planta medicinal rica en saponinas triterpénicas (asiaticósido y ácido madecásico). Estimula la síntesis de colágeno tipo I en fibroblastos, activando la angiogénesis y acelerando la cicatrización sin hipertrofia.',
    },
    {
        term: 'Clindamicina',
        category: 'Farmacología',
        definition: 'Antibiótico lincosamida semisintético. Se fija a la subunidad ribosomal 50S bacteriana inhibiendo la transpeptidación; altamente activo contra Cutibacterium acnes y bacterias anaerobias.',
    },
    {
        term: 'Comedolítico',
        category: 'Dermatología',
        definition: 'Propiedad farmacológica que previene la formación y disuelve los microcomedones (puntos negros y blancos), normalizando la queratinización infundibular en el acné.',
    },
    {
        term: 'Corticoesteroide Tópico',
        category: 'Farmacología',
        definition: 'Fármaco derivado de las hormonas corticosuprarrenales formulado para aplicación sobre la piel, donde inhibe la fosfolipasa A2 y la liberación de mediadores inflamatorios (prostaglandinas y leucotrienos).',
    },
    {
        term: 'Dermatofitosis',
        category: 'Dermatología',
        definition: 'Infección fúngica superficial de estructuras queratinizadas (estrato córneo, cabello o uñas) causada por hongos filamentosos parásitos de los géneros Trichophyton, Microsporum o Epidermophyton.',
    },
    {
        term: 'Dexametasona',
        category: 'Farmacología',
        definition: 'Glucocorticoide sintético de acción prolongada con nula actividad mineralocorticoide. Utilizado para controlar inflamaciones severas, cuadros alérgicos agudos y reacciones inmunomediadas.',
    },
    {
        term: 'Dexpantenol (Pro-Vitamina B5)',
        category: 'Bioquímica',
        definition: 'Análogo alcohólico del ácido pantoténico que se convierte enzimáticamente en coenzima A celular. Favorece la epitelización, mejora la hidratación del estrato córneo y alivia la irritación dérmica.',
    },
    {
        term: 'Emulsión O/W (Óleo en Agua)',
        category: 'Farmacología',
        definition: 'Forma farmacéutica constituida por gotas de fase lipídica dispersas en un vehículo acuoso continuo mediante emulgentes. Es de rápida absorción, no oclusiva y con alta aceptabilidad cosmética.',
    },
    {
        term: 'Eritema',
        category: 'Dermatología',
        definition: 'Enrojecimiento circunscrito o difuso de la superficie cutánea que desaparece momentáneamente a la digitopresión, provocado por vasodilatación activa de los capilares dérmicos superficiales.',
    },
    {
        term: 'Estabilidad Farmacéutica',
        category: 'Regulatorio',
        definition: 'Aptitud de un medicamento o producto dermocosmético para retener sus propiedades físicas, químicas, microbiológicas y terapéuticas dentro de los límites especificados a lo largo de su vida útil.',
    },
    {
        term: 'Estrato Córneo',
        category: 'Dermatología',
        definition: 'Capa epitelial más externa de la epidermis formada por corneocitos anucleados y una matriz lipídica multilaminar, constituyendo la principal barrera protectora frente a agresiones y deshidratación.',
    },
    {
        term: 'Farmacocinética (ADME)',
        category: 'Farmacología',
        definition: 'Disciplina que cuantifica los procesos dinámicos de Absorción, Distribución, Metabolismo (biotransformación) y Excreción de un fármaco a lo largo del tiempo en el organismo vivo.',
    },
    {
        term: 'Farmacovigilancia',
        category: 'Regulatorio',
        definition: 'Ciencia y actividades relativas a la detección, evaluación, comprensión y prevención de los efectos adversos o cualquier otro problema relacionado con medicamentos para garantizar su seguridad continua.',
    },
    {
        term: 'Fitoterapia',
        category: 'Fitoterapia',
        definition: 'Uso de plantas medicinales, extractos estandarizados y sustancias botánicas de origen vegetal con fines terapéuticos, preventivos o rehabilitadores respaldados por evidencia científica.',
    },
    {
        term: 'Gentamicina',
        category: 'Farmacología',
        definition: 'Antibiótico aminoglucósido de amplio espectro obtenido de Micromonospora purpurea. Indicado tópicamente en piodermias, foliculitis y quemaduras infectadas por microorganismos gramnegativos y estafilococos.',
    },
    {
        term: 'Hidratación Oclusiva',
        category: 'Dermatología',
        definition: 'Estrategia dermocosmética basada en lípidos que forman una película hidrofóbica en la superficie cutánea, reduciendo drásticamente la pérdida transepidérmica de agua (TEWL).',
    },
    {
        term: 'Lincosamida',
        category: 'Farmacología',
        definition: 'Familia antibiótica (incluye clindamicina y lincomicina) caracterizada por bloquear la elongación de la cadena peptídica en la subunidad ribosomal 50S de bacterias susceptibles.',
    },
    {
        term: 'Mupirocina',
        category: 'Farmacología',
        definition: 'Antibiótico tópico de estructura única derivado de Pseudomonas fluorescens que inhibe selectivamente la isoleucil-ARNt sintetasa bacteriana, erradicando Staphylococcus aureus y Streptococcus pyogenes.',
    },
    {
        term: 'Nistatina',
        category: 'Farmacología',
        definition: 'Antifúngico macrólido poliénico producido por Streptomyces noursei. Se fija a los esteroles de la membrana citoplasmática fúngica provocando poros y lisis en levaduras del género Candida.',
    },
    {
        term: 'Pápula',
        category: 'Dermatología',
        definition: 'Lesión elemental primaria sólida, sobreelevada respecto al plano cutáneo, menor a 1 cm de diámetro y sin contenido líquido en su interior, común en acné inflamatorio y dermatitis.',
    },
    {
        term: 'Posología',
        category: 'Regulatorio',
        definition: 'Determinación exacta de las dosis, frecuencia de administración e intervalo de tratamiento recomendados para un medicamento según edad, peso y cuadro clínico del paciente.',
    },
    {
        term: 'Pústula',
        category: 'Dermatología',
        definition: 'Pequeña vesícula o elevación cutánea visible y circunscrita que contiene líquido purulento (exudado de neutrófilos), indicativa de inflamación folicular o infección bacteriana superficial.',
    },
    {
        term: 'Queratolítico',
        category: 'Dermatología',
        definition: 'Agente terapéutico que disuelve el cemento intercelular y desintegra los agregados de queratina en la capa córnea engrosada, facilitando su descamación fisiológica controlada.',
    },
    {
        term: 'Rubefaciente',
        category: 'Farmacología',
        definition: 'Fármaco o compuesto de aplicación tópica que induce hiperemia local y dilatación de los capilares cutáneos, aliviando dolores profundos musculares y articulares por contrairritación.',
    },
    {
        term: 'Salicilato de Metilo',
        category: 'Farmacología',
        definition: 'Éster orgánico analgésico y rubefaciente derivado del ácido salicílico. Penetra a través de la piel liberando calor local y descontracturando la musculatura sobrecargada o inflamada.',
    },
    {
        term: 'Sulfato de Neomicina',
        category: 'Farmacología',
        definition: 'Aminoglucósido antibacteriano de uso tópico que inhibe la síntesis proteica bacteriana; comúnmente asociado en cremas combinadas para prevenir y tratar sobreinfecciones dérmicas.',
    },
    {
        term: 'Teratogénico',
        category: 'Regulatorio',
        definition: 'Cualquier agente químico, físico o biológico con la capacidad potencial de causar anomalías morfológicas, funcionales o estructurales permanentes en el embrión o feto durante la gestación.',
    },
    {
        term: 'Tolnaftato',
        category: 'Farmacología',
        definition: 'Antimicótico sintético de uso tópico que inhibe selectivamente la enzima escualeno epoxidasa en la vía de biosíntesis del ergosterol fúngico en tiñas y pie de atleta.',
    },
    {
        term: 'Vademécum',
        category: 'Regulatorio',
        definition: 'Documento técnico oficial y exhaustivo que compendia la información farmacológica, indicaciones aprobadas, contraindicaciones, posología y precauciones sanitarias de una cartera de medicamentos.',
    },
    {
        term: 'Valeriana (Valeriana officinalis)',
        category: 'Fitoterapia',
        definition: 'Extracto botánico estandarizado de raíz y rizoma rico en ácidos valerénicos que modula la neurotransmisión gabaérgica central, promoviendo la relajación neuromuscular y el descanso reparador.',
    },
];

export default function Glossary() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    const categories = useMemo(() => {
        return ['Todos', 'Farmacología', 'Dermatología', 'Fitoterapia', 'Bioquímica', 'Regulatorio'];
    }, []);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const filteredTerms = useMemo(() => {
        return GLOSSARY_TERMS.filter((item) => {
            const matchesSearch =
                search.trim() === '' ||
                item.term.toLowerCase().includes(search.toLowerCase()) ||
                item.definition.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                !selectedCategory ||
                selectedCategory === 'Todos' ||
                item.category === selectedCategory;

            const matchesLetter = !selectedLetter || item.term.toUpperCase().startsWith(selectedLetter);

            return matchesSearch && matchesCategory && matchesLetter;
        }).sort((a, b) => a.term.localeCompare(b.term));
    }, [search, selectedCategory, selectedLetter]);

    return (
        <BoozLayout>
            <Head title="Glosario Farmacéutico & Médico | Booz Laboratorio" />

            {/* Header del Glosario */}
            <header className="border-b border-slate-200 bg-white py-12 transition-colors duration-300 sm:py-16 dark:border-slate-800 dark:bg-[#070C18]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-black tracking-wider text-[#002072] uppercase dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-cyan-300">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                                Vademécum & Diccionario Clínico
                            </span>
                            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl dark:text-white">
                                <BookOpen className="h-8 w-8 text-blue-600 dark:text-cyan-400" />
                                Glosario Técnico Médico
                            </h1>
                            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Definiciones científicas, farmacológicas y dermatológicas oficiales para profesionales de la salud, farmacéuticos y pacientes de Booz Laboratorio.
                            </p>
                        </div>

                        {/* Buscador */}
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar principio activo, término o síntoma..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-cyan-400 dark:focus:bg-[#0D172E]"
                            />
                        </div>
                    </div>

                    {/* Filtro por Categorías */}
                    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6 dark:border-slate-800/80">
                        <span className="mr-1 flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                            <Filter className="h-3.5 w-3.5" />
                            Disciplinas:
                        </span>
                        {categories.map((cat) => {
                            const isSelected = (!selectedCategory && cat === 'Todos') || selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === 'Todos' ? null : cat)}
                                    className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                                        isSelected
                                            ? 'bg-[#002072] text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Filtro por Alfabeto */}
                    <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                        <button
                            onClick={() => setSelectedLetter(null)}
                            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                                !selectedLetter
                                    ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                                    : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`}
                        >
                            Todos
                        </button>
                        {alphabet.map((letter) => {
                            const isSelected = selectedLetter === letter;
                            return (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(letter)}
                                    className={`cursor-pointer rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                                        isSelected
                                            ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                                            : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Contenido de Términos */}
            <section className="bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:bg-[#0A1124]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>
                            Mostrando <strong>{filteredTerms.length}</strong> de <strong>{GLOSSARY_TERMS.length}</strong> términos disponibles
                        </span>
                        {(search || selectedCategory || selectedLetter) && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCategory(null);
                                    setSelectedLetter(null);
                                }}
                                className="cursor-pointer font-bold text-blue-600 underline hover:text-blue-700 dark:text-cyan-400"
                            >
                                Limpiar filtros ✕
                            </button>
                        )}
                    </div>

                    {filteredTerms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTerms.map((item) => (
                                <div
                                    key={item.term}
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg dark:border-slate-800 dark:bg-[#0D172E] dark:hover:border-cyan-500/50 dark:hover:shadow-cyan-950/20"
                                >
                                    <div>
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#002072] uppercase dark:bg-blue-950/60 dark:text-cyan-300">
                                                {item.category}
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500 dark:text-slate-600 dark:group-hover:text-cyan-400" />
                                        </div>
                                        <h3 className="mb-2 text-base font-black tracking-tight text-slate-900 transition-colors group-hover:text-[#002072] sm:text-lg dark:text-white dark:group-hover:text-cyan-300">
                                            {item.term}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                            {item.definition}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-[#0D172E]">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                No se encontraron términos técnicos
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Intente con otra combinación de búsqueda o restablezca los filtros.
                            </p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCategory(null);
                                    setSelectedLetter(null);
                                }}
                                className="mt-5 cursor-pointer rounded-xl bg-[#002072] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-800 dark:bg-blue-600"
                            >
                                Ver todos los términos
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </BoozLayout>
    );
}
