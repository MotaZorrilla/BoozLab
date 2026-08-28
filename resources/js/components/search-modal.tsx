import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { Search, FileText, Beaker, Book, ArrowRight } from 'lucide-react';
import { Fragment, useState, useMemo, useEffect } from 'react';
import type { Product } from '@/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchItem {
    id: string;
    type: 'producto' | 'blog' | 'glosario';
    title: string;
    subtitle: string;
    url: string;
    tags: string[];
}

const STATIC_DATA: SearchItem[] = [
    {
        id: 'b1',
        type: 'blog',
        title: 'La Ciencia detrás de la Vitamina C',
        subtitle: 'Artículo Científico',
        url: '/blog/importancia-vitamina-c-topica',
        tags: ['investigacion', 'estudio'],
    },
    {
        id: 'g1',
        type: 'glosario',
        title: 'Biodisponibilidad',
        subtitle: 'Término Técnico',
        url: '/glosario',
        tags: ['farmacocinetica'],
    },
    {
        id: 'g2',
        type: 'glosario',
        title: 'Eritema',
        subtitle: 'Término Técnico',
        url: '/glosario',
        tags: ['inflamacion'],
    },
];

const toSearchItem = (product: Product): SearchItem => ({
    id: `p${product.id}`,
    type: 'producto',
    title: product.name,
    subtitle: `${product.presentation} · ${product.active_ingredients}`,
    url: `/producto/${product.slug}`,
    tags: [
        product.name.toLowerCase(),
        product.active_ingredients.toLowerCase(),
        (product.product_line?.name ?? '').toLowerCase(),
    ],
});

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [apiProducts, setApiProducts] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasApiError, setHasApiError] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2) {
            setApiProducts([]);
            setHasApiError(false);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setIsSearching(true);
            setHasApiError(false);
            try {
                const response = await fetch(
                    `/api/search?q=${encodeURIComponent(query.trim())}`,
                    {
                        signal: controller.signal,
                    },
                );
                if (!response.ok) throw new Error('Search request failed');
                const data = (await response.json()) as Product[];
                if (!controller.signal.aborted) setApiProducts(data);
            } catch (error) {
                if ((error as Error).name === 'AbortError') return;
                if (!controller.signal.aborted) setHasApiError(true);
            } finally {
                if (!controller.signal.aborted) setIsSearching(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [query]);

    const results = useMemo(() => {
        const lowQuery = query.trim().toLowerCase();
        if (lowQuery.length < 2) return [];

        const matches = (item: SearchItem) =>
            item.title.toLowerCase().includes(lowQuery) ||
            item.subtitle.toLowerCase().includes(lowQuery) ||
            item.tags.some((tag) => tag.includes(lowQuery));

        const products = apiProducts.map(toSearchItem);
        const statics = STATIC_DATA.filter(matches);

        return [...products, ...statics].slice(0, 8);
    }, [apiProducts, query]);

    const isEmpty =
        query.trim().length >= 2 &&
        !isSearching &&
        !hasApiError &&
        results.length === 0;

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

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
                                <Search
                                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-slate-400"
                                    aria-hidden="true"
                                />
                                <input
                                    className="h-12 w-full border-0 bg-transparent pr-12 pl-11 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                                    placeholder="Buscar por producto, ingrediente (ej: Salicílico) o tema..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-4 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-400 hover:text-slate-600"
                                >
                                    ESC
                                </button>
                            </div>

                            {isSearching && (
                                <div className="px-6 py-8 text-center">
                                    <p className="text-xs font-semibold text-slate-400">
                                        Buscando en el vademécum...
                                    </p>
                                </div>
                            )}

                            {hasApiError && (
                                <div className="px-6 py-10 text-center sm:px-14">
                                    <p className="text-sm text-slate-900">
                                        No se pudo completar la búsqueda.
                                    </p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Intente nuevamente en un momento.
                                    </p>
                                </div>
                            )}

                            {!isSearching &&
                                !hasApiError &&
                                query.trim().length >= 2 &&
                                results.length > 0 && (
                                    <ul className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                                        {results.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={item.url}
                                                    onClick={onClose}
                                                    className="group flex cursor-default items-center rounded-xl p-3 transition-colors select-none hover:bg-blue-50"
                                                >
                                                    <div
                                                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
                                                            item.type ===
                                                            'producto'
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : item.type ===
                                                                    'blog'
                                                                  ? 'bg-teal-100 text-teal-600'
                                                                  : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {item.type ===
                                                            'producto' && (
                                                            <Beaker className="h-5 w-5" />
                                                        )}
                                                        {item.type ===
                                                            'blog' && (
                                                            <FileText className="h-5 w-5" />
                                                        )}
                                                        {item.type ===
                                                            'glosario' && (
                                                            <Book className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4 flex-auto">
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                                                            {item.title}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500">
                                                            {item.subtitle}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="ml-3 h-4 w-4 flex-none text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            {isEmpty && (
                                <div className="px-6 py-14 text-center sm:px-14">
                                    <Beaker className="mx-auto h-6 w-6 text-slate-400" />
                                    <p className="mt-4 text-sm text-slate-900">
                                        No se encontraron resultados clínicos
                                        para esa búsqueda.
                                    </p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Intente buscar por ingrediente activo o
                                        línea de producto.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
                                Resultados del vademécum oficial en tiempo real.
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
