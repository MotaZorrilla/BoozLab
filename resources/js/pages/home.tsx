import BoozLayout from '@/layouts/booz-layout';
import { Head, Link } from '@inertiajs/react';
import type { Product, ProductLine, Testimonial, Faq } from '@/types';
import { 
    Sparkles, Search, ShieldCheck, ArrowRight, Bot, 
    MessageCircle, ShieldAlert, FileText, ChevronDown, 
    HeartHandshake, Microscope, Award, BookOpen, Stethoscope,
    Phone, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
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
    const [scrollY, setScrollY] = useState(0);

    // Scroll listener for 3D Hero Perspective Animation
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3D tilt calculation based on scroll
    const tiltFactor = Math.min(scrollY / 500, 1);
    const tiltRotateX = tiltFactor * 22; // Incline forward on scroll
    const tiltRotateY = -tiltFactor * 14; // Perspective angle
    const tiltTranslateY = tiltFactor * 30; // Floats down smoothly
    const tiltScale = 1 - tiltFactor * 0.05;

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
                1. HERO SECTION (Con Animación 3D en Scroll)
            ======================================================== */}
            <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/40 dark:from-[#0A1124] dark:via-[#070C18] dark:to-[#0A1124] py-16 sm:py-24 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-[#002072] dark:text-cyan-300 text-xs font-black uppercase tracking-wider">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" /> Vademécum Clínico Oficial
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-blue-950 dark:text-white leading-[1.1]">
                                La ciencia que <br />
                                <span className="bg-gradient-to-r from-[#002072] via-blue-700 to-cyan-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300 bg-clip-text text-transparent">
                                    transforma el cuidado
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                                Desarrollamos soluciones farmacéuticas y dermatológicas innovadoras, seguras y confiables para el bienestar, la salud familiar y la recuperación tisular avanzada.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <a
                                    href="#productos"
                                    className="px-6 py-3.5 rounded-xl bg-[#002072] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all cursor-pointer"
                                >
                                    Conoce nuestros productos
                                </a>

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
                                >
                                    <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                    <span>¿Qué estás buscando?</span>
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
                                <div>
                                    <span className="block text-2xl font-black text-[#002072] dark:text-cyan-400">18+</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Productos Registrados</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-[#002072] dark:text-cyan-400">4</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Líneas Terapéuticas</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-[#002072] dark:text-cyan-400">100%</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cumplimiento Sanitario</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Showcase con Inclinación 3D en Scroll */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div 
                                className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-blue-900/10 via-white to-indigo-100/50 dark:from-blue-950/40 dark:via-[#0D172E] dark:to-cyan-950/30 p-6 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-2xl shadow-blue-900/10 transition-colors"
                                style={{
                                    transform: `perspective(1000px) rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg) translateY(${tiltTranslateY}px) scale(${tiltScale})`,
                                    transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <img
                                    src="/assets/img/hero_products.png"
                                    alt="Línea de Productos Booz Laboratorio"
                                    className="w-full h-auto object-contain max-h-[380px] drop-shadow-2xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg';
                                    }}
                                />
                                <div className="absolute -bottom-4 right-4 bg-white dark:bg-[#0D172E] px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Calidad Certificada</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Valle de Guanape, Venezuela</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                2. LÍNEAS DE PRODUCTO (4 Líneas Terapéuticas)
            ======================================================== */}
            <section className="py-20 bg-white dark:bg-[#0A1124] transition-colors duration-300" id="lineas">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                            Especialización Terapéutica
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-blue-950 dark:text-white tracking-tight">
                            Nuestras Líneas de Producto
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Formulaciones científicas de alta biodisponibilidad desarrolladas para cubrir integralmente la salud dérmica y el bienestar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productLines.map((line) => {
                            const isSelected = selectedLineId === line.id;
                            const count = products.filter((p) => p.product_line_id === line.id).length;

                            return (
                                <div
                                    key={line.id}
                                    onClick={() => {
                                        setSelectedLineId(isSelected ? null : line.id);
                                        const el = document.getElementById('productos');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`group rounded-3xl p-6 text-white cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                                        line.id === 1
                                            ? 'bg-gradient-to-br from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800'
                                            : line.id === 2
                                            ? 'bg-gradient-to-br from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800'
                                            : line.id === 3
                                            ? 'bg-gradient-to-br from-cyan-900 to-blue-950 hover:from-cyan-800 hover:to-blue-900'
                                            : 'bg-gradient-to-br from-slate-900 to-blue-950 hover:from-slate-800 hover:to-blue-900'
                                    } ${isSelected ? 'ring-4 ring-blue-400 scale-[1.02] shadow-2xl' : 'hover:scale-[1.02] shadow-lg'}`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20">
                                                {count} Productos
                                            </span>
                                            <span className="text-2xl">
                                                {line.id === 1 ? '🧴' : line.id === 2 ? '💊' : line.id === 3 ? '🌿' : '🔬'}
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
                3. BENTO GRID INTERACTIVO (Con Lira Animado en Bucle)
            ======================================================== */}
            <section className="py-16 bg-slate-50 dark:bg-[#070C18] border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Columna 1: ¿Qué necesitas? Selector de necesidad */}
                        <div className="lg:col-span-4 bg-white dark:bg-[#0D172E] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
                            <div>
                                <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-2">¿Qué necesitas?</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
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
                                            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                                                selectedNeed === need.name
                                                    ? 'bg-[#002072] text-white border-[#002072] shadow-md'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700'
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
                                    className="mt-6 text-xs text-blue-600 dark:text-cyan-400 font-bold underline cursor-pointer"
                                >
                                    Limpiar filtro de necesidad ✕
                                </button>
                            )}
                        </div>

                        {/* Columna 2: Hola, soy Lira - Tu asistente virtual (Con Lira Animado Saludando) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-[#002072] via-indigo-950 to-slate-950 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden border border-blue-900/40">
                            <div className="relative w-36 h-36 flex-shrink-0">
                                <img
                                    src="/assets/img/lira_saludo_animado.gif"
                                    alt="Lira Asistente Virtual Saludando"
                                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/lira_real_head_avatar.png';
                                    }}
                                />
                            </div>
                            <div className="space-y-3 text-center sm:text-left">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                                    IA Médica
                                </span>
                                <h3 className="text-2xl font-black leading-tight">
                                    Hola, soy Lira <br />
                                    <span className="text-cyan-300 font-normal text-lg">Tu asistente virtual</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Estoy aquí para orientarte sobre nuestros medicamentos, líneas terapéuticas y formulaciones oficiales de Booz Laboratorio.
                                </p>
                                <button
                                    onClick={() => setIsLiraOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-950 font-black text-xs hover:bg-blue-50 shadow-lg transition-all cursor-pointer"
                                >
                                    <img
                                        src="/assets/img/lira_head_avatar.png"
                                        alt="Lira"
                                        className="h-4 w-4 rounded-full object-cover"
                                    />
                                    <span>Hablar con Lira</span>
                                </button>
                            </div>
                        </div>

                        {/* Columna 3: ¿Ya sabes lo que buscas? */}
                        <div className="lg:col-span-3 bg-white dark:bg-[#0D172E] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
                            <div>
                                <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-2">¿Ya sabes lo que buscas?</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Encuentra fichas técnicas, presentaciones y disponibilidad en nuestro vademécum.
                                </p>
                                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center">
                                    <img
                                        src="/assets/img/product_3.png"
                                        alt="Catálogo"
                                        className="h-24 object-contain"
                                    />
                                </div>
                            </div>

                            <a
                                href="#productos"
                                className="mt-6 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs text-center block transition-colors"
                            >
                                Explorar catálogo completo →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                4. CATÁLOGO POR SECCIONES (Líneas Terapéuticas Interactivas)
            ======================================================== */}
            <section className="py-20 bg-white dark:bg-[#0A1124] transition-colors duration-300" id="productos">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header del Catálogo */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 block mb-1">
                                Portafolio Clínico Oficial
                            </span>
                            <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
                                Catálogo Farmacéutico Booz
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Botones de Selección por Sección / Línea Terapéutica */}
                    <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                        {/* Botón: Todos los Productos */}
                        <button
                            onClick={() => setSelectedLineId(null)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                selectedLineId === null
                                    ? 'bg-[#002072] text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <span>Todos los Productos</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                                {products.length}
                            </span>
                        </button>

                        {/* 4 Botones de Líneas de Producto Directas */}
                        {productLines.map((line) => {
                            const isSelected = selectedLineId === line.id;
                            const count = products.filter((p) => p.product_line_id === line.id).length;
                            const icon = line.id === 1 ? '🧴' : line.id === 2 ? '💊' : line.id === 3 ? '🌿' : '🔬';

                            return (
                                <button
                                    key={line.id}
                                    onClick={() => setSelectedLineId(isSelected ? null : line.id)}
                                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                        isSelected
                                            ? 'bg-[#002072] text-white shadow-lg shadow-blue-900/20 ring-2 ring-cyan-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                                    }`}
                                >
                                    <span className="text-sm">{icon}</span>
                                    <span>{line.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Banner de Contexto de la Línea Seleccionada */}
                    {selectedLineId && (
                        <div className="mb-8 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {selectedLineId === 1 ? '🧴' : selectedLineId === 2 ? '💊' : selectedLineId === 3 ? '🌿' : '🔬'}
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-[#002072] dark:text-cyan-400">
                                        Línea: {productLines.find((l) => l.id === selectedLineId)?.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                                        {productLines.find((l) => l.id === selectedLineId)?.description}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLineId(null)}
                                className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer flex-shrink-0"
                            >
                                Ver todas las líneas ✕
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const whatsappUrl = `https://wa.me/584148873615?text=${encodeURIComponent(
                                `Hola Booz Laboratorio, deseo consultar sobre ${product.name} (${product.presentation})`
                            )}`;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white dark:bg-[#0D172E] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-2xl hover:border-blue-300 dark:hover:border-cyan-500/50 transition-all duration-300"
                                >
                                    <div>
                                        {/* Product Image & Badges */}
                                        <div className="relative w-full aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 mb-4 flex items-center justify-center overflow-hidden group-hover:bg-blue-50/50 dark:group-hover:bg-slate-800 transition-colors">
                                            <img
                                                src={product.image_path}
                                                alt={product.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                }}
                                            />
                                            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
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
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                                            {product.name}
                                        </h4>

                                        <p className="text-xs font-semibold text-[#002072] dark:text-cyan-400 mb-2 line-clamp-1">
                                            {product.active_ingredients}
                                        </p>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span className="text-[10px] font-medium">{product.presentation}</span>
                                        </div>

                                        <div className="grid grid-cols-5 gap-2">
                                            {/* Link to Dedicated PDP */}
                                            <Link
                                                href={`/producto/${product.slug}`}
                                                className="col-span-4 py-2.5 px-3 rounded-xl bg-[#002072] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                            >
                                                <span>Ficha Médica</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>

                                            {/* Contextual WhatsApp Button */}
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="col-span-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
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
                5. SECCIÓN DE CIENCIA Y AUTORIDAD CLÍNICA
            ======================================================== */}
            <section className="py-20 bg-slate-50 dark:bg-[#070C18] border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                                Autoridad Sanitaria y Calidad
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-blue-950 dark:text-white tracking-tight">
                                Rigor Farmacéutico y Buenas Prácticas de Manufactura
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                En <strong>BOOZ LABORATORIO VGME, C.A.</strong>, cada una de nuestras líneas terapéuticas es sometida a estrictos controles fisicoquímicos y microbiológicos. Operamos bajo las directrices del Instituto Nacional de Higiene "Rafael Rangel" (INH), asegurando eficacia terapéutica y máxima estabilidad en cada lote.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
                                    <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Estabilidad Garantizada</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Ensayos clínicos en zonas climáticas IVb.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
                                    <Microscope className="h-6 w-6 text-blue-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Control de Biofilm</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Innovación activa en apósitos y cremas dérmicas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video bg-blue-950 flex items-center justify-center p-8">
                                <img
                                    src="/assets/img/booz_official_logo_full.png"
                                    alt="Laboratorio Booz"
                                    className="max-h-52 object-contain filter drop-shadow-xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/product_2.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                6. TESTIMONIOS Y AVALES MÉDICOS
            ======================================================== */}
            <section className="py-20 bg-white dark:bg-[#0A1124] transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                            Aval Clínico
                        </span>
                        <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
                            La Confianza de los Especialistas
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0D172E] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-sm transition-colors"
                            >
                                <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                                    "{t.comment}"
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                                    <div className="h-10 w-10 rounded-full bg-[#002072] text-white font-black text-xs flex items-center justify-center shadow-md">
                                        {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.specialty} • {t.institution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================
                7. PREGUNTAS FRECUENTES (FAQS)
            ======================================================== */}
            <section className="py-20 bg-slate-50 dark:bg-[#070C18] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                            Resolución de Dudas
                        </span>
                        <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
                            Preguntas Frecuentes
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => {
                            const isOpen = openFaqId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className="rounded-2xl bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180 text-blue-600 dark:text-cyan-400' : ''
                                            }`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 animate-fadeIn">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Modals */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <LiraAssistantModal isOpen={isLiraOpen} onClose={() => setIsLiraOpen(false)} />
        </BoozLayout>
    );
}
