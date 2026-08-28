import BoozLayout from '@/layouts/booz-layout';
import { Head, Link } from '@inertiajs/react';
import type { Product, ProductLine, Testimonial, Faq } from '@/types';
import { 
    Sparkles, Search, ShieldCheck, ArrowRight, Bot, 
    MessageCircle, ShieldAlert, FileText, ChevronDown, 
    HeartHandshake, Microscope, Award, BookOpen, Stethoscope,
    Phone, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import LiraAssistantModal from '@/components/lira-assistant-modal';
import SearchModal from '@/components/search-modal';

interface HomeProps {
    productLines: ProductLine[];
    products: Product[];
    testimonials: Testimonial[];
    faqs: Faq[];
}

export default function Home({ productLines = [], products = [], testimonials = [], faqs = [] }: HomeProps) {
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);
    const [isLiraOpen, setIsLiraOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedNeed, setSelectedNeed] = useState<string | null>(null);

    // Dynamic filtering for catalog
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesLine = selectedLineId === null || p.product_line_id === selectedLineId;
            const matchesSearch = searchQuery === '' || 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.active_ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesNeed = selectedNeed === null || 
                (selectedNeed === 'Cuidado' && (p.product_line_id === 1 || p.description.toLowerCase().includes('cuidado') || p.description.toLowerCase().includes('hidratan'))) ||
                (selectedNeed === 'Protección' && (p.description.toLowerCase().includes('protec') || p.description.toLowerCase().includes('barrera') || p.description.toLowerCase().includes('biofilm'))) ||
                (selectedNeed === 'Tratamiento' && (p.product_line_id === 2 || p.description.toLowerCase().includes('infecci') || p.description.toLowerCase().includes('inflama'))) ||
                (selectedNeed === 'Bienestar' && (p.product_line_id === 3 || p.description.toLowerCase().includes('vitamina') || p.description.toLowerCase().includes('recupera'))) ||
                (selectedNeed === 'Especializado' && (p.product_line_id === 4 || p.description.toLowerCase().includes('diabético') || p.description.toLowerCase().includes('acné')));

            return matchesLine && matchesSearch && matchesNeed;
        });
    }, [products, selectedLineId, searchQuery, selectedNeed]);

    const toggleFaq = (id: number) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    return (
        <BoozLayout>
            <Head title="Booz Laboratorio | La ciencia que transforma el cuidado" />

            {/* ========================================================
                1. HERO SECTION (Fiel al Mockup Oficial)
            ======================================================== */}
            <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/40 py-16 sm:py-24 border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-black uppercase tracking-wider">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Vademécum Clínico Oficial
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-blue-950 leading-[1.1]">
                                La ciencia que <br />
                                <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                                    transforma el cuidado
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                                Desarrollamos soluciones farmacéuticas y dermatológicas innovadoras, seguras y confiables para el bienestar, la salud familiar y la recuperación tisular avanzada.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <a
                                    href="#productos"
                                    className="px-6 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all"
                                >
                                    Conoce nuestros productos
                                </a>

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm transition-all"
                                >
                                    <Search className="h-4 w-4 text-blue-600" />
                                    <span>¿Qué estás buscando?</span>
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                                <div>
                                    <span className="block text-2xl font-black text-blue-900">18+</span>
                                    <span className="text-xs text-slate-500 font-medium">Productos Registrados</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-blue-900">4</span>
                                    <span className="text-xs text-slate-500 font-medium">Líneas Terapéuticas</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-blue-900">100%</span>
                                    <span className="text-xs text-slate-500 font-medium">Cumplimiento Sanitario</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Showcase */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-blue-900/10 via-white to-indigo-100/50 p-6 flex items-center justify-center border border-blue-100 shadow-2xl shadow-blue-900/10">
                                <img
                                    src="/assets/img/hero_products.png"
                                    alt="Línea de Productos Booz Laboratorio"
                                    className="w-full h-auto object-contain max-h-[380px] drop-shadow-2xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg';
                                    }}
                                />
                                <div className="absolute -bottom-4 right-4 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Calidad Certificada</p>
                                        <p className="text-[10px] text-slate-500">Valle de Guanape, Venezuela</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                2. NUESTRAS 4 LÍNEAS DE PRODUCTOS (Mockup Carousel/Cards)
            ======================================================== */}
            <section className="py-20 bg-white" id="lineas">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">
                                Clasificación Terapéutica
                            </span>
                            <h2 className="text-3xl font-black text-blue-950 tracking-tight">
                                Nuestras 4 líneas de productos
                            </h2>
                        </div>
                        {selectedLineId !== null && (
                            <button
                                onClick={() => setSelectedLineId(null)}
                                className="mt-4 sm:mt-0 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                            >
                                Ver todas las líneas
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productLines.map((line) => {
                            const isSelected = selectedLineId === line.id;
                            const lineColors: Record<number, { bg: string; text: string; border: string }> = {
                                1: { bg: 'bg-blue-900', text: 'text-blue-300', border: 'border-blue-800' },
                                2: { bg: 'bg-indigo-900', text: 'text-indigo-300', border: 'border-indigo-800' },
                                3: { bg: 'bg-emerald-900', text: 'text-emerald-300', border: 'border-emerald-800' },
                                4: { bg: 'bg-purple-950', text: 'text-purple-300', border: 'border-purple-800' },
                            };
                            const color = lineColors[line.id] || { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-800' };

                            return (
                                <div
                                    key={line.id}
                                    onClick={() => {
                                        setSelectedLineId(isSelected ? null : line.id);
                                        const el = document.getElementById('productos');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`rounded-3xl p-6 text-white cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px] ${color.bg} ${
                                        isSelected ? 'ring-4 ring-blue-500 scale-[1.02]' : ''
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>
                                                Línea {line.code}
                                            </span>
                                            <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                                {line.code}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 leading-snug">
                                            {line.name}
                                        </h3>

                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {line.description}
                                        </p>
                                    </div>

                                    <div className="pt-6">
                                        <div className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-center text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                            <span>{isSelected ? 'Línea Seleccionada ✓' : 'Ver productos'}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================
                3. BENTO GRID INTERACTIVO (3 Columnas del Mockup)
            ======================================================== */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Columna 1: ¿Qué necesitas? Selector de necesidad */}
                        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-blue-950 mb-2">¿Qué necesitas?</h3>
                                <p className="text-xs text-slate-500 mb-6">
                                    Encuentra el producto ideal según tu necesidad clínica inmediata.
                                </p>

                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { name: 'Cuidado', icon: '🧴' },
                                        { name: 'Protección', icon: '🛡️' },
                                        { name: 'Tratamiento', icon: '💊' },
                                        { name: 'Bienestar', icon: '🌿' },
                                        { name: 'Especializado', icon: '🔬' },
                                    ].map((need) => (
                                        <button
                                            key={need.name}
                                            onClick={() => {
                                                setSelectedNeed(selectedNeed === need.name ? null : need.name);
                                                const el = document.getElementById('productos');
                                                el?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 ${
                                                selectedNeed === need.name
                                                    ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                                            }`}
                                        >
                                            <span className="text-base">{need.icon}</span>
                                            <span>{need.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedNeed && (
                                <button
                                    onClick={() => setSelectedNeed(null)}
                                    className="mt-6 text-xs text-blue-600 font-bold underline"
                                >
                                    Limpiar filtro de necesidad
                                </button>
                            )}
                        </div>

                        {/* Columna 2: Hola, soy Booz / Lira - Tu asistente virtual */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                            <div className="relative w-36 h-36 flex-shrink-0">
                                <img
                                    src="/assets/img/booz_mascot.png"
                                    alt="Lira Asistente Booz"
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/Mascota_Lira_3D_Crema_Salicis_Fondo_Naranja.jpeg';
                                    }}
                                />
                            </div>
                            <div className="space-y-3 text-center sm:text-left">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                                    IA Médica
                                </span>
                                <h3 className="text-2xl font-black leading-tight">
                                    Hola, soy Lira <br />
                                    <span className="text-blue-300 font-normal text-lg">Tu asistente virtual</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Estoy aquí para ayudarte a encontrar información técnica sobre nuestros medicamentos, fórmulas y presentaciones.
                                </p>
                                <button
                                    onClick={() => setIsLiraOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-950 font-black text-xs hover:bg-blue-50 shadow-lg transition-all"
                                >
                                    <Bot className="h-4 w-4 text-blue-600" />
                                    <span>Hablar con Booz</span>
                                </button>
                            </div>
                        </div>

                        {/* Columna 3: ¿Ya sabes lo que buscas? */}
                        <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-blue-950 mb-2">¿Ya sabes lo que buscas?</h3>
                                <p className="text-xs text-slate-500 mb-6">
                                    Encuentra fichas técnicas, presentaciones y disponibilidad en nuestro vademécum.
                                </p>
                                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                    <img
                                        src="/assets/img/product_3.png"
                                        alt="Catálogo"
                                        className="h-24 object-contain"
                                    />
                                </div>
                            </div>

                            <a
                                href="#productos"
                                className="mt-6 w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold text-center block transition-all shadow-md"
                            >
                                Ver Vademécum Completo
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                4. CATÁLOGO REAL DE PRODUCTOS CON PÁGINAS DEDICADAS (PDP)
            ======================================================== */}
            <section className="py-20 bg-white" id="productos">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">
                                Portafolio Clínico Oficial
                            </span>
                            <h2 className="text-3xl font-black text-blue-950 tracking-tight">
                                Catálogo Farmacéutico Booz
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Mostrando {filteredProducts.length} productos registrados ante las autoridades sanitarias.
                            </p>
                        </div>

                        {/* Search in Catalog Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filtrar por nombre o principio activo..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const whatsappUrl = `https://wa.me/584148873615?text=${encodeURIComponent(
                                `Hola Booz Laboratorio, deseo consultar sobre ${product.name} (${product.presentation})`
                            )}`;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
                                >
                                    <div>
                                        {/* Product Image & Badges */}
                                        <div className="relative w-full aspect-square rounded-2xl bg-slate-50 p-4 mb-4 flex items-center justify-center overflow-hidden group-hover:bg-blue-50/50 transition-colors">
                                            <img
                                                src={product.image_path}
                                                alt={product.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                }}
                                            />
                                            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-sm">
                                                {product.product_line?.name || 'Línea Booz'}
                                            </span>
                                            {product.is_prescription_required ? (
                                                <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-sm">
                                                    Bajo Récipe
                                                </span>
                                            ) : (
                                                <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white shadow-sm">
                                                    Venta Libre
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {product.name}
                                        </h4>

                                        <p className="text-xs font-semibold text-blue-700 mb-2 line-clamp-1">
                                            {product.active_ingredients}
                                        </p>

                                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-3 border-t border-slate-100">
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span className="text-[10px] font-medium">{product.presentation}</span>
                                        </div>

                                        <div className="grid grid-cols-5 gap-2">
                                            {/* Link to Dedicated PDP */}
                                            <Link
                                                href={`/producto/${product.slug}`}
                                                className="col-span-4 py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                            >
                                                <span>Ficha Médica</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>

                                            {/* Contextual WhatsApp Button */}
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="col-span-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-all shadow-sm"
                                                title={`Consultar ${product.name} por WhatsApp`}
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================
                5. SECCIÓN CIENCIA, EXPERIENCIA Y COMPROMISO (Mockup)
            ======================================================== */}
            <section className="py-20 bg-slate-50 border-t border-slate-200" id="laboratorio">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
                        <div className="lg:col-span-6 space-y-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                                Autoridad Farmacéutica
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                                Ciencia, experiencia <br /> y compromiso
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                En <strong>BOOZ Laboratorio VGME, C.A.</strong> trabajamos con los más rigurosos estándares de Buenas Prácticas de Manufactura (BPM) para desarrollar medicamentos y tratamientos seguros, estables y de alta eficacia clínica.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/casos-clinicos"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                                >
                                    <span>Conoce más sobre nuestra evidencia</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                                <img
                                    src="/assets/img/lab_view.png"
                                    alt="Laboratorio Booz"
                                    className="w-full h-auto object-cover max-h-[320px]"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3 Tarjetas de Autoridad del Mockup */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                                <Microscope className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Evidencia</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Información científica, ensayos de biodisponibilidad y estudios clínicos que respaldan cada una de nuestras formulaciones.
                            </p>
                            <Link href="/casos-clinicos" className="text-xs font-bold text-blue-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                Explorar <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                                <Award className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Casos de éxito</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Experiencias reales documentadas por médicos dermatólogos y traumatólogos que reflejan resultados favorables y seguridad.
                            </p>
                            <Link href="/casos-clinicos" className="text-xs font-bold text-indigo-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                Explorar <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Conocimiento</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Artículos especializados, glosario farmacéutico técnico y recursos pedagógicos para la comunidad de la salud.
                            </p>
                            <Link href="/glosario" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                Explorar <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                6. TESTIMONIOS: EXPERIENCIAS QUE HABLAN POR NOSOTROS (Mockup)
            ======================================================== */}
            <section className="py-20 bg-white" id="nosotros">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">
                            Respaldo Profesional
                        </span>
                        <h2 className="text-3xl font-black text-blue-950 tracking-tight">
                            Experiencias que hablan por nosotros
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((test) => (
                            <div
                                key={test.id}
                                className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative"
                            >
                                <span className="text-4xl font-serif text-blue-200 absolute top-4 left-6">“</span>
                                <p className="text-xs text-slate-600 italic leading-relaxed pt-6 mb-6">
                                    {test.quote}
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                    <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                        {test.author_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">{test.author_name}</h4>
                                        <p className="text-[10px] text-slate-500">{test.author_role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================
                7. FAQ ACCORDION & ESTAMOS PARA ESCUCHARTE (Mockup)
            ======================================================== */}
            <section className="py-20 bg-slate-50 border-t border-slate-200" id="contacto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* FAQ Accordion */}
                        <div className="lg:col-span-7 space-y-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                                Respuestas Claras
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight mb-6">
                                Preguntas frecuentes
                            </h2>

                            <div className="space-y-3">
                                {faqs.map((faq) => {
                                    const isOpen = openFaqId === faq.id;
                                    return (
                                        <div
                                            key={faq.id}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
                                        >
                                            <button
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                                            >
                                                <span>{faq.question}</span>
                                                <ChevronDown
                                                    className={`h-4 w-4 text-slate-400 transition-transform ${
                                                        isOpen ? 'rotate-180 text-blue-600' : ''
                                                    }`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Banner Lira FAQ */}
                            <div
                                onClick={() => setIsLiraOpen(true)}
                                className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white cursor-pointer hover:shadow-lg transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🐾</span>
                                    <div>
                                        <p className="text-xs font-bold">¿No encuentras la respuesta que buscas?</p>
                                        <p className="text-[11px] text-blue-200">Pregúntale a Lira, nuestro asistente virtual inteligente.</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-300" />
                            </div>
                        </div>

                        {/* Estamos para escucharte (3 Botones de Contacto Sanitario) */}
                        <div className="lg:col-span-5 space-y-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                                Atención y Soporte
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight mb-6">
                                Estamos para escucharte
                            </h2>

                            <div className="space-y-4">
                                {/* Card 1: Consultas */}
                                <a
                                    href="https://wa.me/584148873615?text=Hola%20Booz%20Laboratorio,%20deseo%20realizar%20una%20consulta%20técnica"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                                            🎧
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                Consultas
                                            </h4>
                                            <p className="text-xs text-slate-500">¿Necesitas información técnica o médica?</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                        Contactar →
                                    </span>
                                </a>

                                {/* Card 2: Reportar Farmacovigilancia (Regulatorio INH) */}
                                <Link
                                    href="/farmacovigilancia"
                                    className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between hover:border-amber-400 hover:shadow-md transition-all group bg-gradient-to-r from-white to-amber-50/40"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                                            📋
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                                                Reportar (Farmacovigilancia)
                                            </h4>
                                            <p className="text-xs text-slate-500">Notificar reacción adversa o lote (INH)</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                                        Reportar →
                                    </span>
                                </Link>

                                {/* Card 3: Contacto General */}
                                <a
                                    href="mailto:contacto@boozlaboratorio.com"
                                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                            ✉️
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                Sede Corporativa
                                            </h4>
                                            <p className="text-xs text-slate-500">Valle de Guanape / Puerto Ordaz</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:translate-x-1 transition-transform">
                                        Escribir →
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lira Modal */}
            <LiraAssistantModal isOpen={isLiraOpen} onClose={() => setIsLiraOpen(false)} />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </BoozLayout>
    );
}
