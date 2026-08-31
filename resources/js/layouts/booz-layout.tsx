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
    X
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
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46 6.27 6.27 0 0 0 1.88-4.46V8.71a8.31 8.31 0 0 0 4.85 1.57v-3.59h-1z"/>
        </svg>
    );
}

export default function BoozLayout({ children }: { children: React.ReactNode }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { createWhatsAppUrl, contactPhone, companyPhone, defaultMessage } = useWhatsApp();
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
        } catch {}
    }, [cartItems]);

    // Global listener for "booz:add-to-cart"
    useEffect(() => {
        const handleAddToCart = (e: CustomEvent<Product>) => {
            const product = e.detail;
            setCartItems((prev) => {
                const existing = prev.find((item) => item.product.id === product.id);
                if (existing) {
                    return prev.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, { product, quantity: 1 }];
            });
            setIsCartOpen(true);
        };

        window.addEventListener('booz:add-to-cart' as any, handleAddToCart as any);
        return () => window.removeEventListener('booz:add-to-cart' as any, handleAddToCart as any);
    }, []);

    // Global listener for "booz:open-lira"
    useEffect(() => {
        const handleOpenLira = () => setIsAIOpen(true);
        window.addEventListener('booz:open-lira' as any, handleOpenLira);
        return () => window.removeEventListener('booz:open-lira' as any, handleOpenLira);
    }, []);

    const handleUpdateQuantity = (productId: number, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.product.id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const handleRemoveItem = (productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300 pb-16 md:pb-0">
            <Head title="Booz Laboratorio | Innovación Clínica" />
            
            {/* Navigation Bar (Compact & Polished) */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#0A1124]/95 backdrop-blur-md transition-colors duration-300">
                <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] px-4 sm:px-6 lg:px-8 2xl:px-12">
                    <div className="flex h-16 sm:h-20 items-center justify-between">
                        {/* Logo Oficial de Booz Laboratorio (Home Link - Limpio y Sólido) */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-900/10 dark:bg-white/10 p-1 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 group-hover:scale-105 transition-transform shadow-sm">
                                <img
                                    src="/assets/img/booz_symbol_icon.png"
                                    alt="Booz Laboratorio"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="text-lg sm:text-xl font-black tracking-tight text-[#002072] dark:text-white uppercase leading-none">
                                    BOOZ <span className="text-blue-600 dark:text-cyan-400 font-light">LABORATORIO</span>
                                </span>
                            </div>
                        </Link>
                        
                        {/* Desktop Navigation Links (Limpio: Líneas, Catálogo, Conocimiento, Farmacovigilancia) */}
                        <div className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <a href="/#lineas" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Líneas</a>
                            <a href="/#productos" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Catálogo</a>
                            <a href="/#conocimiento" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Conocimiento</a>
                            <Link href="/farmacovigilancia" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Farmacovigilancia</Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            {/* Theme Toggle (Light / Dark) */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600"
                                title={resolvedAppearance === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                                aria-label="Cambiar tema de color"
                            >
                                {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            {/* Search Button Minimalista (Solo Lupa Interactiva) */}
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#002072] dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer min-h-[42px] min-w-[42px]"
                                title="Buscar en vademécum (Ctrl+K)"
                                aria-label="Buscar medicamento en el vademécum"
                            >
                                <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                            </button>

                            {/* Tienda & Bolsa de Pedidos */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#002072] dark:text-cyan-300 hover:bg-blue-100 dark:hover:bg-slate-700 text-xs font-bold border border-blue-200/80 dark:border-slate-700 transition-all cursor-pointer min-h-[42px]"
                                title="Ver Bolsa de Pedidos / Tienda Booz"
                                aria-label="Ver bolsa de pedidos"
                            >
                                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span className="hidden sm:inline">Tienda</span>
                                {totalCartUnits > 0 && (
                                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white animate-pulse">
                                        {totalCartUnits}
                                    </span>
                                )}
                            </button>

                            {/* Acceso a Consola Administrativa (Modernizado con Indicador Activo y ShieldCheck) */}
                            <Link
                                href="/dashboard"
                                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 hover:bg-[#002072] dark:hover:bg-blue-600 text-xs font-bold border border-slate-800 dark:border-slate-700 shadow-sm transition-all hover:shadow-md cursor-pointer min-h-[42px] group"
                                title="Acceso a la Consola Administrativa y Auditoría Sanitaria"
                                aria-label="Ir a la consola de administración"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                                <span>Consola</span>
                            </Link>

                            {/* Mobile Hamburger Menu Toggle Button (Solo visible en pantallas < lg) */}
                            <button
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                className="flex lg:hidden items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#002072] dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer min-h-[42px] min-w-[42px]"
                                title="Menú de Navegación"
                                aria-label="Abrir menú de navegación"
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5 text-red-500" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown Panel (Para pantallas < lg) */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#0A1124]/98 backdrop-blur-xl shadow-2xl px-4 py-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                        <a
                            href="/#lineas"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Líneas Terapéuticas</span>
                            </div>
                        </a>

                        <a
                            href="/#productos"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Catálogo de Productos</span>
                            </div>
                        </a>

                        <a
                            href="/#conocimiento"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
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
                            className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-amber-950 dark:text-amber-300 font-bold text-sm transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span>Canal de Farmacovigilancia</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                                Oficial INH
                            </span>
                        </Link>

                        <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
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
            <main className="pb-24 md:pb-0">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar (Compact App Experience con pb-safe) */}
            {/* Mobile Bottom Navigation Bar (Compact App Experience con pb-safe) */}
            <nav 
                aria-label="Navegación móvil inferior"
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A1124]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 pt-2 pb-safe flex items-center justify-around shadow-2xl"
            >
                <a 
                    href="/#lineas" 
                    className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Líneas</span>
                </a>

                {/* Enlace Directo a Farmacovigilancia en Móvil */}
                <Link 
                    href="/farmacovigilancia" 
                    className="flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                    title="Canal Oficial de Farmacovigilancia"
                    aria-label="Canal de Farmacovigilancia"
                >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Vigilancia</span>
                </Link>
                
                {/* Central AI Trigger Floating */}
                <button 
                    onClick={() => setIsAIOpen(true)}
                    className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] gap-0.5 text-[10px] font-bold text-blue-600 dark:text-cyan-400 cursor-pointer -mt-4 transition-transform active:scale-95"
                    aria-label="Asistente virtual Lira IA"
                >
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-b from-white via-slate-50 to-blue-50 text-slate-900 p-0.5 shadow-xl border-2 border-cyan-400 dark:border-cyan-300 overflow-hidden flex items-center justify-center ring-2 ring-white/90 dark:ring-slate-900/90">
                            <img src="/assets/img/lira_avatar_animated.gif" alt="Lira" className="h-full w-full object-cover rounded-full" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20 pointer-events-none">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-br from-cyan-400 to-blue-600 text-[7px] font-black items-center justify-center text-white border border-white dark:border-slate-900 shadow-sm">AI</span>
                        </span>
                    </div>
                    <span>Lira IA</span>
                </button>

                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                    aria-label={`Tienda y pedidos: ${totalCartUnits} unidades`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Tienda</span>
                    {totalCartUnits > 0 && (
                        <span className="absolute top-1 right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
                            {totalCartUnits}
                        </span>
                    )}
                </button>

                <Link 
                    href="/dashboard" 
                    className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <ShieldCheck className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                    <span>Consola</span>
                </Link>
            </nav>

            {/* Desktop & Mobile Floating Action Buttons */}
            <div className="fixed bottom-20 md:bottom-6 right-3.5 sm:right-6 flex flex-col gap-2.5 z-40">
                {/* WhatsApp Dedicated Button (Accesible tanto en móvil como en escritorio) */}
                <a 
                    href={createWhatsAppUrl(defaultMessage, 'contact')}
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => trackInteractionEvent('whatsapp_click', 'whatsapp', 'floating_button')}
                    className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all group cursor-pointer"
                    title="Contacto directo por WhatsApp oficial"
                >
                    <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                </a>

                {/* AI Assistant Floating Avatar (Lira) - En escritorio se muestra flotante */}
                <button 
                    onClick={() => setIsAIOpen(true)}
                    className="hidden md:flex h-14 w-14 items-center justify-center rounded-full shadow-2xl hover:scale-110 transition-all relative group cursor-pointer"
                    title="Consultar con Lira (Asistente Virtual)"
                >
                    {/* Contenedor circular recortado con el avatar animado centrado de Lira */}
                    <div className="h-full w-full rounded-full bg-gradient-to-b from-white via-white to-blue-50 text-slate-900 border-2 border-cyan-400 dark:border-cyan-300 overflow-hidden p-0.5 ring-2 ring-white/90 dark:ring-blue-900/50 flex items-center justify-center">
                        <img
                            src="/assets/img/lira_avatar_animated.gif"
                            alt="Lira"
                            className="h-full w-full object-cover rounded-full"
                        />
                    </div>

                    {/* Insignia / Badge "AI" con pulso y ping flotando por fuera en la esquina superior derecha */}
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 z-20 pointer-events-none">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-br from-cyan-400 to-blue-600 text-[8.5px] font-black items-center justify-center text-white border-2 border-white dark:border-slate-900 shadow-md">
                            AI
                        </span>
                    </span>
                </button>

                {/* Scroll to Top */}
                {showScrollUp && (
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/90 dark:bg-slate-700/90 text-white shadow-lg hover:bg-slate-900 hover:scale-105 transition-all self-end cursor-pointer"
                        title="Volver arriba"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Official Legal & Clinical Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] px-4 sm:px-6 lg:px-8 2xl:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Col 1: Identity & Authorization */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                                    <img
                                        src="/assets/img/booz_symbol_icon.png"
                                        alt="Booz Laboratorio"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <span className="text-lg font-black text-white uppercase tracking-tight">
                                    BOOZ <span className="text-cyan-400 font-light">LAB</span>
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                <strong>BOOZ LABORATORIO VGME, C.A.</strong><br />
                                RIF: <span className="text-white font-mono">J-40906185-0</span><br />
                                Planta de Fabricación: Av. Hospital cruce con Troncal 11, Valle de Guanape, Edo. Anzoátegui, Venezuela.
                            </p>
                            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                                <span>Desarrollo SGCP creado por</span>
                                <a
                                    href="https://neobranding.cl"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors inline-flex items-center gap-1"
                                >
                                    Neobranding Latam
                                </a>
                            </div>
                        </div>

                        {/* Col 2: Regulatory & Pharmacovigilance */}
                        {/* Col 2: Regulatory & Clinical Tools */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                                Canal Regulatorio & Herramientas
                            </h4>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <Link href="/herramientas" className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-cyan-300 font-semibold">
                                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Calculadora Pediátrica (Dosis)</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/farmacovigilancia" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                        <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Farmacovigilancia y Quejas</span>
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => setIsLegalOpen(true)}
                                        className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-left cursor-pointer"
                                    >
                                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Política de Calidad y Buenas Prácticas</span>
                                    </button>
                                </li>
                                <li>
                                    <Link href="/glosario" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                        <Info className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Glosario Médico y Principios Activos</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="text-blue-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-2 pt-1">
                                        <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Consola Administrativa</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Medical Lines */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                                Líneas Terapéuticas
                            </h4>
                            <ul className="space-y-2 text-xs">
                                <li><a href="/#productos" className="hover:text-cyan-400 transition-colors">Cuidado de la Piel</a></li>
                                <li><a href="/#productos" className="hover:text-cyan-400 transition-colors">Tratamiento Tópico</a></li>
                                <li><a href="/#productos" className="hover:text-cyan-400 transition-colors">Salud y Bienestar</a></li>
                                <li><a href="/#productos" className="hover:text-cyan-400 transition-colors">Cuidado Especializado</a></li>
                            </ul>
                        </div>

                        {/* Col 4: Official Contact & Social Networks */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                                Contacto Oficial & Redes
                            </h4>
                            <div className="space-y-2 text-xs">
                                <a 
                                    href="https://instagram.com/booz.laboratorio" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-pink-400 transition-colors"
                                >
                                    <Instagram className="h-4 w-4 text-pink-400" />
                                    <span>@booz.laboratorio</span>
                                </a>
                                <a 
                                    href="https://facebook.com/booz.laboratorio" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                                >
                                    <Facebook className="h-4 w-4 text-blue-400" />
                                    <span>booz.laboratorio</span>
                                </a>
                                <a 
                                    href="https://youtube.com/@booz.laboratorio" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-red-400 transition-colors"
                                >
                                    <Youtube className="h-4 w-4 text-red-500" />
                                    <span>booz.laboratorio</span>
                                </a>
                                <a 
                                    href="https://tiktok.com/@booz.laboratorio" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                                >
                                    <TikTokIcon className="h-4 w-4 text-cyan-400" />
                                    <span>booz.laboratorio</span>
                                </a>
                                
                                <div className="pt-2 border-t border-slate-900 space-y-1.5">
                                    <a 
                                        href={createWhatsAppUrl(defaultMessage, 'contact')}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        <MessageCircle className="h-4 w-4 text-emerald-400" />
                                        <span>+{contactPhone} (WhatsApp)</span>
                                    </a>
                                    <a 
                                        href={`tel:+${companyPhone.replace(/\D/g, '')}`}
                                        className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                                    >
                                        <Phone className="h-4 w-4 text-cyan-400" />
                                        <span>+{companyPhone} (Planta)</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs gap-4 text-slate-400">
                        <p>© {new Date().getFullYear()} BOOZ LABORATORIO VGME, C.A. Todos los derechos reservados.</p>
                        <p className="text-[11px] text-slate-400 max-w-xl text-center md:text-right">
                            Los productos farmacéuticos aquí descritos cumplen con las especificaciones técnicas del Instituto Nacional de Higiene "Rafael Rangel" (INH). Prohibida la venta de medicamentos bajo récipe sin la correspondiente prescripción médica.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Global Modals & Drawers */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <LiraAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
            <StoreCartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
            />

            {/* Modal de Política de Calidad y Regulatorio */}
            <Modal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} title="Política de Calidad y Cumplimiento Sanitario">
                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        <strong>BOOZ LABORATORIO VGME, C.A.</strong> opera bajo los más rigurosos estándares de Buenas Prácticas de Manufactura (BPM) farmacéuticas. Cada lote de producción cuenta con análisis microbiológico, fisicoquímico y de estabilidad certificado.
                    </p>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50">
                        <h4 className="font-bold text-[#002072] dark:text-cyan-400 mb-1">Aviso contra la Automedicación</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            La información técnica provista en esta plataforma está destinada exclusivamente a la orientación sanitaria y educación médica. Bajo ninguna circunstancia sustituye la consulta, diagnóstico o prescripción de un facultativo médico colegiado.
                        </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Para notificaciones urgentes sobre desvíos de calidad o eventos adversos, comuníquese de inmediato a través de nuestro canal formal de Farmacovigilancia.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
