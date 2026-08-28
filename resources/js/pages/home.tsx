import { Head, Link } from '@inertiajs/react';
import {
    Sparkles,
    Search,
    ShieldCheck,
    ArrowRight,
    MessageCircle,
    ChevronDown,
    Microscope,
    ShoppingBag,
    Send,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import LiraAssistantModal from '@/components/lira-assistant-modal';
import SearchModal from '@/components/search-modal';
import BoozLayout from '@/layouts/booz-layout';
import type { Product, ProductLine, Testimonial, Faq } from '@/types';

interface HomeProps {
    productLines: ProductLine[];
    products: Product[];
    testimonials: Testimonial[];
    faqs: Faq[];
}

export default function Home({
    productLines = [],
    products = [],
    testimonials = [],
    faqs = [],
}: HomeProps) {
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);
    const [isLiraOpen, setIsLiraOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
    const [scrollY, setScrollY] = useState(0);

    // Contact Form Tab State
    const [contactTab, setContactTab] = useState<
        'consulta' | 'reportar' | 'contacto'
    >('consulta');
    const [formSent, setFormSent] = useState(false);
    const [isHomeSubmitting, setIsHomeSubmitting] = useState(false);
    const [homeFormError, setHomeFormError] = useState<string | null>(null);
    const [homeForm, setHomeForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        product_name: '',
    });

    // Scroll listener optimizado con requestAnimationFrame para animación 3D del Hero
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3D tilt calculation based on scroll
    const tiltFactor = Math.min(scrollY / 450, 1);
    const tiltRotateX = tiltFactor * 20; // Incline forward on scroll
    const tiltRotateY = -tiltFactor * 12; // Perspective angle
    const tiltTranslateY = tiltFactor * 25; // Floats down smoothly
    const tiltScale = 1 - tiltFactor * 0.04;

    // Dynamic filtering for catalog
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesLine =
                selectedLineId === null || p.product_line_id === selectedLineId;
            const matchesSearch =
                searchQuery === '' ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.active_ingredients
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesNeed =
                selectedNeed === null ||
                (selectedNeed === 'Cuidado' &&
                    (p.product_line_id === 1 ||
                        p.description.toLowerCase().includes('cuidado') ||
                        p.description.toLowerCase().includes('hidratan'))) ||
                (selectedNeed === 'Protección' &&
                    (p.description.toLowerCase().includes('protec') ||
                        p.description.toLowerCase().includes('barrera') ||
                        p.description.toLowerCase().includes('biofilm'))) ||
                (selectedNeed === 'Tratamiento' &&
                    (p.product_line_id === 2 ||
                        p.description.toLowerCase().includes('infecci') ||
                        p.description.toLowerCase().includes('inflama'))) ||
                (selectedNeed === 'Bienestar' &&
                    (p.product_line_id === 3 ||
                        p.description.toLowerCase().includes('vitamina') ||
                        p.description.toLowerCase().includes('recupera'))) ||
                (selectedNeed === 'Especializado' &&
                    (p.product_line_id === 4 ||
                        p.description.toLowerCase().includes('diabético') ||
                        p.description.toLowerCase().includes('acné')));

            return matchesLine && matchesSearch && matchesNeed;
        });
    }, [products, selectedLineId, searchQuery, selectedNeed]);

    const toggleFaq = (id: number) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    const handleAddToCart = (product: Product) => {
        window.dispatchEvent(
            new CustomEvent('booz:add-to-cart', { detail: product }),
        );
    };

    const getCsrfToken = () =>
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
            ?.content || '';

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsHomeSubmitting(true);
        setHomeFormError(null);

        try {
            if (contactTab === 'reportar') {
                const response = await fetch('/api/farmacovigilancia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify({
                        product_name:
                            homeForm.product_name || 'No especificado',
                        reporter_name: homeForm.name,
                        reporter_contact: homeForm.email || homeForm.phone,
                        adverse_reaction: homeForm.message,
                        reporter_type: 'Paciente',
                        severity: 'Leve',
                    }),
                });
                const data = await response.json();
                if (!response.ok || data.status !== 'success') {
                    setHomeFormError(
                        data.message ||
                            Object.values(data.errors || {})
                                .flat()
                                .join(' '),
                    );
                    return;
                }
            } else {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify({
                        type: contactTab,
                        name: homeForm.name,
                        email: homeForm.email,
                        phone: homeForm.phone || null,
                        message: homeForm.message,
                    }),
                });
                const data = await response.json();
                if (!response.ok || data.status !== 'success') {
                    setHomeFormError(
                        data.message ||
                            Object.values(data.errors || {})
                                .flat()
                                .join(' '),
                    );
                    return;
                }
            }

            setFormSent(true);
            setHomeForm({
                name: '',
                email: '',
                phone: '',
                message: '',
                product_name: '',
            });
            setTimeout(() => setFormSent(false), 5000);
        } catch {
            setHomeFormError(
                'Error de conexión. Intente nuevamente más tarde.',
            );
        } finally {
            setIsHomeSubmitting(false);
        }
    };

    return (
        <BoozLayout>
            <Head title="Booz Laboratorio | La ciencia que transforma el cuidado" />

            {/* ========================================================
                1. HERO SECTION (Compacto & Con Inclinación 3D en Scroll)
            ======================================================== */}
            <section
                className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 py-10 transition-colors duration-300 sm:py-16 lg:py-20 dark:border-slate-800 dark:from-[#0A1124] dark:via-[#070C18] dark:to-[#0A1124]"
                id="hero"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Hero Text */}
                        <div className="space-y-4 text-center sm:space-y-6 lg:col-span-7 lg:text-left">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1 text-[11px] font-black tracking-wider text-[#002072] uppercase sm:text-xs dark:border-blue-800 dark:bg-blue-900/40 dark:text-cyan-300">
                                <Sparkles className="h-3 w-3 text-blue-600 dark:text-cyan-400" />{' '}
                                Vademécum Clínico Oficial
                            </span>

                            <h1 className="text-3xl leading-[1.15] font-black tracking-tight text-blue-950 sm:text-5xl lg:text-6xl dark:text-white">
                                La ciencia que <br />
                                <span className="bg-gradient-to-r from-[#002072] via-blue-700 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300">
                                    transforma el cuidado
                                </span>
                            </h1>

                            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base lg:mx-0 lg:text-lg dark:text-slate-300">
                                Desarrollamos soluciones farmacéuticas y
                                dermatológicas de máxima pureza para el
                                bienestar integral, la salud familiar y la
                                cicatrización tisular avanzada.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 lg:justify-start">
                                <a
                                    href="#productos"
                                    className="cursor-pointer rounded-xl bg-[#002072] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-xl sm:px-6 sm:text-sm dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    Conoce nuestros productos
                                </a>

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 sm:px-5 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                    <span>¿Qué estás buscando?</span>
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-4 sm:gap-4 sm:pt-6 dark:border-slate-800">
                                <div>
                                    <span className="block text-xl font-black text-[#002072] sm:text-2xl dark:text-cyan-400">
                                        18+
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                                        Registrados
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xl font-black text-[#002072] sm:text-2xl dark:text-cyan-400">
                                        4
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                                        Líneas Clínicas
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xl font-black text-[#002072] sm:text-2xl dark:text-cyan-400">
                                        100%
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                                        Aprobado INH
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Showcase con Inclinación 3D en Scroll */}
                        <div className="relative flex justify-center lg:col-span-5">
                            <div
                                className="relative flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl border border-blue-100 bg-gradient-to-tr from-blue-900/10 via-white to-indigo-100/50 p-4 shadow-2xl shadow-blue-900/10 transition-colors sm:max-w-md sm:p-6 dark:border-blue-900/40 dark:from-blue-950/40 dark:via-[#0D172E] dark:to-cyan-950/30"
                                style={{
                                    transform: `perspective(1000px) rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg) translateY(${tiltTranslateY}px) scale(${tiltScale})`,
                                    transition:
                                        'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <img
                                    src="/assets/img/hero_products.png"
                                    alt="Línea de Productos Booz Laboratorio"
                                    className="h-auto max-h-[300px] w-full object-contain drop-shadow-2xl sm:max-h-[380px]"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg';
                                    }}
                                />
                                <div className="absolute right-3 -bottom-3 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-xl sm:right-4 sm:-bottom-4 sm:gap-3 sm:px-4 sm:py-2.5 dark:border-slate-800 dark:bg-[#0D172E]">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 sm:text-xs dark:text-white">
                                            Calidad Certificada
                                        </p>
                                        <p className="text-[9px] text-slate-500 sm:text-[10px] dark:text-slate-400">
                                            Valle de Guanape, Venezuela
                                        </p>
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
            <section
                className="bg-white py-12 transition-colors duration-300 sm:py-16 dark:bg-[#0A1124]"
                id="lineas"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-10 max-w-3xl space-y-2 text-center sm:mb-14">
                        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                            Especialización Terapéutica
                        </span>
                        <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl lg:text-4xl dark:text-white">
                            Nuestras 4 Líneas de Productos
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Formulaciones científicas de alta biodisponibilidad
                            desarrolladas para cubrir integralmente la salud
                            dérmica y el bienestar familiar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        {productLines.map((line) => {
                            const isSelected = selectedLineId === line.id;
                            const count = products.filter(
                                (p) => p.product_line_id === line.id,
                            ).length;

                            return (
                                <div
                                    key={line.id}
                                    onClick={() => {
                                        setSelectedLineId(
                                            isSelected ? null : line.id,
                                        );
                                        const el =
                                            document.getElementById(
                                                'productos',
                                            );
                                        el?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                    }}
                                    className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-5 text-white transition-all duration-300 sm:rounded-3xl sm:p-6 ${
                                        line.id === 1
                                            ? 'bg-gradient-to-br from-[#002072] to-blue-900 hover:from-blue-900 hover:to-indigo-900'
                                            : line.id === 2
                                              /* CERTIFICADO OFICIAL: PANTONE 506 C Borgoña/Vinotinto Booz */
                                              ? 'bg-gradient-to-br from-[#581827] via-[#842D44] to-[#3B0E19] hover:from-[#6E1E31] hover:to-[#4A1220]'
                                              : line.id === 3
                                                ? 'bg-gradient-to-br from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900'
                                                : 'bg-gradient-to-br from-slate-900 to-blue-950 hover:from-slate-800 hover:to-blue-900'
                                    } ${isSelected ? 'scale-[1.02] shadow-2xl ring-4 ring-cyan-400' : 'shadow-lg hover:scale-[1.02]'}`}
                                >
                                    <div>
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase">
                                                {count} Productos
                                            </span>
                                            <span className="text-2xl">
                                                {line.id === 1
                                                    ? '🧴'
                                                    : line.id === 2
                                                      ? '💊'
                                                      : line.id === 3
                                                        ? '🌿'
                                                        : '🔬'}
                                            </span>
                                        </div>

                                        <h3 className="mb-2 text-lg leading-snug font-bold sm:text-xl">
                                            {line.name}
                                        </h3>

                                        <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">
                                            {line.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 sm:pt-6">
                                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-center text-xs font-bold transition-colors hover:bg-white/20">
                                            <span>
                                                {isSelected
                                                    ? 'Línea Seleccionada ✓'
                                                    : 'Ver productos'}
                                            </span>
                                            <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================
                3. BENTO GRID INTERACTIVO (Lira Animado en Bucle)
            ======================================================== */}
            <section className="border-y border-slate-200 bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:border-slate-800 dark:bg-[#070C18]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-12">
                        {/* Columna 1: ¿Qué necesitas? Selector de necesidad */}
                        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:rounded-3xl sm:p-8 lg:col-span-4 dark:border-slate-800 dark:bg-[#0D172E]">
                            <div>
                                <h3 className="mb-1.5 text-lg font-bold text-blue-950 sm:text-xl dark:text-white">
                                    ¿Qué necesitas?
                                </h3>
                                <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">
                                    Encuentra el producto ideal según tu
                                    necesidad clínica inmediata.
                                </p>

                                <div className="grid grid-cols-2 gap-2">
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
                                                setSelectedNeed(
                                                    selectedNeed === need.name
                                                        ? null
                                                        : need.name,
                                                );
                                                const el =
                                                    document.getElementById(
                                                        'productos',
                                                    );
                                                el?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                            }}
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all sm:p-3 ${
                                                selectedNeed === need.name
                                                    ? 'border-[#002072] bg-[#002072] text-white shadow-md'
                                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <span className="text-sm">
                                                {need.icon}
                                            </span>
                                            <span className="truncate">
                                                {need.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedNeed && (
                                <button
                                    onClick={() => setSelectedNeed(null)}
                                    className="mt-4 cursor-pointer text-xs font-bold text-blue-600 underline dark:text-cyan-400"
                                >
                                    Limpiar filtro ✕
                                </button>
                            )}
                        </div>

                        {/* Columna 2: Hola, soy Lira - Tu asistente virtual (Con Lira Animado Saludando) */}
                        <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-[#002072] via-indigo-950 to-slate-950 p-6 text-white shadow-xl sm:flex-row sm:gap-6 sm:rounded-3xl sm:p-8 lg:col-span-5">
                            <div className="relative h-28 w-28 flex-shrink-0 sm:h-36 sm:w-36">
                                <img
                                    src="/assets/img/lira_saludo_animado.gif"
                                    alt="Lira Asistente Virtual Saludando"
                                    className="h-full w-full object-contain drop-shadow-2xl transition-transform hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/lira_real_head_avatar.png';
                                    }}
                                />
                            </div>
                            <div className="space-y-2.5 text-center sm:text-left">
                                <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/30 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-blue-200 uppercase">
                                    IA Médica
                                </span>
                                <h3 className="text-xl leading-tight font-black sm:text-2xl">
                                    Hola, soy Lira <br />
                                    <span className="text-base font-normal text-cyan-300 sm:text-lg">
                                        Tu asistente virtual
                                    </span>
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-300">
                                    Orientación sobre medicamentos, líneas
                                    terapéuticas y formulaciones oficiales de
                                    Booz Laboratorio.
                                </p>
                                <button
                                    onClick={() => setIsLiraOpen(true)}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black text-blue-950 shadow-lg transition-all hover:bg-blue-50 sm:px-5 sm:py-2.5"
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
                        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:rounded-3xl sm:p-8 lg:col-span-3 dark:border-slate-800 dark:bg-[#0D172E]">
                            <div>
                                <h3 className="mb-1.5 text-lg font-bold text-blue-950 sm:text-xl dark:text-white">
                                    Bolsa & Tienda
                                </h3>
                                <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">
                                    Arma tu lista de pedidos y solicita
                                    cotización directa por WhatsApp para tu
                                    droguería o farmacia.
                                </p>
                                <div className="flex items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-950/40">
                                    <img
                                        src="/assets/img/product_3.png"
                                        alt="Catálogo"
                                        className="h-20 object-contain sm:h-24"
                                    />
                                </div>
                            </div>

                            <a
                                href="#productos"
                                className="mt-4 block w-full rounded-xl bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                Ver catálogo completo →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                4. CATÁLOGO POR SECCIONES & TIENDA (Compacto Mobile 2 Columnas)
            ======================================================== */}
            <section
                className="bg-white py-12 transition-colors duration-300 sm:py-20 dark:bg-[#0A1124]"
                id="productos"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header del Catálogo */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
                        <div>
                            <span className="mb-1 block text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                Portafolio Clínico Oficial
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl dark:text-white">
                                Catálogo Farmacéutico & Tienda
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Mostrando {filteredProducts.length} productos
                                registrados ante las autoridades sanitarias.
                            </p>
                        </div>

                        {/* Search in Catalog Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar medicamento o principio..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs text-slate-900 transition-colors outline-none focus:border-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Botones de Selección por Sección / Línea Terapéutica con Scroll Horizontal Móvil */}
                    <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-1 border-b border-slate-100 dark:border-slate-800">
                        {/* Botón: Todos los Productos */}
                        <button
                            onClick={() => setSelectedLineId(null)}
                            className={`flex-shrink-0 flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all min-h-[38px] ${
                                selectedLineId === null
                                    ? 'bg-[#002072] text-white shadow-md shadow-blue-900/20'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            <span>Todos</span>
                            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                                {products.length}
                            </span>
                        </button>

                        {/* 4 Botones de Líneas de Producto Directas */}
                        {productLines.map((line) => {
                            const isSelected = selectedLineId === line.id;
                            const count = products.filter(
                                (p) => p.product_line_id === line.id,
                            ).length;
                            const icon =
                                line.id === 1
                                    ? '🧴'
                                    : line.id === 2
                                      ? '💊'
                                      : line.id === 3
                                        ? '🌿'
                                        : '🔬';

                            return (
                                <button
                                    key={line.id}
                                    onClick={() =>
                                        setSelectedLineId(
                                            isSelected ? null : line.id,
                                        )
                                    }
                                    className={`flex-shrink-0 flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all min-h-[38px] ${
                                        isSelected
                                            ? line.id === 2
                                                ? 'bg-[#842D44] text-white shadow-md ring-2 ring-rose-300'
                                                : 'bg-[#002072] text-white shadow-md ring-2 shadow-blue-900/20 ring-cyan-400'
                                            : 'border border-slate-200/60 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <span className="text-sm">{icon}</span>
                                    <span>{line.name}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Banner de Contexto de la Línea Seleccionada */}
                    {selectedLineId && (
                        <div className="animate-fadeIn mb-6 flex flex-col items-start justify-between gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/80 p-3.5 sm:flex-row sm:items-center dark:border-blue-900/50 dark:bg-blue-950/40">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">
                                    {selectedLineId === 1
                                        ? '🧴'
                                        : selectedLineId === 2
                                          ? '💊'
                                          : selectedLineId === 3
                                            ? '🌿'
                                            : '🔬'}
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-[#002072] dark:text-cyan-400">
                                        Línea:{' '}
                                        {
                                            productLines.find(
                                                (l) => l.id === selectedLineId,
                                            )?.name
                                        }
                                    </h4>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                                        {
                                            productLines.find(
                                                (l) => l.id === selectedLineId,
                                            )?.description
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLineId(null)}
                                className="flex-shrink-0 cursor-pointer text-[11px] font-bold text-blue-600 hover:underline dark:text-cyan-400"
                            >
                                Ver todas las líneas ✕
                            </button>
                        </div>
                    )}

                    {/* Products Grid: 2 COLUMNAS EN CELULAR (Mobile First) */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const whatsappUrl = `https://wa.me/584148873615?text=${encodeURIComponent(
                                `Hola Booz Laboratorio, deseo consultar sobre ${product.name} (${product.presentation})`,
                            )}`;

                            return (
                                <div
                                    key={product.id}
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3 transition-all duration-300 hover:border-blue-300 hover:shadow-xl sm:rounded-3xl sm:p-5 dark:border-slate-800 dark:bg-[#0D172E] dark:hover:border-cyan-500/50"
                                >
                                    <div>
                                        {/* Product Image & Badges */}
                                        <div className="relative mb-2.5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 transition-colors group-hover:bg-blue-50/50 sm:mb-4 sm:rounded-2xl sm:p-4 dark:bg-slate-800/60 dark:group-hover:bg-slate-800">
                                            <img
                                                src={product.image_path}
                                                alt={product.name}
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        '/assets/img/product_1.png';
                                                }}
                                            />
                                            <span className="absolute top-2 left-2 rounded border border-slate-200 bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-slate-700 shadow-sm sm:text-[10px] dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                                                {product.product_line?.name ||
                                                    'Booz'}
                                            </span>
                                            {product.is_prescription_required ? (
                                                <span className="absolute top-2 right-2 rounded bg-amber-500 px-1.5 py-0.5 text-[7px] font-bold text-white shadow-sm sm:text-[9px]">
                                                    Récipe
                                                </span>
                                            ) : (
                                                <span className="absolute top-2 right-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[7px] font-bold text-white shadow-sm sm:text-[9px]">
                                                    Libre
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <h4 className="mb-0.5 line-clamp-1 text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:mb-1 sm:text-base dark:text-white dark:group-hover:text-cyan-400">
                                            {product.name}
                                        </h4>

                                        <p className="mb-1 line-clamp-1 text-[10px] font-semibold text-[#002072] sm:mb-2 sm:text-xs dark:text-cyan-400">
                                            {product.active_ingredients}
                                        </p>

                                        <p className="mb-2 line-clamp-2 text-[10px] leading-tight text-slate-500 sm:mb-3 sm:text-[11px] sm:leading-relaxed dark:text-slate-400">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons: Ficha (Full width) + Pedido & WhatsApp (Grid 2 cols con Touch Targets ≥ 36px) */}
                                    <div className="space-y-2 border-t border-slate-100 pt-2.5 sm:pt-3 dark:border-slate-800">
                                        <div className="flex items-center justify-between text-[9px] text-slate-400 sm:text-[10px]">
                                            <span className="truncate">
                                                {product.presentation}
                                            </span>
                                        </div>

                                        {/* Fila 1: Botón Principal Ficha Médica */}
                                        <Link
                                            href={`/producto/${product.slug}`}
                                            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#002072] px-3 py-2 text-center text-xs font-bold text-white transition-all hover:bg-blue-800 active:scale-[0.98] min-h-[36px] sm:min-h-[40px] dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm"
                                            aria-label={`Ver ficha médica completa de ${product.name}`}
                                        >
                                            <span>Ficha Técnica</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>

                                        {/* Fila 2: Acciones Rápidas (+ Pedido y WhatsApp) */}
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-blue-200/80 bg-blue-50/90 px-2 py-2 text-[11px] font-bold text-[#002072] transition-all hover:bg-blue-100 active:scale-[0.97] min-h-[36px] dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-slate-700"
                                                title="Añadir a la bolsa de pedidos"
                                                aria-label={`Añadir ${product.name} a la bolsa`}
                                            >
                                                <ShoppingBag className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                                                <span>+ Pedido</span>
                                            </button>

                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-emerald-600 px-2 py-2 text-[11px] font-bold text-white transition-all hover:bg-emerald-500 active:scale-[0.97] min-h-[36px] shadow-sm shadow-emerald-600/20"
                                                title={`Consultar ${product.name} por WhatsApp`}
                                                aria-label={`Consultar ${product.name} por WhatsApp`}
                                            >
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                <span>WhatsApp</span>
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
                5. SECCIÓN DE CONOCIMIENTO & AUTORIDAD CLÍNICA
            ======================================================== */}
            <section
                className="border-y border-slate-200 bg-slate-50 py-12 transition-colors duration-300 sm:py-20 dark:border-slate-800 dark:bg-[#070C18]"
                id="conocimiento"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
                        <div className="space-y-4 sm:space-y-6">
                            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                Autoridad Sanitaria y Calidad
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl lg:text-4xl dark:text-white">
                                Rigor Farmacéutico y Buenas Prácticas de
                                Manufactura
                            </h2>
                            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                En <strong>BOOZ LABORATORIO VGME, C.A.</strong>,
                                cada una de nuestras líneas terapéuticas es
                                sometida a estrictos controles fisicoquímicos y
                                microbiológicos. Operamos bajo las directrices
                                del Instituto Nacional de Higiene "Rafael
                                Rangel" (INH), asegurando eficacia terapéutica y
                                máxima estabilidad en cada lote.
                            </p>

                            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 sm:gap-4">
                                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Estabilidad Garantizada
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Ensayos clínicos en zonas climáticas
                                            IVb.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                    <Microscope className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-cyan-400" />
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Control de Biofilm
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Innovación activa en apósitos y
                                            cremas dérmicas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-blue-950 p-6 shadow-xl sm:rounded-3xl sm:p-8 dark:border-slate-800">
                                <img
                                    src="/assets/img/booz_official_logo_full.png"
                                    alt="Laboratorio Booz"
                                    className="max-h-36 object-contain drop-shadow-xl filter sm:max-h-52"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/product_2.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                6. NOSOTROS & TESTIMONIOS MÉDICOS
            ======================================================== */}
            <section
                className="bg-white py-12 transition-colors duration-300 sm:py-20 dark:bg-[#0A1124]"
                id="nosotros"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-10 max-w-2xl space-y-2 text-center sm:mb-16">
                        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                            Aval Clínico
                        </span>
                        <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl dark:text-white">
                            La Confianza de los Especialistas
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
                        {testimonials.map((t) => {
                            const authorName = t.author_name || '';
                            const quoteText = t.quote || '';
                            const roleText =
                                t.author_role || 'Profesional de la Salud';
                            const initials = authorName
                                .split(' ')
                                .filter(Boolean)
                                .map((n: string) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase();

                            return (
                                <div
                                    key={t.id}
                                    className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm transition-colors sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-[#0D172E]"
                                >
                                    <p className="mb-6 text-xs leading-relaxed text-slate-600 italic dark:text-slate-300">
                                        "{quoteText}"
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-slate-200/60 pt-4 dark:border-slate-800">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#002072] text-xs font-black text-white shadow-md">
                                            {initials || 'BZ'}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                {authorName}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                {roleText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================
                7. CONTACTO & FARMACOVIGILANCIA (Fiel al Mockup Oficial)
            ======================================================== */}
            <section
                className="border-y border-slate-200 bg-slate-50 py-12 transition-colors duration-300 sm:py-20 dark:border-slate-800 dark:bg-[#070C18]"
                id="contacto"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Accordion FAQ */}
                        <div className="space-y-4 lg:col-span-6">
                            <span className="block text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                Resolución de Dudas
                            </span>
                            <h2 className="mb-4 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl dark:text-white">
                                Preguntas Frecuentes
                            </h2>
                            <div className="space-y-3">
                                {faqs.map((faq) => {
                                    const isOpen = openFaqId === faq.id;
                                    return (
                                        <div
                                            key={faq.id}
                                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all sm:rounded-2xl dark:border-slate-800 dark:bg-[#0D172E]"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggleFaq(faq.id)
                                                }
                                                className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left text-xs font-bold text-slate-900 transition-colors hover:text-blue-600 sm:text-sm dark:text-white dark:hover:text-cyan-400"
                                            >
                                                <span>{faq.question}</span>
                                                <ChevronDown
                                                    className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                                                        isOpen
                                                            ? 'rotate-180 text-blue-600 dark:text-cyan-400'
                                                            : ''
                                                    }`}
                                                />
                                            </button>

                                            {isOpen && (
                                                <div className="animate-fadeIn border-t border-slate-100 px-4 pt-3 pb-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800/80 dark:text-slate-300">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interactive Contact & Report Form */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors sm:rounded-3xl sm:p-8 lg:col-span-6 dark:border-slate-800 dark:bg-[#0D172E]">
                            <h3 className="mb-2 text-xl font-black text-blue-950 dark:text-white">
                                Estamos para escucharte
                            </h3>
                            <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
                                Selecciona el canal correspondiente para
                                canalizar tu solicitud con la dirección médica.
                            </p>

                            {/* Form Tabs */}
                            <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                                <button
                                    onClick={() => setContactTab('consulta')}
                                    className={`cursor-pointer rounded-lg py-2 text-[11px] font-bold transition-all ${
                                        contactTab === 'consulta'
                                            ? 'bg-white text-[#002072] shadow-sm dark:bg-[#0A1124] dark:text-cyan-400'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    Consultas
                                </button>
                                <button
                                    onClick={() => setContactTab('reportar')}
                                    className={`cursor-pointer rounded-lg py-2 text-[11px] font-bold transition-all ${
                                        contactTab === 'reportar'
                                            ? 'bg-white text-red-600 shadow-sm dark:bg-[#0A1124] dark:text-red-400'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    Reportar Evento
                                </button>
                                <button
                                    onClick={() => setContactTab('contacto')}
                                    className={`cursor-pointer rounded-lg py-2 text-[11px] font-bold transition-all ${
                                        contactTab === 'contacto'
                                            ? 'bg-white text-emerald-600 shadow-sm dark:bg-[#0A1124] dark:text-emerald-400'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    Comercial
                                </button>
                            </div>

                            {formSent ? (
                                <div className="animate-fadeIn space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
                                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
                                        ✓
                                    </div>
                                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                        {contactTab === 'reportar'
                                            ? 'Reporte registrado satisfactoriamente'
                                            : 'Mensaje recibido satisfactoriamente'}
                                    </h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                        {contactTab === 'reportar'
                                            ? 'Nuestro equipo de Farmacovigilancia y Dirección Médica revisará tu reporte.'
                                            : 'Nuestro equipo te responderá a la brevedad.'}
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleContactSubmit}
                                    className="space-y-3.5 text-xs"
                                >
                                    {homeFormError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                                            {homeFormError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                            {contactTab === 'reportar'
                                                ? 'Nombre del Notificador (Médico o Paciente)'
                                                : 'Nombre Completo'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={homeForm.name}
                                            onChange={(e) =>
                                                setHomeForm({
                                                    ...homeForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Ej. Dr. Carlos Gómez o Nombre y Apellido"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={homeForm.email}
                                                onChange={(e) =>
                                                    setHomeForm({
                                                        ...homeForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                placeholder="correo@ejemplo.com"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={homeForm.phone}
                                                onChange={(e) =>
                                                    setHomeForm({
                                                        ...homeForm,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                placeholder="+58 (414) 000-0000"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {contactTab === 'reportar' && (
                                        <div>
                                            <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                                Producto Reportado *
                                            </label>
                                            <select
                                                required
                                                value={homeForm.product_name}
                                                onChange={(e) =>
                                                    setHomeForm({
                                                        ...homeForm,
                                                        product_name:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="">
                                                    Seleccione el producto...
                                                </option>
                                                {products.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.name}
                                                    >
                                                        {p.name} (
                                                        {p.presentation})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                            {contactTab === 'reportar'
                                                ? 'Detalles del Lote, Síntomas o Evento Adverso'
                                                : contactTab === 'contacto'
                                                  ? 'Propuesta de Distribución o Solicitud Institucional'
                                                  : 'Detalle de tu Consulta'}
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={homeForm.message}
                                            onChange={(e) =>
                                                setHomeForm({
                                                    ...homeForm,
                                                    message: e.target.value,
                                                })
                                            }
                                            placeholder="Escribe tu mensaje aquí..."
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isHomeSubmitting}
                                        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                            contactTab === 'reportar'
                                                ? 'bg-red-600 shadow-md shadow-red-600/20 hover:bg-red-500'
                                                : 'bg-[#002072] shadow-md shadow-blue-900/20 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500'
                                        }`}
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        <span>
                                            {isHomeSubmitting
                                                ? 'Enviando...'
                                                : contactTab === 'reportar'
                                                  ? 'Enviar Reporte a Farmacovigilancia'
                                                  : 'Enviar Mensaje'}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modals */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
            <LiraAssistantModal
                isOpen={isLiraOpen}
                onClose={() => setIsLiraOpen(false)}
            />
        </BoozLayout>
    );
}
