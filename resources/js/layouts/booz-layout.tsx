import { Head, Link } from '@inertiajs/react';
import { 
    ShieldAlert, 
    FileText, 
    Info, 
    Search, 
    Instagram, 
    Facebook, 
    Phone, 
    MessageCircle, 
    ArrowUp, 
    Sun, 
    Moon, 
    LayoutDashboard,
    ShoppingBag,
    Sparkles
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import LiraAssistantModal from '@/components/lira-assistant-modal';
import Modal from '@/components/modal';
import SearchModal from '@/components/search-modal';
import StoreCartDrawer, { type CartItem } from '@/components/store-cart-drawer';
import { useAppearance } from '@/hooks/use-appearance';
import type { Product } from '@/types';

export default function BoozLayout({ children }: { children: React.ReactNode }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);

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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 sm:h-20 items-center justify-between">
                        {/* Logo Oficial de Booz Laboratorio (Home Link) */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-900/10 dark:bg-white/10 p-1 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                                <img
                                    src="/assets/img/booz_symbol_icon.png"
                                    alt="Booz Laboratorio"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg sm:text-xl font-black tracking-tight text-[#002072] dark:text-white uppercase leading-none">
                                    BOOZ <span className="text-blue-600 dark:text-cyan-400 font-light">LABORATORIO</span>
                                </span>
                                <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5 sm:mt-1">
                                    Ciencia que transforma el cuidado
                                </span>
                            </div>
                        </Link>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <a href="/#lineas" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Líneas</a>
                            <a href="/#productos" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Catálogo</a>
                            <a href="/#ciencia" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Conocimiento</a>
                            <Link href="/farmacovigilancia" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Farmacovigilancia</Link>
                            <Link href="/herramientas" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Calculadora Pediátrica</Link>
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

                            {/* Search Button */}
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer min-h-[42px]"
                                title="Buscar en vademécum (Ctrl+K)"
                                aria-label="Buscar medicamento en el vademécum"
                            >
                                <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Buscar...</span>
                                <kbd className="text-[10px] bg-white dark:bg-slate-900 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">Ctrl K</kbd>
                            </button>

                            {/* Tienda & Bolsa de Pedidos (Oculto en móvil pequeño para evitar overflow, disponible en bottom nav) */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#002072] dark:text-cyan-300 hover:bg-blue-100 dark:hover:bg-slate-700 text-xs font-bold border border-blue-200/80 dark:border-slate-700 transition-all cursor-pointer min-h-[42px]"
                                title="Ver Bolsa de Pedidos / Tienda Booz"
                                aria-label="Ver bolsa de pedidos"
                            >
                                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Tienda</span>
                                {totalCartUnits > 0 && (
                                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white animate-pulse">
                                        {totalCartUnits}
                                    </span>
                                )}
                            </button>

                            {/* Direct Admin Dashboard Button (Desktop) */}
                            <Link
                                href="/dashboard"
                                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer min-h-[42px]"
                                title="Acceso al Panel de Administración y Auditoría"
                                aria-label="Ir al panel de administración"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5 text-[#002072] dark:text-cyan-400" />
                                <span>Admin</span>
                            </Link>

                            {/* Habla con Lira Button */}
                            <button
                                onClick={() => setIsAIOpen(true)}
                                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#002072] via-blue-800 to-blue-700 dark:from-blue-600 dark:to-cyan-600 text-white text-xs font-bold shadow-md shadow-blue-900/20 hover:shadow-lg transition-all cursor-pointer min-h-[42px]"
                                aria-label="Consultar con Lira Asistente Virtual"
                            >
                                <img
                                    src="/assets/img/lira_head_avatar.png"
                                    alt="Lira"
                                    className="h-5 w-5 rounded-full object-cover ring-1 ring-white/60"
                                />
                                <span className="hidden sm:inline">Habla con Lira</span>
                                <span className="sm:hidden text-xs">Lira IA</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content con padding inferior para no solapar la barra móvil */}
            <main className="pb-24 md:pb-0">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar (Compact App Experience con pb-safe) */}
            <nav 
                aria-label="Navegación móvil inferior"
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A1124]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 pt-2 pb-safe flex items-center justify-around shadow-2xl"
            >
                <a 
                    href="/#lineas" 
                    className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Líneas</span>
                </a>
                
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                    aria-label={`Tienda y pedidos: ${totalCartUnits} unidades`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Tienda</span>
                    {totalCartUnits > 0 && (
                        <span className="absolute top-1 right-3 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
                            {totalCartUnits}
                        </span>
                    )}
                </button>

                {/* Central AI Trigger Floating */}
                <button 
                    onClick={() => setIsAIOpen(true)}
                    className="flex flex-col items-center justify-center min-w-[60px] min-h-[48px] gap-0.5 text-[10px] font-bold text-blue-600 dark:text-cyan-400 cursor-pointer -mt-4 transition-transform active:scale-95"
                    aria-label="Asistente virtual Lira IA"
                >
                    <div className="h-12 w-12 rounded-full bg-[#002072] text-white p-0.5 shadow-lg border-2 border-white dark:border-slate-800 overflow-hidden flex items-center justify-center ring-2 ring-cyan-400/40">
                        <img src="/assets/img/lira_head_avatar.png" alt="Lira" className="h-full w-full object-cover rounded-full" />
                    </div>
                    <span>Lira IA</span>
                </button>

                <Link 
                    href="/dashboard" 
                    className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                </Link>

                <a 
                    href="https://wa.me/584148873615?text=Hola%20Booz%20Laboratorio,%20deseo%20realizar%20una%20consulta" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                    aria-label="Consultar por WhatsApp oficial"
                >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                </a>
            </nav>

            {/* Desktop Floating Action Buttons */}
            <div className="hidden md:flex fixed bottom-6 right-6 flex-col gap-3 z-40">
                {/* WhatsApp Dedicated Button */}
                <a 
                    href="https://wa.me/584148873615?text=Hola%20Booz%20Laboratorio,%20deseo%20realizar%20una%20consulta%20sobre%20sus%20productos"
                    target="_blank" 
                    rel="noreferrer"
                    className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-400 hover:scale-110 transition-all group cursor-pointer"
                    title="Contacto directo por WhatsApp"
                >
                    <MessageCircle className="h-7 w-7" />
                </a>

                {/* AI Assistant Floating Avatar (Lira) */}
                <button 
                    onClick={() => setIsAIOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#002072] dark:bg-blue-600 text-white shadow-2xl hover:scale-110 transition-all relative group border-2 border-white dark:border-slate-800 overflow-hidden p-1 cursor-pointer"
                    title="Consultar con Lira (Asistente Virtual)"
                >
                    <img
                        src="/assets/img/lira_head_avatar.png"
                        alt="Lira"
                        className="h-full w-full object-cover rounded-full"
                    />
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[8px] font-black items-center justify-center text-slate-900">AI</span>
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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                            <div className="pt-2 text-[11px] text-slate-400">
                                <span className="text-cyan-400 font-bold">Oficina Comercial:</span> Puerto Ordaz, Edo. Bolívar.
                            </div>
                        </div>

                        {/* Col 2: Regulatory & Pharmacovigilance */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                                Canal Regulatorio
                            </h4>
                            <ul className="space-y-2 text-xs">
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

                        {/* Col 4: Official Contact & Social */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                                Contacto Oficial
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
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                                >
                                    <Facebook className="h-4 w-4 text-blue-400" />
                                    <span>Booz Laboratorio Oficial</span>
                                </a>
                                <div className="flex items-center gap-2 pt-2 text-slate-300">
                                    <Phone className="h-4 w-4 text-emerald-400" />
                                    <span>+58 (414) 887-3615</span>
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
