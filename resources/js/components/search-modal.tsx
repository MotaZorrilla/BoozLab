import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useMemo, useEffect } from 'react';
import { Search, FileText, Beaker, Book, ArrowRight, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SEARCH_DATA = [
    { id: 'p1', type: 'producto', title: 'Cevitmer', subtitle: 'Vitamina C (Ácido L-Ascórbico)', url: '/producto/cevitmer', tags: ['nutricion', 'antioxidante', 'colageno'] },
    { id: 'p2', type: 'producto', title: 'Clindamer', subtitle: 'Clindamicina 1%', url: '/producto/clindamer', tags: ['acne', 'antibiotico', 'inflamacion'] },
    { id: 'p3', type: 'producto', title: 'Salicis', subtitle: 'Ácido Salicílico 2%', url: '/producto/salicis', tags: ['acne', 'queratolitico', 'poros'] },
    { id: 'p4', type: 'producto', title: 'Hidramer', subtitle: 'Ácido Hialurónico', url: '/producto/hidramer', tags: ['hidratacion', 'barrera', 'sensible'] },
    { id: 'b1', type: 'blog', title: 'La Ciencia detrás de la Vitamina C', subtitle: 'Artículo Científico', url: '/blog/importancia-vitamina-c-topica', tags: ['investigacion', 'estudio'] },
    { id: 'g1', type: 'glosario', title: 'Biodisponibilidad', subtitle: 'Término Técnico', url: '/glosario', tags: ['farmacocinetica'] },
    { id: 'g2', type: 'glosario', title: 'Eritema', subtitle: 'Término Técnico', url: '/glosario', tags: ['inflamacion'] },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (query.length < 2) return [];
        const lowQuery = query.toLowerCase();
        return SEARCH_DATA.filter(item => 
            item.title.toLowerCase().includes(lowQuery) || 
            item.subtitle.toLowerCase().includes(lowQuery) ||
            item.tags.some(tag => tag.includes(lowQuery))
        ).slice(0, 6);
    }, [query]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                isOpen ? onClose() : null; // Logic handled by parent but good to have
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[150]" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="mx-auto max-w-2xl transform divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
                                <input
                                    className="h-12 w-full border-0 bg-transparent pl-11 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm outline-none"
                                    placeholder="Buscar por producto, ingrediente (ej: Salicílico) o tema..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                                <button 
                                    onClick={onClose}
                                    className="absolute right-4 top-3 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                                >
                                    ESC
                                </button>
                            </div>

                            {query.length >= 2 && results.length > 0 && (
                                <ul className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                                    {results.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={item.url}
                                                onClick={onClose}
                                                className="group flex cursor-default select-none items-center rounded-xl p-3 hover:bg-blue-50 transition-colors"
                                            >
                                                <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
                                                    item.type === 'producto' ? 'bg-blue-100 text-blue-600' : 
                                                    item.type === 'blog' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {item.type === 'producto' && <Beaker className="h-5 w-5" />}
                                                    {item.type === 'blog' && <FileText className="h-5 w-5" />}
                                                    {item.type === 'glosario' && <Book className="h-5 w-5" />}
                                                </div>
                                                <div className="ml-4 flex-auto">
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                                                </div>
                                                <ArrowRight className="ml-3 h-4 w-4 flex-none text-slate-300 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {query.length >= 2 && results.length === 0 && (
                                <div className="px-6 py-14 text-center sm:px-14">
                                    <Beaker className="mx-auto h-6 w-6 text-slate-400" />
                                    <p className="mt-4 text-sm text-slate-900">No se encontraron resultados clínicos para esa búsqueda.</p>
                                    <p className="mt-2 text-xs text-slate-500">Intente buscar por ingrediente activo o línea de producto.</p>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
                                Sugerencias: <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold text-slate-900">⌘</kbd> <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold text-slate-900">K</kbd> para abrir.
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
