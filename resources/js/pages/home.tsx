import { Head, Link } from '@inertiajs/react';
import {
    Sparkles,
    Search,
    ShieldCheck,
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Microscope,
    ShoppingBag,
    Send,
    LayoutGrid,
    SlidersHorizontal,
} from 'lucide-react';
import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useCallback,
} from 'react';
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
    const [isFadingCategory, setIsFadingCategory] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    // Transición suave animada al alternar líneas terapéuticas o necesidades
    const handleSelectCategory = (lineId: number | null) => {
        if (lineId === selectedLineId && !isFadingCategory) return;
        setIsFadingCategory(true);
        setTimeout(() => {
            setSelectedLineId(lineId);
            setIsFadingCategory(false);
        }, 220);
    };

    const handleSelectNeed = (needName: string) => {
        setIsFadingCategory(true);
        setTimeout(() => {
            setSelectedNeed((prev) => (prev === needName ? null : needName));
            setIsFadingCategory(false);
        }, 220);
        const el = document.getElementById('productos');
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClearNeed = () => {
        setIsFadingCategory(true);
        setTimeout(() => {
            setSelectedNeed(null);
            setIsFadingCategory(false);
        }, 220);
    };
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

    // Detección responsive para configuración del carrusel con peek y 4K Ultra-Wide
    const [viewportMode, setViewportMode] = useState<
        'mobile' | 'tablet' | 'desktop' | 'ultrawide'
    >('desktop');
    // Vista de catálogo para modo teléfono: 'grid' (Tienda Virtual App 100% ancho) o 'carousel' (Carrusel 3D)
    const [mobileCatalogView, setMobileCatalogView] = useState<
        'grid' | 'carousel'
    >('grid');

    useEffect(() => {
        const updateViewport = () => {
            const w = window.innerWidth;
            if (w >= 1920) {
                setViewportMode('ultrawide');
            } else if (w >= 1024) {
                setViewportMode('desktop');
            } else if (w >= 640) {
                setViewportMode('tablet');
            } else {
                setViewportMode('mobile');
            }
        };
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    // Base de productos para carrusel con repetición mínima para bucle infinito perfecto
    const baseCarouselProducts = useMemo(() => {
        if (filteredProducts.length === 0) return [];
        let list = [...filteredProducts];
        while (list.length < 8) {
            list = [...list, ...filteredProducts];
        }
        return list;
    }, [filteredProducts]);

    // Buffer de 3 copias para bucle continuo infinito: [Copia 1, Copia 2 (activa), Copia 3]
    const clonedCarouselProducts = useMemo(() => {
        if (baseCarouselProducts.length === 0) return [];
        return [
            ...baseCarouselProducts,
            ...baseCarouselProducts,
            ...baseCarouselProducts,
        ];
    }, [baseCarouselProducts]);

    // Estado del carrusel infinito
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isCarouselSliding, setIsCarouselSliding] = useState(false);

    // Inicializar o reiniciar índice al inicio de la segunda copia
    useEffect(() => {
        if (baseCarouselProducts.length > 0) {
            setIsCarouselSliding(false);
            setCarouselIndex(baseCarouselProducts.length);
        } else {
            setCarouselIndex(0);
        }
    }, [baseCarouselProducts]);

    // Configuración del carrusel según viewport:
    // Ultrawide/4K: 4 tarjetas visibles completas + peek suave
    // Desktop: 3 tarjetas visibles completas + peek lateral izquierdo y derecho
    // Tablet: 2 tarjetas visibles completas + peek lateral izquierdo y derecho
    // Mobile: 1 tarjeta central enfocada + peek lateral izquierdo y derecho
    const carouselConfig = useMemo(() => {
        if (viewportMode === 'ultrawide') {
            return {
                cardWidthPercent: 21.5,
                gapPercent: 1.5,
                offsetPercent: 4,
                stepPercent: 23, // 21.5 + 1.5
            };
        }
        if (viewportMode === 'desktop') {
            return {
                cardWidthPercent: 27,
                gapPercent: 2,
                offsetPercent: 7.5,
                stepPercent: 29, // 27 + 2
            };
        }
        if (viewportMode === 'tablet') {
            return {
                cardWidthPercent: 42,
                gapPercent: 3,
                offsetPercent: 6.5,
                stepPercent: 45, // 42 + 3
            };
        }
        return {
            cardWidthPercent: 74,
            gapPercent: 4,
            offsetPercent: 13,
            stepPercent: 78, // 74 + 4
        };
    }, [viewportMode]);

    // Desplazamiento acumulado en translateX
    const trackTranslateX = useMemo(() => {
        return (
            carouselConfig.offsetPercent -
            carouselIndex * carouselConfig.stepPercent
        );
    }, [carouselIndex, carouselConfig]);

    // Navegación: Siguiente
    const handleNextProduct = useCallback(() => {
        if (baseCarouselProducts.length <= 1) return;
        setIsCarouselSliding(true);
        setCarouselIndex((prev) => prev + 1);
    }, [baseCarouselProducts.length]);

    // Navegación: Anterior
    const handlePrevProduct = useCallback(() => {
        if (baseCarouselProducts.length <= 1) return;
        setIsCarouselSliding(true);
        setCarouselIndex((prev) => prev - 1);
    }, [baseCarouselProducts.length]);

    // Fin de transición: reposicionamiento transparente sin animación para bucle infinito
    const handleCarouselTransitionEnd = () => {
        setIsCarouselSliding(false);
        const M = baseCarouselProducts.length;
        if (M === 0) return;
        if (carouselIndex >= 2 * M) {
            setCarouselIndex((prev) => prev - M);
        } else if (carouselIndex < M) {
            setCarouselIndex((prev) => prev + M);
        }
    };

    // Salto directo a un producto desde los indicadores / dots
    const handleJumpToProduct = (realIdx: number) => {
        if (filteredProducts.length === 0 || baseCarouselProducts.length === 0)
            return;
        const M = baseCarouselProducts.length;
        const target = M + (realIdx % M);
        setIsCarouselSliding(true);
        setCarouselIndex(target);
    };

    // Soporte de gestos táctiles (swipe) para celulares y tablets
    const touchStartX = useRef<number | null>(null);
    const touchDeltaX = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current !== null) {
            touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
        }
    };

    const handleTouchEnd = () => {
        if (Math.abs(touchDeltaX.current) > 35) {
            if (touchDeltaX.current < 0) {
                handleNextProduct();
            } else {
                handlePrevProduct();
            }
        }
        touchStartX.current = null;
        touchDeltaX.current = 0;
    };

    // Índice real activo para dots e indicadores de progreso
    const activeRealProductIndex = useMemo(() => {
        if (filteredProducts.length === 0 || baseCarouselProducts.length === 0)
            return 0;
        const M = baseCarouselProducts.length;
        const normalized = ((carouselIndex % M) + M) % M;
        return normalized % filteredProducts.length;
    }, [carouselIndex, baseCarouselProducts.length, filteredProducts.length]);

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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Hero Text */}
                        <div className="space-y-4 text-center sm:space-y-6 lg:col-span-7 lg:text-left">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1 text-[11px] font-black tracking-wider text-[#002072] uppercase sm:text-xs dark:border-blue-800 dark:bg-blue-900/40 dark:text-cyan-300">
                                <Sparkles className="h-3 w-3 text-blue-600 dark:text-cyan-400" />{' '}
                                Vademécum Clínico Oficial
                            </span>

                            <h1 className="text-3xl leading-[1.15] font-black tracking-tight text-blue-950 sm:text-5xl lg:text-6xl dark:text-white">
                                La ciencia que <br />
                                <span className="text-[#002072] dark:text-cyan-400">
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
                                className="group relative flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-tr from-blue-900/10 via-white to-cyan-100/40 p-2 shadow-2xl shadow-blue-900/15 transition-colors sm:max-w-md sm:p-3 dark:border-cyan-500/30 dark:from-blue-950/40 dark:via-[#0D172E] dark:to-cyan-950/30"
                                style={{
                                    transform: `perspective(1000px) rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg) translateY(${tiltTranslateY}px) scale(${tiltScale})`,
                                    transition:
                                        'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <img
                                    src="/assets/img/hero_products.png"
                                    alt="Línea Oficial de Medicamentos y Tratamientos Tópicos Booz Laboratorio"
                                    className="h-full w-full rounded-2xl object-cover drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg';
                                    }}
                                />
                                <div className="absolute right-3 bottom-3 flex items-center gap-2.5 rounded-2xl border border-slate-100/90 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md sm:right-4 sm:bottom-4 sm:gap-3 sm:px-4 sm:py-2.5 dark:border-slate-800 dark:bg-[#0D172E]/95">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-500/20 sm:h-9 sm:w-9 sm:text-sm">
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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
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
                                        handleSelectCategory(
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
                                              ? /* CERTIFICADO OFICIAL: PANTONE 506 C Borgoña/Vinotinto Booz */
                                                'bg-gradient-to-br from-[#581827] via-[#842D44] to-[#3B0E19] hover:from-[#6E1E31] hover:to-[#4A1220]'
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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
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
                                            onClick={() =>
                                                handleSelectNeed(need.name)
                                            }
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all sm:p-3 ${
                                                selectedNeed === need.name
                                                    ? 'border-[#002072] bg-[#002072] text-white shadow-md'
                                                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white'
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
                                    onClick={handleClearNeed}
                                    className="mt-4 cursor-pointer text-xs font-bold text-blue-600 underline dark:text-cyan-400"
                                >
                                    Limpiar filtro ✕
                                </button>
                            )}
                        </div>

                        {/* Columna 2: Hola, soy Lira - Tu asistente virtual (Con Lira Oficial 3D Saludando Animado) */}
                        <div className="group relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-[#002072] via-indigo-950 to-slate-950 p-6 text-white shadow-xl sm:flex-row sm:gap-6 sm:rounded-3xl sm:p-8 lg:col-span-5">
                            {/* Podio / Halo luminoso blanco perla de alto contraste */}
                            <div className="relative flex h-44 w-44 flex-shrink-0 items-center justify-center sm:h-52 sm:w-52">
                                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-white/95 via-cyan-100/90 to-white/90 opacity-85 blur-xl transition-opacity group-hover:opacity-100 sm:inset-3" />
                                <div className="pointer-events-none absolute inset-6 rounded-full bg-white/40 blur-md sm:inset-4" />
                                <img
                                    src="/assets/img/lira_greeting_animated.gif"
                                    alt="Lira Asistente Virtual Saludando"
                                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,32,114,0.5)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/lira_head_avatar.png';
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
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent('booz:open-lira'),
                                        )
                                    }
                                    className="group inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-4 py-2 text-xs font-black text-blue-950 shadow-lg transition-all hover:bg-blue-50 sm:px-5 sm:py-2.5"
                                >
                                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400 bg-blue-50">
                                        <img
                                            src="/assets/img/lira_avatar_animated.gif"
                                            alt="Lira"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
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

                    {/* Selector de Vista Táctil para Teléfonos: Tienda Virtual App (100% Ancho) vs Carrusel 3D */}
                    <div className="mb-4 flex items-center justify-between gap-1 rounded-xl border border-slate-200/60 bg-slate-100 p-1 sm:hidden dark:border-slate-700 dark:bg-slate-800/80">
                        <button
                            type="button"
                            onClick={() => setMobileCatalogView('grid')}
                            className={`flex min-h-[38px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                                mobileCatalogView === 'grid'
                                    ? 'bg-[#002072] text-white shadow-sm dark:bg-blue-600'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span>Tienda Virtual (App)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileCatalogView('carousel')}
                            className={`flex min-h-[38px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                                mobileCatalogView === 'carousel'
                                    ? 'bg-[#002072] text-white shadow-sm dark:bg-blue-600'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            <span>Carrusel 3D</span>
                        </button>
                    </div>

                    {/* Botones de Selección por Sección / Línea Terapéutica con Scroll Horizontal Móvil */}
                    <div className="no-scrollbar -mx-4 mb-6 flex items-center gap-2 overflow-x-auto border-b border-slate-100 px-4 pt-1 pb-3 sm:mx-0 sm:px-0 dark:border-slate-800">
                        {/* Botón: Todos los Productos */}
                        <button
                            onClick={() => handleSelectCategory(null)}
                            className={`flex min-h-[38px] flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
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
                                        handleSelectCategory(
                                            isSelected ? null : line.id,
                                        )
                                    }
                                    className={`flex min-h-[38px] flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
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
                                onClick={() => handleSelectCategory(null)}
                                className="flex-shrink-0 cursor-pointer text-[11px] font-bold text-blue-600 hover:underline dark:text-cyan-400"
                            >
                                Ver todas las líneas ✕
                            </button>
                        </div>
                    )}

                    {/* Contenedor con Transición Suave entre Categorías */}
                    <div
                        className={`transform transition-all duration-300 ease-out ${
                            isFadingCategory
                                ? 'translate-y-2 scale-[0.98] opacity-0 blur-[0.5px]'
                                : 'blur-0 translate-y-0 scale-100 opacity-100'
                        }`}
                    >
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
                                <span className="mb-3 text-4xl">🔍</span>
                                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                                    No se encontraron medicamentos
                                </h3>
                                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                                    No hay productos que coincidan con la
                                    búsqueda o línea seleccionada.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        handleSelectCategory(null);
                                    }}
                                    className="mt-4 cursor-pointer rounded-xl bg-[#002072] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    Restablecer filtros
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* VISTA TIENDA VIRTUAL MÓVIL (APP E-COMMERCE 100% ANCHO DE PANTALLA EN TELÉFONOS) */}
                                {mobileCatalogView === 'grid' && (
                                    <div className="my-3 block grid grid-cols-2 gap-2.5 sm:hidden">
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={`grid-${product.id}`}
                                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs transition-all dark:border-slate-800 dark:bg-[#0D172E]"
                                            >
                                                <Link
                                                    href={`/producto/${product.slug}`}
                                                    className="block"
                                                >
                                                    {/* Imagen Cuadrada con Badges */}
                                                    <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60">
                                                        <img
                                                            src={
                                                                product.image_path
                                                            }
                                                            alt={product.name}
                                                            className="h-full w-full object-contain"
                                                            onError={(e) => {
                                                                (
                                                                    e.target as HTMLImageElement
                                                                ).src =
                                                                    '/assets/img/product_1.png';
                                                            }}
                                                        />
                                                        <span className="absolute top-1.5 left-1.5 rounded border border-slate-200 bg-white/90 px-1 py-0.5 text-[8px] font-bold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                                                            {product
                                                                .product_line
                                                                ?.name ||
                                                                'Booz'}
                                                        </span>
                                                        {product.is_prescription_required ? (
                                                            <span className="absolute top-1.5 right-1.5 rounded bg-amber-500 px-1 py-0.5 text-[7px] font-bold text-white shadow-xs">
                                                                Récipe
                                                            </span>
                                                        ) : (
                                                            <span className="absolute top-1.5 right-1.5 rounded bg-emerald-500 px-1 py-0.5 text-[7px] font-bold text-white shadow-xs">
                                                                Libre
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Información del Fármaco */}
                                                    <h4 className="line-clamp-1 text-xs font-bold text-slate-900 dark:text-white">
                                                        {product.name}
                                                    </h4>
                                                    <p className="line-clamp-1 text-[10px] font-semibold text-[#002072] dark:text-cyan-400">
                                                        {
                                                            product.active_ingredients
                                                        }
                                                    </p>
                                                    <p className="line-clamp-1 text-[10px] text-slate-400 dark:text-slate-500">
                                                        {product.presentation}
                                                    </p>
                                                </Link>

                                                {/* Botón de Añadir a Pedido Fijo al Pie de la Tarjeta */}
                                                <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-slate-100 pt-2 dark:border-slate-800">
                                                    <span className="font-mono text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                                        $
                                                        {Number(
                                                            product.price || 0,
                                                        ).toFixed(2)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleAddToCart(
                                                                product,
                                                            );
                                                        }}
                                                        className="flex min-h-[34px] items-center gap-1 rounded-lg bg-[#002072] px-2 py-1.5 text-[10px] font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-95 dark:bg-blue-600"
                                                        title={`Añadir ${product.name} a la bolsa`}
                                                        aria-label={`Añadir ${product.name} a la bolsa`}
                                                    >
                                                        <ShoppingBag className="h-3 w-3 text-cyan-300" />
                                                        <span>+ Pedido</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Carrusel Infinito con Efecto Peek (Visible en Desktop/Tablet y en Móvil si se elige Carrusel) */}
                                <div
                                    className={
                                        mobileCatalogView === 'grid'
                                            ? 'hidden sm:block'
                                            : 'block'
                                    }
                                >
                                    <div
                                        className="relative -mx-4 w-full overflow-hidden px-4 py-4 sm:mx-0 sm:px-0"
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                        role="region"
                                        aria-roledescription="carousel"
                                        aria-label="Carrusel de catálogo farmacéutico"
                                    >
                                        {/* Flecha Izquierda de Navegación */}
                                        <button
                                            type="button"
                                            onClick={handlePrevProduct}
                                            className="absolute top-1/2 left-1 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-[#002072] shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 sm:h-12 sm:w-12 dark:border-slate-700 dark:bg-slate-900/90 dark:text-cyan-400 dark:hover:bg-slate-800"
                                            title="Medicamento anterior"
                                            aria-label="Medicamento anterior"
                                        >
                                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>

                                        {/* Flecha Derecha de Navegación */}
                                        <button
                                            type="button"
                                            onClick={handleNextProduct}
                                            className="absolute top-1/2 right-1 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-[#002072] shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 sm:h-12 sm:w-12 dark:border-slate-700 dark:bg-slate-900/90 dark:text-cyan-400 dark:hover:bg-slate-800"
                                            title="Medicamento siguiente"
                                            aria-label="Medicamento siguiente"
                                        >
                                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>

                                        {/* Pista Dinámica del Carrusel Infinito */}
                                        <div
                                            className="flex will-change-transform"
                                            style={{
                                                gap: `${carouselConfig.gapPercent}%`,
                                                transform: `translateX(${trackTranslateX}%)`,
                                                transition: isCarouselSliding
                                                    ? 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                                                    : 'none',
                                            }}
                                            onTransitionEnd={
                                                handleCarouselTransitionEnd
                                            }
                                        >
                                            {clonedCarouselProducts.map(
                                                (product, idx) => (
                                                    <div
                                                        key={`${product.id}-${idx}`}
                                                        style={{
                                                            width: `${carouselConfig.cardWidthPercent}%`,
                                                            flexShrink: 0,
                                                        }}
                                                        className="py-2"
                                                    >
                                                        {/* Tarjeta 100% Clickeable hacia la Ficha Técnica */}
                                                        <Link
                                                            href={`/producto/${product.slug}`}
                                                            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl sm:rounded-3xl sm:p-5 dark:border-slate-800 dark:bg-[#0D172E] dark:hover:border-cyan-500/50 dark:hover:shadow-cyan-950/30"
                                                        >
                                                            {/* Fotografía del Fármaco y Badges */}
                                                            <div>
                                                                <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2.5 transition-colors group-hover:bg-blue-50/50 sm:mb-4 sm:rounded-2xl sm:p-4 dark:bg-slate-800/60 dark:group-hover:bg-slate-800">
                                                                    <img
                                                                        src={
                                                                            product.image_path
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                                        onError={(
                                                                            e,
                                                                        ) => {
                                                                            (
                                                                                e.target as HTMLImageElement
                                                                            ).src =
                                                                                '/assets/img/product_1.png';
                                                                        }}
                                                                    />
                                                                    <span className="absolute top-2 left-2 rounded border border-slate-200 bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-slate-700 shadow-sm sm:text-[10px] dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                                                                        {product
                                                                            .product_line
                                                                            ?.name ||
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

                                                                {/* Nombre y Fórmula Clínica */}
                                                                <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-[#002072] sm:text-base dark:text-white dark:group-hover:text-cyan-400">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h4>

                                                                <p className="mb-1 line-clamp-1 text-[11px] font-semibold text-[#002072] dark:text-cyan-400">
                                                                    {
                                                                        product.active_ingredients
                                                                    }
                                                                </p>

                                                                <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                                    {
                                                                        product.description
                                                                    }
                                                                </p>
                                                            </div>

                                                            {/* Footer de Tarjeta: Presentación, Acceso a Ficha y Botón + Pedido Reubicado */}
                                                            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <div className="flex min-w-0 flex-col">
                                                                        <span className="truncate text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                                                            {
                                                                                product.presentation
                                                                            }
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#002072] transition-colors group-hover:text-blue-600 dark:text-cyan-400">
                                                                            <span>
                                                                                Ficha
                                                                                Técnica
                                                                            </span>
                                                                            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                                                                        </span>
                                                                    </div>

                                                                    {/* Botón + Pedido Reubicado con stopPropagation para no abrir ficha */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleAddToCart(
                                                                                product,
                                                                            );
                                                                        }}
                                                                        className="flex min-h-[38px] flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-[#002072] px-3 py-2 text-xs font-bold text-white shadow-md shadow-blue-950/20 transition-all hover:scale-105 hover:bg-blue-800 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500"
                                                                        title={`Añadir ${product.name} a la bolsa de pedidos`}
                                                                        aria-label={`Añadir ${product.name} a la bolsa`}
                                                                    >
                                                                        <ShoppingBag className="h-3.5 w-3.5 text-cyan-300 dark:text-white" />
                                                                        <span>
                                                                            +
                                                                            Pedido
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Indicadores / Dots, Contador de Fármacos y Guía Táctil */}
                                    <div className="mt-6 flex flex-col items-center gap-2 sm:mt-8">
                                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                                            {filteredProducts.map((p, idx) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleJumpToProduct(idx)
                                                    }
                                                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                                                        idx ===
                                                        activeRealProductIndex
                                                            ? 'w-7 bg-[#002072] dark:bg-cyan-400'
                                                            : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
                                                    }`}
                                                    title={`Ver ${p.name}`}
                                                    aria-label={`Ir al producto ${idx + 1} de ${filteredProducts.length}: ${p.name}`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                                            <span>
                                                Producto{' '}
                                                <strong className="text-slate-700 dark:text-slate-300">
                                                    {activeRealProductIndex + 1}
                                                </strong>{' '}
                                                de{' '}
                                                <strong className="text-slate-700 dark:text-slate-300">
                                                    {filteredProducts.length}
                                                </strong>
                                            </span>
                                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                                •
                                            </span>
                                            <span className="text-[11px] sm:text-xs">
                                                Desliza o usa las flechas para
                                                explorar el vademécum
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
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
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
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
        </BoozLayout>
    );
}
