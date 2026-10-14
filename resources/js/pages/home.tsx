import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Sparkles,
    Search,
    ShieldCheck,
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Microscope,
    Send,
    LayoutGrid,
    SlidersHorizontal,
    MessageCircle,
    Building2,
    LayoutDashboard,
} from 'lucide-react';
import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import ScrollReveal from '@/components/scroll-reveal';
import SearchModal from '@/components/search-modal';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import BoozLayout from '@/layouts/booz-layout';
import { appUrl } from '@/lib/utils';
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
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const { createWhatsAppUrl } = useWhatsApp();
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

    // Disparador directo a Lira con el requerimiento clínico seleccionado
    const handleSelectNeed = (needName: string) => {
        setSelectedNeed(needName);
        window.dispatchEvent(
            new CustomEvent('booz:open-lira', {
                detail: {
                    prompt: `Hola, estoy buscando productos de ${needName}. ¿Cuáles me recomiendas de su vademécum?`,
                },
            }),
        );
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

    // Interactive mouse tilt state for Hero phone (calibrado a máx 20°)
    const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

    const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setMouseTilt({ x: px * 10, y: -py * 10 });
    };

    const handleHeroMouseLeave = () => {
        setMouseTilt({ x: 0, y: 0 });
    };

    // Showroom 12 Boxes ref y progreso relativo de scroll
    const showroomRef = useRef<HTMLDivElement>(null);
    const [showroomScrollProgress, setShowroomScrollProgress] = useState(0.5);
    const [showroomMouseTilt, setShowroomMouseTilt] = useState({ x: 0, y: 0 });

    const handleShowroomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setShowroomMouseTilt({ x: px * 10, y: -py * 10 });
    };

    const handleShowroomMouseLeave = () => {
        setShowroomMouseTilt({ x: 0, y: 0 });
    };

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

    // Scroll listener optimizado con requestAnimationFrame para animaciones 3D
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    if (showroomRef.current) {
                        const rect = showroomRef.current.getBoundingClientRect();
                        const windowH = window.innerHeight;
                        const progress = (windowH - rect.top) / (windowH + rect.height);
                        setShowroomScrollProgress(Math.max(-0.2, Math.min(1.2, progress)));
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3D tilt calculation based on scroll + mouse tilt (calibrado a máximo 20 grados)
    const tiltFactor = Math.min(scrollY / 500, 1);
    
    // Hero Phone: Rotación 3D cinemática y viva (hasta 20°)
    const rawHeroX = 6 - tiltFactor * 16 + mouseTilt.y;
    const rawHeroY = -8 + tiltFactor * 16 + mouseTilt.x;
    const tiltRotateX = Math.max(-20, Math.min(20, rawHeroX));
    const tiltRotateY = Math.max(-20, Math.min(20, rawHeroY));
    const tiltRotateZ = Math.max(-8, Math.min(8, 1.5 + tiltFactor * 3.5));
    const tiltTranslateY = tiltFactor * 24;
    const tiltScale = 1 + tiltFactor * 0.03;

    // Showroom 12 Boxes: Reactivo al scroll relativo de la sección y al mouse (hasta 20°)
    const sFactor = (showroomScrollProgress - 0.5) * 2; // de -1 a +1 al cruzar la pantalla
    const rawShowroomX = -sFactor * 14 + showroomMouseTilt.y;
    const rawShowroomY = -sFactor * 12 + showroomMouseTilt.x;
    const showroomRotateX = Math.max(-20, Math.min(20, rawShowroomX));
    const showroomRotateY = Math.max(-20, Math.min(20, rawShowroomY));
    const showroomRotateZ = Math.max(-8, Math.min(8, sFactor * 3));
    const showroomTranslateY = -sFactor * 24;

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
                        {/* Hero Image Showcase (En Móvil va PRIMERO, en Desktop a la derecha) */}
                        <div className="relative flex justify-center order-1 lg:order-2 lg:col-span-5">
                            <div
                                onMouseMove={handleHeroMouseMove}
                                onMouseLeave={handleHeroMouseLeave}
                                className="group relative flex aspect-[9/16] w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-slate-900/20 bg-slate-950 p-2 shadow-[0_30px_70px_-15px_rgba(0,32,114,0.45)] transition-colors sm:p-2.5 dark:border-cyan-500/40 dark:bg-slate-950 dark:shadow-[0_30px_70px_-15px_rgba(6,182,212,0.35)]"
                                style={{
                                    transform: `perspective(900px) rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg) rotateZ(${tiltRotateZ}deg) translateY(${tiltTranslateY}px) scale(${tiltScale})`,
                                    boxShadow: `${tiltRotateY * -1.2}px ${25 + tiltTranslateY * 0.4}px 65px rgba(0,32,114,0.45)`,
                                    transition:
                                        'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.1s ease-out',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Reflejo dinámico de cristal que gira con la perspectiva */}
                                <div
                                    className="pointer-events-none absolute inset-0 z-20 rounded-[2.3rem] opacity-35 transition-opacity duration-300 group-hover:opacity-55"
                                    style={{
                                        background: `linear-gradient(${115 + tiltFactor * 40}deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 42%, rgba(0,0,0,0) 65%)`,
                                    }}
                                />
                                <img
                                    src="/assets/img/hero_nuestra_imagen_evoluciona.jpg"
                                    alt="¡Nuestra Imagen Evoluciona! Booz Laboratorio"
                                    className="h-full w-full rounded-[2rem] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/hero_products.png';
                                    }}
                                />
                                <div className="absolute right-3 bottom-3 flex items-center gap-2.5 rounded-2xl border border-slate-100/90 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md sm:right-4 sm:bottom-4 sm:gap-3 sm:px-4 sm:py-2.5 dark:border-slate-800 dark:bg-[#0D172E]/95">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/30 sm:h-9 sm:w-9 sm:text-sm">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 sm:text-xs dark:text-white">
                                            Nueva Imagen Oficial
                                        </p>
                                        <p className="text-[9px] font-medium text-blue-600 sm:text-[10px] dark:text-cyan-400">
                                            Identidad Renovada
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Text (En Móvil va SEGUNDO, en Desktop a la izquierda) */}
                        <div className="space-y-4 text-center sm:space-y-6 order-2 lg:order-1 lg:col-span-7 lg:text-left">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1 text-[11px] font-black tracking-wider text-[#002072] uppercase sm:text-xs dark:border-blue-800 dark:bg-blue-900/40 dark:text-cyan-300">
                                <Sparkles className="h-3 w-3 text-blue-600 dark:text-cyan-400" />{' '}
                                Vademécum Farmacológico
                            </span>

                            <h1 className="text-3xl leading-[1.15] font-black tracking-tight text-blue-950 sm:text-5xl lg:text-6xl dark:text-white">
                                La ciencia que <br />
                                <span className="text-[#002072] dark:text-cyan-400">
                                    transforma el cuidado
                                </span>
                            </h1>

                            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base lg:mx-0 lg:text-lg dark:text-slate-300">
                                Desarrollamos soluciones farmacéuticas y
                                dermatológicas avanzadas para el
                                bienestar integral, la salud dérmica y la
                                terapéutica clínica especializada.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 lg:justify-start">
                                <a
                                    href={appUrl('/#productos')}
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

                            {/* Badges Oficiales Acordados */}
                            <div className="grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-4 sm:gap-4 sm:pt-6 dark:border-slate-800">
                                <div>
                                    <span className="block text-xl font-black text-[#002072] sm:text-2xl dark:text-cyan-400">
                                        27+
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                                        Formulaciones
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xl font-black text-[#002072] sm:text-2xl dark:text-cyan-400">
                                        3
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
                                        Apego Regulatorio
                                    </span>
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
                    <ScrollReveal direction="up">
                        <div className="mx-auto mb-10 max-w-3xl space-y-2 text-center sm:mb-14">
                            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                Especialización Terapéutica
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl lg:text-4xl dark:text-white">
                                Nuestras 3 Líneas de Productos
                            </h2>
                            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                Formulaciones científicas de alta biodisponibilidad
                                desarrolladas para cubrir integralmente la terapéutica ética,
                                la salud dérmica y el bienestar familiar.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {productLines.map((line, idx) => {
                            const isSelected = selectedLineId === line.id;
                            const count = products.filter(
                                (p) => p.product_line_id === line.id,
                            ).length;

                            return (
                                <ScrollReveal key={line.id} direction="up" delay={idx * 80}>
                                    <div
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
                                                ? /* CERTIFICADO OFICIAL: PANTONE 506 C Borgoña/Vinotinto Booz Ética */
                                                  'bg-gradient-to-br from-[#581827] via-[#842D44] to-[#3B0E19] hover:from-[#6E1E31] hover:to-[#4A1220]'
                                                : line.id === 2
                                                  ? /* Azul Corporativo Booz Dermocosmética */
                                                    'bg-gradient-to-br from-[#002072] via-blue-900 to-indigo-950 hover:from-blue-900 hover:to-indigo-900'
                                                  : /* Esmeralda / Verde Natural & Bienestar */
                                                    'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 hover:from-emerald-900 hover:to-teal-900'
                                        } ${isSelected ? 'scale-[1.02] shadow-2xl ring-4 ring-cyan-400' : 'shadow-lg hover:scale-[1.02]'}`}
                                    >
                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase">
                                                    {count} Productos
                                                </span>
                                                <span className="text-2xl">
                                                    {line.id === 1
                                                        ? '💊'
                                                        : line.id === 2
                                                          ? '🧴'
                                                          : '🌿'}
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
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================
                3. BENTO GRID INTERACTIVO (Consolidado: Hola, soy Lira + ¿Qué necesitas?)
            ======================================================== */}
            <section className="border-y border-slate-200 bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:border-slate-800 dark:bg-[#070C18]">
                <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 2xl:max-w-6xl">
                    <ScrollReveal direction="up">
                        <div className="group relative overflow-hidden rounded-3xl border border-blue-900/40 bg-gradient-to-br from-[#002072] via-indigo-950 to-slate-950 p-6 text-white shadow-2xl sm:p-10">
                            {/* Fila Superior: Lira Asistente Virtual */}
                            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                                {/* Podio / Halo luminoso blanco perla */}
                                <div className="relative flex h-40 w-40 flex-shrink-0 items-center justify-center sm:h-48 sm:w-48">
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

                                <div className="flex-1 space-y-3 text-center sm:text-left">
                                    <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/30 px-3 py-0.5 text-[10px] font-black tracking-wider text-blue-200 uppercase">
                                        IA Médica
                                    </span>
                                    <h3 className="text-2xl leading-tight font-black sm:text-3xl">
                                        Hola, soy Lira <br />
                                        <span className="text-lg font-normal text-cyan-300 sm:text-xl">
                                            Tu asistente virtual
                                        </span>
                                    </h3>
                                    <p className="max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                                        Orientación sobre medicamentos, líneas terapéuticas y formulaciones oficiales de Booz Laboratorio.
                                    </p>
                                    <div className="pt-1">
                                        <button
                                            onClick={() =>
                                                window.dispatchEvent(
                                                    new CustomEvent('booz:open-lira'),
                                                )
                                            }
                                            className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-5 py-2.5 text-xs font-black text-blue-950 shadow-lg transition-all hover:bg-blue-50 active:scale-95 sm:text-sm"
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
                            </div>

                            {/* Fila Inferior: ¿Qué necesitas? con Botones de Filtro Integrados */}
                            <div className="mt-8 border-t border-white/10 pt-6">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-bold tracking-wider text-cyan-300 uppercase">
                                        ¿Qué necesitas? Encuentra tu solución inmediata:
                                    </span>
                                    {selectedNeed && (
                                        <button
                                            onClick={handleClearNeed}
                                            className="cursor-pointer text-xs font-bold text-cyan-400 underline hover:text-cyan-300"
                                        >
                                            Limpiar filtro ({selectedNeed}) ✕
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2.5">
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
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                                                selectedNeed === need.name
                                                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 ring-2 ring-white'
                                                    : 'border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30'
                                            }`}
                                        >
                                            <span className="text-sm">
                                                {need.icon}
                                            </span>
                                            <span>{need.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
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
                    <ScrollReveal direction="up">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
                            <div>
                                <span className="mb-1 block text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                    Portafolio Clínico Oficial
                                </span>
                                <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl dark:text-white">
                                    Vademécum Farmacológico
                                </h2>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Mostrando {filteredProducts.length} formulaciones
                                    registradas ante las autoridades sanitarias nacionales.
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
                    </ScrollReveal>

                    {/* Selector de Vista Táctil para Teléfonos: Cuadrícula vs Carrusel 3D */}
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
                            <span>Cuadrícula</span>
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

                        {/* 3 Botones de Líneas de Producto Directas */}
                        {productLines.map((line) => {
                            const isSelected = selectedLineId === line.id;
                            const count = products.filter(
                                (p) => p.product_line_id === line.id,
                            ).length;
                            const icon =
                                line.id === 1
                                    ? '💊'
                                    : line.id === 2
                                      ? '🧴'
                                      : '🌿';

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
                                            ? line.id === 1
                                                ? 'bg-[#842D44] text-white shadow-md ring-2 ring-rose-300'
                                                : line.id === 2
                                                  ? 'bg-[#002072] text-white shadow-md ring-2 shadow-blue-900/20 ring-cyan-400'
                                                  : 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-300'
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
                                                onClick={() => router.visit(appUrl(`/producto/${product.slug}`))}
                                                role="link"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        router.visit(appUrl(`/producto/${product.slug}`));
                                                    }
                                                }}
                                                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-[#0D172E] dark:hover:border-cyan-500/50"
                                            >
                                                {/* Imagen Cuadrada con Badges */}
                                                <div>
                                                    <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60">
                                                        <img
                                                            src={
                                                                product.image_path
                                                            }
                                                            alt={product.name}
                                                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
                                                    <h4 className="line-clamp-1 text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-400">
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
                                                </div>

                                                {/* Enlace a Ficha y Cotización Institucional */}
                                                <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-slate-100 pt-2 dark:border-slate-800">
                                                    <span className="text-[10px] font-bold text-[#002072] group-hover:underline dark:text-cyan-400">
                                                        Ver Ficha
                                                    </span>
                                                    <a
                                                        href={createWhatsAppUrl(
                                                            `Hola Booz Laboratorio, solicito cotización para el producto: ${product.name} (${product.presentation}).`,
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        className="flex min-h-[30px] items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                                                        title={`Cotizar ${product.name} por WhatsApp`}
                                                        aria-label={`Cotizar ${product.name}`}
                                                    >
                                                        <MessageCircle className="h-3 w-3 text-white" />
                                                        <span>Cotizar</span>
                                                    </a>
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
                                                        <div
                                                            onClick={() => router.visit(appUrl(`/producto/${product.slug}`))}
                                                            role="link"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    e.preventDefault();
                                                                    router.visit(appUrl(`/producto/${product.slug}`));
                                                                }
                                                            }}
                                                            className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl sm:rounded-3xl sm:p-5 dark:border-slate-800 dark:bg-[#0D172E] dark:hover:border-cyan-500/50 dark:hover:shadow-cyan-950/30"
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

                                                                    {/* Botón Cotizar por WhatsApp con stopPropagation para no abrir ficha */}
                                                                    <a
                                                                        href={createWhatsAppUrl(
                                                                            `Hola Booz Laboratorio, solicito cotización para: ${product.name} (${product.presentation}).`,
                                                                        )}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                        }}
                                                                        className="flex min-h-[36px] flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95"
                                                                        title={`Cotizar ${product.name} por WhatsApp`}
                                                                        aria-label={`Cotizar ${product.name}`}
                                                                    >
                                                                        <MessageCircle className="h-3.5 w-3.5 text-white" />
                                                                        <span>
                                                                            Cotizar
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
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
                5. SHOWROOM DERMOCOSMÉTICO OFICIAL (Público en la Landing Page)
            ======================================================== */}
            <section
                ref={showroomRef}
                className="relative overflow-hidden bg-white py-12 transition-colors duration-300 sm:py-20 dark:bg-[#0A1124]"
                id="showroom"
            >
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
                    <ScrollReveal direction="up">
                        <div className="mx-auto mb-10 max-w-3xl space-y-3 text-center sm:mb-14">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-widest text-[#002072] uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-cyan-400">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                                Showroom Clínico Oficial
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl lg:text-4xl dark:text-white">
                                Muestra Clínica de Nuestra Línea Dermocosmética
                            </h2>
                            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                Doce formulaciones magistrales desarrolladas bajo los más rigurosos estándares sanitarios venezolanos e internacionales. Presentaciones oficiales listas para prescripción médica y distribución hospitalaria.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Showroom Interactive Card con 3D Tilt dinámico (máximo 20° + reactivo a scroll) */}
                    <ScrollReveal direction="up" delay={80}>
                        <div className="relative mx-auto max-w-5xl">
                            <div
                                onMouseMove={handleShowroomMouseMove}
                                onMouseLeave={handleShowroomMouseLeave}
                                className="group relative overflow-hidden rounded-3xl border border-blue-900/20 bg-gradient-to-b from-slate-900 via-[#0D172E] to-slate-950 p-3 shadow-2xl transition-all sm:p-6 dark:border-cyan-500/30"
                                style={{
                                    transform: `perspective(1000px) rotateX(${showroomRotateX}deg) rotateY(${showroomRotateY}deg) rotateZ(${showroomRotateZ}deg) translateY(${showroomTranslateY}px)`,
                                    boxShadow: `${showroomRotateY * -1.5}px ${20 + showroomTranslateY * 0.5}px 60px rgba(0,32,114,0.35)`,
                                    transition:
                                        'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.12s ease-out',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Reflejo dinámico de cristal */}
                                <div
                                    className="pointer-events-none absolute inset-0 z-20 rounded-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
                                    style={{
                                        background: `linear-gradient(${120 + tiltFactor * 30}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0) 70%)`,
                                    }}
                                />

                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-950/80">
                                    <img
                                        src="/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg"
                                        alt="Showroom de la Línea Dermocosmética Booz Laboratorio - 12 Fórmulas Oficiales"
                                        className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/assets/img/hero_products.png';
                                        }}
                                    />

                                    {/* Etiqueta moderna al margen inferior derecho (descentrada, estilo Hero) */}
                                    <div className="absolute right-3 bottom-3 flex items-center gap-2.5 rounded-2xl border border-slate-100/90 bg-white/95 px-3 py-2 shadow-2xl backdrop-blur-md sm:right-5 sm:bottom-5 sm:gap-3 sm:px-4 sm:py-2.5 dark:border-slate-800 dark:bg-[#0D172E]/95">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/30 sm:h-9 sm:w-9 sm:text-sm">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-bold text-slate-900 sm:text-xs dark:text-white">
                                                12 Fórmulas Dermocosméticas
                                            </p>
                                            <p className="text-[9px] font-semibold text-blue-600 sm:text-[10px] dark:text-cyan-400">
                                                Línea Magistral • Registro Sanitario
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Características Clínicas del Showroom */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                        <ScrollReveal direction="up" delay={120}>
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-[#0D172E]">
                                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Inocuidad & Pureza Clínica
                                    </h4>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                        Microbiología y estabilidad certificadas en cada lote de producción en Planta Valle de Guanape.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={180}>
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-[#0D172E]">
                                <Microscope className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-cyan-400" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Presentación en Estuche
                                    </h4>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                        Empaque primario y secundario con protección actínica y precinto de inviolabilidad farmacéutica.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={240}>
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-[#0D172E]">
                                <Building2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Distribución Ética & B2B
                                    </h4>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                        Abastecimiento prioritario para droguerías, clínicas, farmacias y profesionales de la salud.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ========================================================
                6. SECCIÓN DE CONOCIMIENTO & AUTORIDAD CLÍNICA (Solo usuarios autenticados)
            ======================================================== */}
            {user ? (
                <ScrollReveal direction="up">
                    <section
                        className="border-y border-slate-200 bg-slate-50 py-12 transition-colors duration-300 sm:py-20 dark:border-slate-800 dark:bg-[#070C18]"
                        id="conocimiento"
                    >
                        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
                            <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
                                <div className="space-y-4 sm:space-y-6">
                                    <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                        Compromiso Institucional & Calidad
                                    </span>
                                    <h2 className="text-2xl font-black tracking-tight text-blue-950 sm:text-3xl lg:text-4xl dark:text-white">
                                        Misión, Visión y Estándares de Manufactura
                                    </h2>
                                    
                                    {/* Misión y Visión Oficiales de Booz Laboratorio */}
                                    <div className="space-y-3 rounded-2xl border border-blue-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                        <div>
                                            <h4 className="text-xs font-black tracking-wide text-[#002072] uppercase dark:text-cyan-400">
                                                Nuestra Misión
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                Investigación, desarrollo y manufactura de medicamentos (Especialidades Farmacéuticas y Productos Naturales) y Cosméticos apegados a estrictos estándares de Calidad.
                                            </p>
                                        </div>
                                        <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                                            <h4 className="text-xs font-black tracking-wide text-[#002072] uppercase dark:text-cyan-400">
                                                Nuestra Visión
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                Ser una empresa líder en la Industria Farmacéutica con alta participación en el mercado, ofreciendo productos de calidad certificada e innovando continuamente en el desarrollo de nuevas fórmulas.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Objetivo Sanitario
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Garantizar la efectividad, seguridad y eficacia bajo estricto apego a las Normas Sanitarias Nacionales.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                            <Microscope className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-cyan-400" />
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Planta Valle de Guanape
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Gerencia General & Dpto. de Calidad garantizando el abastecimiento del mercado.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex flex-col justify-between rounded-2xl border border-blue-900/30 bg-gradient-to-br from-[#002072] via-indigo-950 to-slate-950 p-6 text-white shadow-xl dark:border-slate-800 sm:rounded-3xl sm:p-8">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                                                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                                                <span>Acceso Corporativo & Operativo</span>
                                            </div>
                                            <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                                                Consola Técnica & Aseguramiento de Calidad
                                            </h3>
                                            <p className="text-xs leading-relaxed text-slate-300">
                                                Gestión de vademécum oficial, documentación técnica confidencial de planta y reportes de farmacovigilancia reservada para el personal autorizado de Booz Laboratorio C.A.
                                            </p>
                                        </div>

                                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                            <Link
                                                href={appUrl('/dashboard')}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-md transition-all hover:bg-cyan-400"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                <span>Ingresar al Panel Administrativo</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            ) : null}


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
                            <ScrollReveal direction="up">
                                <span className="block text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                    Resolución de Dudas
                                </span>
                                <h2 className="mb-4 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl dark:text-white">
                                    Preguntas Frecuentes
                                </h2>
                            </ScrollReveal>
                            <div className="space-y-3">
                                {faqs.map((faq, idx) => {
                                    const isOpen = openFaqId === faq.id;
                                    return (
                                        <ScrollReveal key={faq.id} direction="up" delay={idx * 60}>
                                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all sm:rounded-2xl dark:border-slate-800 dark:bg-[#0D172E]">
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
                                        </ScrollReveal>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interactive Contact & Report Form */}
                        <div className="lg:col-span-6">
                            <ScrollReveal direction="up" delay={120}>
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-[#0D172E]">
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
                            </ScrollReveal>
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
