import { Head, Link } from '@inertiajs/react';
import {
    ShieldAlert,
    FileText,
    Info,
    Search,
    Instagram,
    Facebook,
    Youtube,
    Phone,
    MessageCircle,
    ArrowUp,
    Sun,
    Moon,
    LayoutDashboard,
    ShoppingBag,
    Sparkles,
    ShieldCheck,
    Menu,
    X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import LiraAssistantModal from '@/components/lira-assistant-modal';
import Modal from '@/components/modal';
import SearchModal from '@/components/search-modal';
import StoreCartDrawer, { type CartItem } from '@/components/store-cart-drawer';
import { useAppearance } from '@/hooks/use-appearance';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { trackInteractionEvent } from '@/lib/telemetry';
import type { Product } from '@/types';

function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46 6.27 6.27 0 0 0 1.88-4.46V8.71a8.31 8.31 0 0 0 4.85 1.57v-3.59h-1z" />
        </svg>
    );
}

export default function BoozLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { createWhatsAppUrl, contactPhone, companyPhone, defaultMessage } =
        useWhatsApp();
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Cart state persisted in localStorage
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem('booz_cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('booz_cart', JSON.stringify(cartItems));
        } catch {
            // Ignorar errores de escritura en localStorage
        }
    }, [cartItems]);

    // Global listener for "booz:add-to-cart"
    useEffect(() => {
        const handleAddToCart = (e: CustomEvent<Product>) => {
            const product = e.detail;
            setCartItems((prev) => {
                const existing = prev.find(
                    (item) => item.product.id === product.id,
                );
                if (existing) {
                    return prev.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    );
                }
                return [...prev, { product, quantity: 1 }];
            });
            setIsCartOpen(true);
        };

        window.addEventListener(
            'booz:add-to-cart',
            handleAddToCart as EventListener,
        );
        return () =>
            window.removeEventListener(
                'booz:add-to-cart',
                handleAddToCart as EventListener,
            );
    }, []);

    // Global listener for "booz:open-lira"
    useEffect(() => {
        const handleOpenLira = () => setIsAIOpen(true);
        window.addEventListener(
            'booz:open-lira',
            handleOpenLira as EventListener,
        );
        return () =>
            window.removeEventListener(
                'booz:open-lira',
                handleOpenLira as EventListener,
            );
    }, []);

    const handleUpdateQuantity = (productId: number, delta: number) => {
        setCartItems(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.product.id === productId) {
                            const newQty = item.quantity + delta;
                            return newQty > 0
                                ? { ...item, quantity: newQty }
                                : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[],
        );
    };

    const handleRemoveItem = (productId: number) => {
        setCartItems((prev) =>
            prev.filter((item) => item.product.id !== productId),
        );
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollUp(window.scrollY > 300);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const totalCartUnits = cartItems.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-900 transition-colors duration-300 selection:bg-blue-100 md:pb-0 dark:bg-[#070C18] dark:text-slate-100 dark:selection:bg-blue-900">
            <Head title="Booz Laboratorio | Innovación Clínica" />

            {/* Navigation Bar (Compact & Polished) */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/90 dark:bg-[#0A1124]/95">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
                    <div className="flex h-16 items-center justify-between sm:h-20">
                        {/* Logo Oficial de Booz Laboratorio (Home Link - Limpio y Sólido) */}
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-900/10 p-1 shadow-sm transition-transform group-hover:scale-105 sm:h-11 sm:w-11 dark:border-blue-900/40 dark:bg-white/10">
                                <img
                                    src="/assets/img/booz_symbol_icon.png"
                                    alt="Booz Laboratorio"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="text-lg leading-none font-black tracking-tight text-[#002072] uppercase sm:text-xl dark:text-white">
                                    BOOZ{' '}
                                    <span className="font-light text-blue-600 dark:text-cyan-400">
                                        LABORATORIO
                                    </span>
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links (Limpio: Líneas, Catálogo, Conocimiento, Farmacovigilancia) */}
                        <div className="hidden items-center space-x-7 text-sm font-semibold text-slate-600 lg:flex dark:text-slate-300">
                            <a
                                href="/#lineas"
                                className="transition-colors hover:text-[#002072] dark:hover:text-cyan-400"
                            >
                                Líneas
                            </a>
                            <a
                                href="/#productos"
                                className="transition-colors hover:text-[#002072] dark:hover:text-cyan-400"
                            >
                                Catálogo
                            </a>
                            <a
                                href="/#conocimiento"
                                className="transition-colors hover:text-[#002072] dark:hover:text-cyan-400"
                            >
                                Conocimiento
                            </a>
                            <Link
                                href="/farmacovigilancia"
                                className="transition-colors hover:text-[#002072] dark:hover:text-cyan-400"
                            >
                                Farmacovigilancia
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            {/* Theme Toggle (Light / Dark) */}
                            <button
                                onClick={toggleTheme}
                                className="flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700"
                                title={
                                    resolvedAppearance === 'dark'
                                        ? 'Cambiar a Modo Claro'
                                        : 'Cambiar a Modo Oscuro'
                                }
                                aria-label="Cambiar tema de color"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </button>

                            {/* Search Button Minimalista (Solo Lupa Interactiva) */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 transition-all hover:bg-slate-200 hover:text-[#002072] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
                                title="Buscar en vademécum (Ctrl+K)"
                                aria-label="Buscar medicamento en el vademécum"
                            >
                                <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                            </button>

                            {/* Tienda & Bolsa de Pedidos */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200/80 bg-blue-50 px-3 py-2 text-xs font-bold text-[#002072] transition-all hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-slate-700"
                                title="Ver Bolsa de Pedidos / Tienda Booz"
                                aria-label="Ver bolsa de pedidos"
                            >
                                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span className="hidden sm:inline">Tienda</span>
                                {totalCartUnits > 0 && (
                                    <span className="flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-black text-white">
                                        {totalCartUnits}
                                    </span>
                                )}
                            </button>

                            {/* Acceso a Consola Administrativa (Modernizado con Indicador Activo y ShieldCheck) */}
                            <Link
                                href="/dashboard"
                                className="group hidden min-h-[42px] cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#002072] hover:shadow-md sm:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-blue-600"
                                title="Acceso a la Consola Administrativa y Auditoría Sanitaria"
                                aria-label="Ir a la consola de administración"
                            >
                                <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:rotate-12" />
                                <span>Consola</span>
                            </Link>

                            {/* Mobile Hamburger Menu Toggle Button (Solo visible en pantallas < lg) */}
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen((prev) => !prev)
                                }
                                className="flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-700 transition-all hover:bg-slate-200 hover:text-[#002072] lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
                                title="Menú de Navegación"
                                aria-label="Abrir menú de navegación"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5 text-red-500" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown Panel (Para pantallas < lg) */}
                {isMobileMenuOpen && (
                    <div className="animate-in space-y-1.5 border-t border-slate-200 bg-white/98 px-4 py-4 shadow-2xl backdrop-blur-xl duration-200 slide-in-from-top-2 lg:hidden dark:border-slate-800 dark:bg-[#0A1124]/98">
                        <a
                            href="/#lineas"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl p-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Líneas Terapéuticas</span>
                            </div>
                        </a>

                        <a
                            href="/#productos"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl p-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Catálogo de Productos</span>
                            </div>
                        </a>

                        <a
                            href="/#conocimiento"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl p-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Conocimiento Clínico</span>
                            </div>
                        </a>

                        {/* Canal Oficial de Farmacovigilancia */}
                        <Link
                            href="/farmacovigilancia"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/80 p-3 text-sm font-bold text-amber-950 transition-colors dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
                        >
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span>Canal de Farmacovigilancia</span>
                            </div>
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase dark:bg-amber-900/60 dark:text-amber-200">
                                Oficial INH
                            </span>
                        </Link>

                        <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl p-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                        >
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Consola Administrativa</span>
                            </div>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Main Content con padding inferior para no solapar la barra móvil */}
            <main className="pb-24 md:pb-0">{children}</main>

            {/* Mobile Bottom Navigation Bar (Compact App Experience con pb-safe) */}
            {/* Mobile Bottom Navigation Bar (Compact App Experience con pb-safe) */}
            <nav
                aria-label="Navegación móvil inferior"
                className="pb-safe fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-2xl backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-[#0A1124]/95"
            >
                <a
                    href="/#lineas"
                    className="flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Líneas</span>
                </a>

                {/* Enlace Directo a Farmacovigilancia en Móvil */}
                <Link
                    href="/farmacovigilancia"
                    className="flex min-h-[44px] min-w-[52px] flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-amber-700 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                    title="Canal Oficial de Farmacovigilancia"
                    aria-label="Canal de Farmacovigilancia"
                >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Vigilancia</span>
                </Link>

                {/* Central AI Trigger Floating */}
                <button
                    onClick={() => setIsAIOpen(true)}
                    className="relative -mt-4 flex min-h-[48px] min-w-[56px] cursor-pointer flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-blue-600 transition-transform active:scale-95 dark:text-cyan-400"
                    aria-label="Asistente virtual Lira IA"
                >
                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-400 bg-gradient-to-b from-white via-slate-50 to-blue-50 p-0.5 text-slate-900 shadow-xl ring-2 ring-white/90 dark:border-cyan-300 dark:ring-slate-900/90">
                            <img
                                src="/assets/img/lira_avatar_animated.gif"
                                alt="Lira"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <span className="pointer-events-none absolute -top-1 -right-1 z-20 flex h-4 w-4">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80"></span>
                            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-gradient-to-br from-cyan-400 to-blue-600 text-[7px] font-black text-white shadow-sm dark:border-slate-900">
                                AI
                            </span>
                        </span>
                    </div>
                    <span>Lira IA</span>
                </button>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex min-h-[44px] min-w-[50px] cursor-pointer flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                    aria-label={`Tienda y pedidos: ${totalCartUnits} unidades`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Tienda</span>
                    {totalCartUnits > 0 && (
                        <span className="absolute top-1 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-black text-white">
                            {totalCartUnits}
                        </span>
                    )}
                </button>

                <Link
                    href="/dashboard"
                    className="flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                    <ShieldCheck className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                    <span>Consola</span>
                </Link>
            </nav>

            {/* Desktop & Mobile Floating Action Buttons */}
            <div className="fixed right-3.5 bottom-20 z-40 flex flex-col gap-2.5 sm:right-6 md:bottom-6">
                {/* WhatsApp Dedicated Button (Accesible tanto en móvil como en escritorio) */}
                <a
                    href={createWhatsAppUrl(defaultMessage, 'contact')}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                        trackInteractionEvent(
                            'whatsapp_click',
                            'whatsapp',
                            'floating_button',
                        )
                    }
                    className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-emerald-400 active:scale-95 sm:h-13 sm:w-13"
                    title="Contacto directo por WhatsApp oficial"
                >
                    <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                </a>

                {/* AI Assistant Floating Avatar (Lira) - En escritorio se muestra flotante */}
                <button
                    onClick={() => setIsAIOpen(true)}
                    className="group relative hidden h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 md:flex"
                    title="Consultar con Lira (Asistente Virtual)"
                >
                    {/* Contenedor circular recortado con el avatar animado centrado de Lira */}
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-cyan-400 bg-gradient-to-b from-white via-white to-blue-50 p-0.5 text-slate-900 ring-2 ring-white/90 dark:border-cyan-300 dark:ring-blue-900/50">
                        <img
                            src="/assets/img/lira_avatar_animated.gif"
                            alt="Lira"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>

                    {/* Insignia / Badge "AI" con pulso y ping flotando por fuera en la esquina superior derecha */}
                    <span className="pointer-events-none absolute -top-1 -right-1 z-20 flex h-5 w-5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80"></span>
                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-cyan-400 to-blue-600 text-[8.5px] font-black text-white shadow-md dark:border-slate-900">
                            AI
                        </span>
                    </span>
                </button>

                {/* Scroll to Top */}
                {showScrollUp && (
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                        className="flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-slate-800/90 text-white shadow-lg transition-all hover:scale-105 hover:bg-slate-900 dark:bg-slate-700/90"
                        title="Volver arriba"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Official Legal & Clinical Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-16 text-slate-400">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                        {/* Col 1: Identity & Authorization */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1">
                                    <img
                                        src="/assets/img/booz_symbol_icon.png"
                                        alt="Booz Laboratorio"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <span className="text-lg font-black tracking-tight text-white uppercase">
                                    BOOZ{' '}
                                    <span className="font-light text-cyan-400">
                                        LAB
                                    </span>
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                <strong>BOOZ LABORATORIO VGME, C.A.</strong>
                                <br />
                                RIF:{' '}
                                <span className="font-mono text-white">
                                    J-40906185-0
                                </span>
                                <br />
                                Planta de Fabricación: Av. Hospital cruce con
                                Troncal 11, Valle de Guanape, Edo. Anzoátegui,
                                Venezuela.
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] text-slate-400">
                                <span>Desarrollo SGCP creado por</span>
                                <a
                                    href="https://neobranding.cl"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-bold text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
                                >
                                    Neobranding Latam
                                </a>
                            </div>
                        </div>

                        {/* Col 2: Regulatory & Pharmacovigilance */}
                        {/* Col 2: Regulatory & Clinical Tools */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
                                Canal Regulatorio & Herramientas
                            </h4>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <Link
                                        href="/herramientas"
                                        className="flex items-center gap-2 font-semibold text-cyan-300 transition-colors hover:text-cyan-400"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>
                                            Calculadora Pediátrica (Dosis)
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/farmacovigilancia"
                                        className="flex items-center gap-2 transition-colors hover:text-cyan-400"
                                    >
                                        <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Farmacovigilancia y Quejas</span>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsLegalOpen(true)}
                                        className="flex cursor-pointer items-center gap-2 text-left transition-colors hover:text-cyan-400"
                                    >
                                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>
                                            Política de Calidad y Buenas
                                            Prácticas
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        href="/glosario"
                                        className="flex items-center gap-2 transition-colors hover:text-cyan-400"
                                    >
                                        <Info className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>
                                            Glosario Médico y Principios Activos
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 pt-1 font-bold text-blue-400 transition-colors hover:text-cyan-300"
                                    >
                                        <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Consola Administrativa</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Medical Lines */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
                                Líneas Terapéuticas
                            </h4>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a
                                        href="/#productos"
                                        className="transition-colors hover:text-cyan-400"
                                    >
                                        Cuidado de la Piel
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#productos"
                                        className="transition-colors hover:text-cyan-400"
                                    >
                                        Tratamiento Tópico
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#productos"
                                        className="transition-colors hover:text-cyan-400"
                                    >
                                        Salud y Bienestar
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#productos"
                                        className="transition-colors hover:text-cyan-400"
                                    >
                                        Cuidado Especializado
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Official Contact & Social Networks */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
                                Contacto Oficial & Redes
                            </h4>
                            <div className="space-y-2 text-xs">
                                <a
                                    href="https://instagram.com/booz.laboratorio"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 transition-colors hover:text-pink-400"
                                >
                                    <Instagram className="h-4 w-4 text-pink-400" />
                                    <span>@booz.laboratorio</span>
                                </a>
                                <a
                                    href="https://facebook.com/booz.laboratorio"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 transition-colors hover:text-blue-400"
                                >
                                    <Facebook className="h-4 w-4 text-blue-400" />
                                    <span>booz.laboratorio</span>
                                </a>
                                <a
                                    href="https://youtube.com/@booz.laboratorio"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 transition-colors hover:text-red-400"
                                >
                                    <Youtube className="h-4 w-4 text-red-500" />
                                    <span>booz.laboratorio</span>
                                </a>
                                <a
                                    href="https://tiktok.com/@booz.laboratorio"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 transition-colors hover:text-cyan-400"
                                >
                                    <TikTokIcon className="h-4 w-4 text-cyan-400" />
                                    <span>booz.laboratorio</span>
                                </a>

                                <div className="space-y-1.5 border-t border-slate-900 pt-2">
                                    <a
                                        href={createWhatsAppUrl(
                                            defaultMessage,
                                            'contact',
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-emerald-400 transition-colors hover:text-emerald-300"
                                    >
                                        <MessageCircle className="h-4 w-4 text-emerald-400" />
                                        <span>+{contactPhone} (WhatsApp)</span>
                                    </a>
                                    <a
                                        href={`tel:+${companyPhone.replace(/\D/g, '')}`}
                                        className="flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-400"
                                    >
                                        <Phone className="h-4 w-4 text-cyan-400" />
                                        <span>+{companyPhone} (Planta)</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs text-slate-400 md:flex-row">
                        <p>
                            © {new Date().getFullYear()} BOOZ LABORATORIO VGME,
                            C.A. Todos los derechos reservados.
                        </p>
                        <p className="max-w-xl text-center text-[11px] text-slate-400 md:text-right">
                            Los productos farmacéuticos aquí descritos cumplen
                            con las especificaciones técnicas del Instituto
                            Nacional de Higiene "Rafael Rangel" (INH). Prohibida
                            la venta de medicamentos bajo récipe sin la
                            correspondiente prescripción médica.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Global Modals & Drawers */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
            <LiraAssistantModal
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
            />
            <StoreCartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
            />

            {/* Modal de Política de Calidad y Regulatorio */}
            <Modal
                isOpen={isLegalOpen}
                onClose={() => setIsLegalOpen(false)}
                title="Política de Calidad y Cumplimiento Sanitario"
            >
                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        <strong>BOOZ LABORATORIO VGME, C.A.</strong> opera bajo
                        los más rigurosos estándares de Buenas Prácticas de
                        Manufactura (BPM) farmacéuticas. Cada lote de producción
                        cuenta con análisis microbiológico, fisicoquímico y de
                        estabilidad certificado.
                    </p>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/60">
                        <h4 className="mb-1 font-bold text-[#002072] dark:text-cyan-400">
                            Aviso contra la Automedicación
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            La información técnica provista en esta plataforma
                            está destinada exclusivamente a la orientación
                            sanitaria y educación médica. Bajo ninguna
                            circunstancia sustituye la consulta, diagnóstico o
                            prescripción de un facultativo médico colegiado.
                        </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Para notificaciones urgentes sobre desvíos de calidad o
                        eventos adversos, comuníquese de inmediato a través de
                        nuestro canal formal de Farmacovigilancia.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
