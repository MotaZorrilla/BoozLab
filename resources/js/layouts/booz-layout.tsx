import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal';
import SearchModal from '@/components/search-modal';
import LiraAssistantModal from '@/components/lira-assistant-modal';
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
    LayoutDashboard 
} from 'lucide-react';

export default function BoozLayout({ children }: { children: React.ReactNode }) {
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('booz_theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initial);

        if (initial === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }

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
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('booz_theme', next);
        if (next === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
            <Head title="Booz Laboratorio | Innovación Clínica" />
            
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-[#0A1124]/90 backdrop-blur-md transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo Oficial de Booz Laboratorio */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-11 w-11 rounded-xl bg-blue-900/10 dark:bg-white/10 p-1 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                                <img
                                    src="/assets/img/booz_symbol_icon.png"
                                    alt="Booz Laboratorio"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight text-[#002072] dark:text-white uppercase leading-none">
                                    BOOZ <span className="text-blue-600 dark:text-cyan-400 font-light">LABORATORIO</span>
                                </span>
                                <span className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">
                                    Ciencia que transforma el cuidado
                                </span>
                            </div>
                        </Link>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <Link href="/" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Inicio</Link>
                            <a href="/#lineas" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Líneas</a>
                            <a href="/#productos" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Productos</a>
                            <Link href="/farmacovigilancia" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Farmacovigilancia</Link>
                            <Link href="/herramientas" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Calculadora Pediátrica</Link>
                            <Link href="/glosario" className="hover:text-[#002072] dark:hover:text-cyan-400 transition-colors">Glosario</Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Theme Toggle (Light / Dark) */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                                aria-label="Cambiar tema de color"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            {/* Search Button */}
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                                title="Buscar en vademécum (Ctrl+K)"
                            >
                                <Search className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                <span>Buscar producto...</span>
                                <kbd className="text-[10px] bg-white dark:bg-slate-900 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">Ctrl K</kbd>
                            </button>

                            {/* Direct Admin Dashboard Button */}
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                                title="Acceso al Panel de Administración"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5 text-[#002072] dark:text-cyan-400" />
                                <span className="hidden md:inline">Panel Admin</span>
                            </Link>

                            {/* Habla con Lira Button */}
                            <button
                                onClick={() => setIsAIOpen(true)}
                                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#002072] via-blue-800 to-blue-700 dark:from-blue-600 dark:to-cyan-600 text-white text-xs font-bold shadow-md shadow-blue-900/20 hover:shadow-lg transition-all cursor-pointer"
                            >
                                <img
                                    src="/assets/img/lira_head_avatar.png"
                                    alt="Lira"
                                    className="h-5 w-5 rounded-full object-cover ring-1 ring-white/60"
                                />
                                <span>Habla con Lira</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Floating Quick Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
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
                                <li><a href="/#lineas" className="hover:text-cyan-400 transition-colors">01. Cuidado de la Piel (Dermatología)</a></li>
                                <li><a href="/#lineas" className="hover:text-cyan-400 transition-colors">02. Tratamiento Tópico (Antibióticos)</a></li>
                                <li><a href="/#lineas" className="hover:text-cyan-400 transition-colors">03. Salud y Bienestar (Nutrición)</a></li>
                                <li><a href="/#lineas" className="hover:text-cyan-400 transition-colors">04. Cuidado Especializado (Pie Diabético)</a></li>
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

            {/* Global Modals */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <LiraAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

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
