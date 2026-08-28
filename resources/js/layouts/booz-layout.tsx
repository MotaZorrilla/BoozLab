import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal';
import SearchModal from '@/components/search-modal';
import LiraAssistantModal from '@/components/lira-assistant-modal';
import { ShieldAlert, FileText, Info, Bot, Send, Sparkles, Search, Instagram, Facebook, Phone, MessageCircle, ArrowUp } from 'lucide-react';

export default function BoozLayout({ children }: { children: React.ReactNode }) {
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
            <style dangerouslySetInnerHTML={{ __html: `
                :root { color-scheme: light !important; }
                html { background-color: #f8fafc !important; }
                body { background-color: #f8fafc !important; color: #0f172a !important; }
            `}} />
            <Head title="Booz Laboratorio | Innovación Clínica" />
            
            {/* Navigation */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo Oficial de Booz Laboratorio */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-11 w-11 rounded-xl bg-blue-900/10 p-1 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                                <img
                                    src="/assets/img/booz_symbol_icon.png"
                                    alt="Booz Laboratorio"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight text-blue-950 uppercase leading-none">
                                    BOOZ <span className="text-blue-600 font-light">LABORATORIO</span>
                                </span>
                                <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase mt-1">
                                    Ciencia que transforma el cuidado
                                </span>
                            </div>
                        </Link>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600">
                            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                            <a href="/#lineas" className="hover:text-blue-600 transition-colors">Líneas</a>
                            <a href="/#productos" className="hover:text-blue-600 transition-colors">Productos</a>
                            <Link href="/farmacovigilancia" className="hover:text-blue-600 transition-colors">Farmacovigilancia</Link>
                            <Link href="/herramientas" className="hover:text-blue-600 transition-colors">Calculadora Pediátrica</Link>
                            <Link href="/glosario" className="hover:text-blue-600 transition-colors">Glosario</Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs hover:bg-slate-200 transition-colors border border-slate-200"
                                title="Buscar en vademécum (Ctrl+K)"
                            >
                                <Search className="h-4 w-4" />
                                <span>Buscar producto...</span>
                                <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-300">Ctrl K</kbd>
                            </button>

                            {/* Habla con Lira Button */}
                            <button
                                onClick={() => setIsAIOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-900 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-900/20 hover:from-blue-800 hover:to-blue-600 hover:shadow-lg transition-all"
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
                    className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-400 hover:scale-110 transition-all group"
                    title="Contacto directo por WhatsApp"
                >
                    <MessageCircle className="h-7 w-7" />
                </a>

                {/* AI Assistant Floating Avatar (Lira) */}
                <button 
                    onClick={() => setIsAIOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-950 text-white shadow-2xl hover:scale-110 transition-all relative group border-2 border-white overflow-hidden p-1"
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
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/90 text-white shadow-lg hover:bg-slate-900 hover:scale-105 transition-all self-end"
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
                        {/* Column 1: Brand & Regulatory Data */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <span className="text-white font-black text-lg">B</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white uppercase">
                                    BOOZ <span className="text-blue-500 font-light">LABORATORIO</span>
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                <strong>BOOZ LABORATORIO VGME, C.A.</strong><br />
                                <strong>RIF:</strong> J-40906185-0<br />
                                <strong>Farmacéutica Patrocinante:</strong> Farm. Merbry Pérez Malavé.<br />
                                Planta y Domicilio: Av. Hospital, cruce con Troncal 11, Local N° 2, Sector El Placer, Valle de Guanape, Edo. Anzoátegui, Zona Postal 6032.
                            </p>
                            <div className="flex gap-3 pt-2">
                                <a 
                                    href="https://instagram.com/booz.laboratorio" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: 4 Líneas Terapéuticas */}
                        <div>
                            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Líneas de Producto</h3>
                            <ul className="space-y-2.5 text-xs">
                                <li><a href="/#lineas" className="hover:text-blue-400 transition-colors">01 Cuidado de la Piel (Calamicis, Beducis)</a></li>
                                <li><a href="/#lineas" className="hover:text-blue-400 transition-colors">02 Tratamiento Tópico (Bacumer, Amikacis)</a></li>
                                <li><a href="/#lineas" className="hover:text-blue-400 transition-colors">03 Salud y Bienestar (Albemer, Cevitmer)</a></li>
                                <li><a href="/#lineas" className="hover:text-blue-400 transition-colors">04 Cuidado Especializado (Bactrocis Pie Diabético)</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Regulación y Soporte Sanitario */}
                        <div>
                            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Canal Sanitario (INH)</h3>
                            <ul className="space-y-2.5 text-xs">
                                <li>
                                    <Link href="/farmacovigilancia" className="text-amber-400 font-semibold hover:underline flex items-center gap-1.5">
                                        <ShieldAlert className="h-3.5 w-3.5" /> Reportar Evento Adverso / Lote
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/herramientas" className="hover:text-blue-400 transition-colors">
                                        Calculadora de Dosificación Pediátrica
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/glosario" className="hover:text-blue-400 transition-colors">
                                        Glosario Farmacéutico
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => setIsLegalOpen(true)} className="hover:text-blue-400 transition-colors text-left">
                                        Política de No-Automedicación y Aviso Legal
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Sedes y Contacto */}
                        <div>
                            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Atención y Sedes</h3>
                            <ul className="space-y-3 text-xs">
                                <li>
                                    <span className="text-slate-500 font-medium">Sede Operativa:</span><br />
                                    Valle de Guanape, Edo. Anzoátegui.
                                </li>
                                <li>
                                    <span className="text-slate-500 font-medium">Oficinas Comerciales:</span><br />
                                    Puerto Ordaz, Edo. Bolívar.
                                </li>
                                <li>
                                    <span className="text-slate-500 font-medium">Línea WhatsApp / Distribución:</span><br />
                                    <a href="https://wa.me/584148873615" className="text-white font-semibold hover:text-emerald-400 transition-colors">
                                        +58 414 887-3615
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
                        <p>© 2026 BOOZ LABORATORIO VGME, C.A. Todos los derechos reservados. Registrado ante las autoridades sanitarias venezolanas.</p>
                        <p>Desarrollado con excelencia por NeoBranding</p>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <SearchModal 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />

            <LiraAssistantModal 
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
            />

            <Modal 
                isOpen={isLegalOpen} 
                onClose={() => setIsLegalOpen(false)} 
                title="Aviso Sanitario y Política de No-Automedicación"
            >
                <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                    <h4 className="font-bold text-slate-900">1. Política Ética de No-Automedicación</h4>
                    <p>
                        En BOOZ LABORATORIO VGME, C.A., estamos firmemente comprometidos con el uso racional de los medicamentos. La información suministrada en este portal web, en las fichas técnicas y a través de nuestro asistente virtual tiene fines estrictamente educativos y referenciales. Bajo ningún concepto sustituye el diagnóstico, prescripción ni seguimiento de un médico colegiado o farmacéutico tratante.
                    </p>
                    <h4 className="font-bold text-slate-900">2. Medicamentos Bajo Prescripción</h4>
                    <p>
                        Los productos antibióticos (como Moxifloxacina, Amikacina, Gentamicina) y corticosteroides (como Betametasona, Dexametasona) requieren indicación y récipe médico para su dispensación formal.
                    </p>
                    <h4 className="font-bold text-slate-900">3. Canal Oficial de Farmacovigilancia</h4>
                    <p>
                        Cualquier sospecha de falla de calidad, alteración de lote o reacción adversa debe ser notificada a través de nuestro formulario oficial de Farmacovigilancia para el debido seguimiento ante el Instituto Nacional de Higiene "Rafael Rangel".
                    </p>
                </div>
            </Modal>
        </div>
    );
}
