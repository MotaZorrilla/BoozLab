import { Head, Link, router } from '@inertiajs/react';
import {
    ShoppingBag,
    MessageCircle,
    BarChart2,
    Package,
    Plus,
    Search,
    Download,
    Printer,
    CheckCircle2,
    Edit2,
    Trash2,
    Phone,
    Building2,
    Layers,
    DollarSign,
    AlertTriangle,
    Save,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

type QuoteStatus = 'Pendiente' | 'Contactado' | 'Despachado' | 'Cancelado';
type CustomerType = 'Paciente' | 'Farmacia' | 'Clínica' | 'Distribuidor';
import Modal from '@/components/modal';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import AppLayout from '@/layouts/app-layout';

interface QuoteItem {
    id: number;
    quote_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    product?: {
        name: string;
        presentation: string;
        price: number;
        stock: number;
    } | null;
}

interface QuoteRecord {
    id: number;
    quote_number: string;
    customer_name: string;
    customer_contact: string | null;
    customer_type: 'Paciente' | 'Farmacia' | 'Clínica' | 'Distribuidor';
    channel: 'whatsapp' | 'web_cart' | 'manual';
    total_items: number;
    total_amount: number;
    status: 'Pendiente' | 'Contactado' | 'Despachado' | 'Cancelado';
    admin_notes: string | null;
    downloaded_at: string | null;
    is_downloaded: boolean;
    created_at: string;
    items: QuoteItem[];
}

interface ProductOption {
    id: number;
    name: string;
    presentation: string;
    price: number;
    stock: number;
    quote_inquiries_count: number;
    is_active: boolean;
}

interface TopProduct {
    id: number;
    name: string;
    slug: string;
    quote_inquiries_count: number;
    price: number;
    stock: number;
}

interface QuotesPageProps {
    quotes: {
        data: QuoteRecord[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters?: {
        search: string;
        status: string;
        customer_type: string;
        channel: string;
    };
    stats: {
        total_quotes: number;
        pending_quotes: number;
        dispatched_quotes: number;
        total_amount_sum: number;
        total_units_demanded: number;
        channel_stats: {
            whatsapp: number;
            web_cart: number;
            manual: number;
        };
        customer_type_stats: {
            Paciente: number;
            Farmacia: number;
            Clínica: number;
            Distribuidor: number;
        };
    };
    allProducts: ProductOption[];
    topProducts: TopProduct[];
}

export default function AdminQuotes({
    quotes,
    filters = {
        search: '',
        status: 'Todos',
        customer_type: 'Todos',
        channel: 'Todos',
    },
    stats = {
        total_quotes: 0,
        pending_quotes: 0,
        dispatched_quotes: 0,
        total_amount_sum: 0,
        total_units_demanded: 0,
        channel_stats: { whatsapp: 0, web_cart: 0, manual: 0 },
        customer_type_stats: {
            Paciente: 0,
            Farmacia: 0,
            Clínica: 0,
            Distribuidor: 0,
        },
    },
    allProducts = [],
    topProducts = [],
}: QuotesPageProps) {
    const { createWhatsAppUrl } = useWhatsApp();
    const [activeTab, setActiveTab] = useState<
        'quotes' | 'inventory' | 'funnel'
    >('quotes');

    // Filtros locales
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'Todos');
    const [typeFilter, setTypeFilter] = useState(
        filters.customer_type || 'Todos',
    );
    const [channelFilter, setChannelFilter] = useState(
        filters.channel || 'Todos',
    );

    // Modales
    const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(
        null,
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Formulario de edición de estado y notas
    const [editStatus, setEditStatus] = useState<
        'Pendiente' | 'Contactado' | 'Despachado' | 'Cancelado'
    >('Pendiente');
    const [editNotes, setEditNotes] = useState('');

    // Formulario de nueva cotización manual
    const [manualForm, setManualForm] = useState({
        customer_name: '',
        customer_contact: '',
        customer_type: 'Farmacia' as
            | 'Paciente'
            | 'Farmacia'
            | 'Clínica'
            | 'Distribuidor',
        status: 'Pendiente' as
            | 'Pendiente'
            | 'Contactado'
            | 'Despachado'
            | 'Cancelado',
        admin_notes: '',
        items: [{ product_id: allProducts[0]?.id || 1, quantity: 10 }],
    });

    // Estado local para carga rápida de unidades disponibles / inventario
    const [stockInputs, setStockInputs] = useState<Record<number, number>>(
        () => {
            const map: Record<number, number> = {};
            allProducts.forEach((p) => {
                map[p.id] = p.stock;
            });
            return map;
        },
    );
    const [savingStockId, setSavingStockId] = useState<number | null>(null);

    const handleApplyFilters = () => {
        router.get(
            '/admin/quotes',
            {
                search: searchTerm || undefined,
                status: statusFilter !== 'Todos' ? statusFilter : undefined,
                customer_type: typeFilter !== 'Todos' ? typeFilter : undefined,
                channel: channelFilter !== 'Todos' ? channelFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setTypeFilter('Todos');
        setChannelFilter('Todos');
        router.get('/admin/quotes', {}, { preserveState: true });
    };

    const openEditModal = (q: QuoteRecord) => {
        setSelectedQuote(q);
        setEditStatus(q.status);
        setEditNotes(q.admin_notes || '');
        setIsEditModalOpen(true);
    };

    const handleUpdateQuote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuote) return;

        router.put(
            `/admin/quotes/${selectedQuote.id}`,
            {
                status: editStatus,
                admin_notes: editNotes,
            },
            {
                onSuccess: () => setIsEditModalOpen(false),
            },
        );
    };

    const handleDeleteQuote = (quoteId: number) => {
        if (
            confirm(
                '¿Estás seguro de que deseas eliminar esta cotización del registro?',
            )
        ) {
            router.delete(`/admin/quotes/${quoteId}`, {
                onSuccess: () => {
                    if (selectedQuote?.id === quoteId) {
                        setIsEditModalOpen(false);
                        setSelectedQuote(null);
                    }
                },
            });
        }
    };

    const handleAddItemToManual = () => {
        setManualForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                { product_id: allProducts[0]?.id || 1, quantity: 5 },
            ],
        }));
    };

    const handleRemoveItemFromManual = (idx: number) => {
        setManualForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx),
        }));
    };

    const handleManualItemChange = (
        idx: number,
        field: 'product_id' | 'quantity',
        value: number,
    ) => {
        setManualForm((prev) => {
            const next = [...prev.items];
            next[idx] = { ...next[idx], [field]: value };
            return { ...prev, items: next };
        });
    };

    const manualEstimatedTotal = useMemo(() => {
        const prodMap = new Map(allProducts.map((p) => [p.id, p.price]));
        return manualForm.items.reduce((sum, item) => {
            const price = prodMap.get(item.product_id) || 0;
            return sum + price * item.quantity;
        }, 0);
    }, [manualForm.items, allProducts]);

    const handleCreateManualQuote = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualForm.items.length === 0) {
            alert('Debes incluir al menos un fármaco en la cotización.');
            return;
        }

        router.post('/admin/quotes', manualForm, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setManualForm({
                    customer_name: '',
                    customer_contact: '',
                    customer_type: 'Farmacia',
                    status: 'Pendiente',
                    admin_notes: '',
                    items: [
                        { product_id: allProducts[0]?.id || 1, quantity: 10 },
                    ],
                });
            },
        });
    };

    const handleSaveStock = (productId: number) => {
        const newStock = stockInputs[productId] ?? 0;
        setSavingStockId(productId);
        router.post(
            '/admin/quotes/update-stock',
            {
                product_id: productId,
                stock: newStock,
            },
            {
                preserveScroll: true,
                onFinish: () => setSavingStockId(null),
            },
        );
    };

    const handleWhatsAppReply = (q: QuoteRecord) => {
        if (!q.customer_contact) return;
        const msg = `*HOLA ${q.customer_name.toUpperCase()}* 🔬\nLe escribe el Dpto. Comercial de *Booz Laboratorio* respecto a su cotización *#${q.quote_number}*.\n\nConfirmamos la recepción de su solicitud por un total de *${q.total_items} unidades* ($${q.total_amount.toFixed(2)} USD).\n\n¿En qué farmacia o ciudad requiere el despacho?`;
        window.open(createWhatsAppUrl(msg, q.customer_contact), '_blank');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
                {
                    title: 'Cotizaciones & Tienda Virtual',
                    href: '/admin/quotes',
                },
            ]}
        >
            <Head title="Administrador de Tienda Virtual & Cotizaciones | Booz Laboratorio" />

            <div className="mx-auto max-w-7xl space-y-6 p-3 sm:p-6 lg:p-8 2xl:max-w-[1600px] 3xl:max-w-[1880px]">
                {/* Cabecera Principal */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <ShoppingBag className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase dark:bg-emerald-950 dark:text-emerald-300">
                                Administrador de Tienda Virtual
                            </div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Cotizaciones, Demanda Comercial & Stock
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de pedidos de la tienda, registro
                                manual, descarga de comprobantes y carga rápida
                                de unidades disponibles.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <a
                            href="/admin/quotes/export-csv"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Download className="h-4 w-4" />
                            <span>Exportar CSV</span>
                        </a>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002072] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Nueva Cotización Manual</span>
                        </button>
                    </div>
                </div>

                {/* Métricas y KPIs de Tienda */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Total Cotizaciones
                            </span>
                            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                            {stats.total_quotes}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {stats.pending_quotes} pendientes •{' '}
                            {stats.dispatched_quotes} despachadas
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Unidades Demandadas
                            </span>
                            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-cyan-400">
                                <Package className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                            {stats.total_units_demanded}
                        </div>
                        <div className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            Volumen solicitado por clientes
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Monto Total Cotizado
                            </span>
                            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-1 font-mono text-2xl font-black text-slate-900 dark:text-white">
                            ${stats.total_amount_sum.toFixed(2)}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            En Dólares USD (Tasa BCV)
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Canales de Pedido
                            </span>
                            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                <Layers className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-2 space-y-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    WhatsApp:
                                </span>
                                <span>
                                    {stats.channel_stats?.whatsapp || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    Carrito Web:
                                </span>
                                <span>
                                    {stats.channel_stats?.web_cart || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    Manual / Planta:
                                </span>
                                <span>{stats.channel_stats?.manual || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs de Navegación de la Tienda Virtual */}
                <div className="flex gap-2 border-b border-slate-200 text-sm font-bold dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('quotes')}
                        className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 transition-all ${
                            activeTab === 'quotes'
                                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Cotizaciones & Pedidos ({quotes.total})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 transition-all ${
                            activeTab === 'inventory'
                                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Package className="h-4 w-4" />
                        <span>
                            Inventario & Stock de Tienda ({allProducts.length})
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('funnel')}
                        className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 transition-all ${
                            activeTab === 'funnel'
                                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <BarChart2 className="h-4 w-4" />
                        <span>Embudo de Conversión & Clientes</span>
                    </button>
                </div>

                {/* PESTAÑA 1: CRUD DE COTIZACIONES */}
                {activeTab === 'quotes' && (
                    <div className="space-y-4">
                        {/* Barra de Búsqueda y Filtros */}
                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row dark:border-slate-800 dark:bg-slate-900">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por N° COT, cliente, teléfono..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' &&
                                        handleApplyFilters()
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="Todos">
                                        Todos los Estados
                                    </option>
                                    <option value="Pendiente">
                                        Pendientes
                                    </option>
                                    <option value="Contactado">
                                        Contactados
                                    </option>
                                    <option value="Despachado">
                                        Despachados
                                    </option>
                                    <option value="Cancelado">
                                        Cancelados
                                    </option>
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(e.target.value)
                                    }
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="Todos">
                                        Todos los Clientes
                                    </option>
                                    <option value="Paciente">Pacientes</option>
                                    <option value="Farmacia">Farmacias</option>
                                    <option value="Clínica">
                                        Clínicas / Médicos
                                    </option>
                                    <option value="Distribuidor">
                                        Distribuidores
                                    </option>
                                </select>

                                <select
                                    value={channelFilter}
                                    onChange={(e) =>
                                        setChannelFilter(e.target.value)
                                    }
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="Todos">
                                        Todos los Canales
                                    </option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="web_cart">
                                        Carrito Web
                                    </option>
                                    <option value="manual">
                                        Manual / Planta
                                    </option>
                                </select>

                                <button
                                    onClick={handleApplyFilters}
                                    className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-500"
                                >
                                    Filtrar
                                </button>

                                {(searchTerm ||
                                    statusFilter !== 'Todos' ||
                                    typeFilter !== 'Todos' ||
                                    channelFilter !== 'Todos') && (
                                    <button
                                        onClick={handleResetFilters}
                                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla Principal de Cotizaciones */}
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                                        <tr>
                                            <th className="px-4 py-3.5">
                                                N° Cotización
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Cliente / Contacto
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Tipo & Canal
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Fármacos Solicitados
                                            </th>
                                            <th className="px-4 py-3.5 text-right">
                                                Total ($)
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Comprobante
                                            </th>
                                            <th className="px-4 py-3.5 text-right">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {quotes.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="py-12 text-center text-slate-400"
                                                >
                                                    No se encontraron
                                                    cotizaciones con los
                                                    criterios seleccionados.
                                                </td>
                                            </tr>
                                        ) : (
                                            quotes.data.map((q) => (
                                                <tr
                                                    key={q.id}
                                                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                                >
                                                    <td className="px-4 py-3.5 font-mono font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                        {q.quote_number}
                                                        <div className="font-sans text-[10px] font-normal text-slate-400">
                                                            {q.created_at}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {q.customer_name}
                                                        </div>
                                                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                                                            {q.customer_contact ? (
                                                                <>
                                                                    <Phone className="h-3 w-3 text-emerald-500" />
                                                                    <span>
                                                                        {
                                                                            q.customer_contact
                                                                        }
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-slate-400 italic">
                                                                    Sin teléfono
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-block w-fit rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#002072] dark:bg-blue-950/60 dark:text-cyan-300">
                                                                {
                                                                    q.customer_type
                                                                }
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 capitalize">
                                                                Vía{' '}
                                                                {q.channel ===
                                                                'whatsapp'
                                                                    ? 'WhatsApp'
                                                                    : q.channel ===
                                                                        'web_cart'
                                                                      ? 'Carrito Web'
                                                                      : 'Manual'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="max-w-xs space-y-0.5">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {q.total_items}{' '}
                                                                {q.total_items ===
                                                                1
                                                                    ? 'unidad'
                                                                    : 'unidades'}{' '}
                                                                (
                                                                {q.items
                                                                    ?.length ||
                                                                    0}{' '}
                                                                fármacos)
                                                            </div>
                                                            <div className="truncate text-[10px] text-slate-400">
                                                                {q.items
                                                                    ?.map(
                                                                        (it) =>
                                                                            `${it.quantity}x ${it.product?.name || 'Fármaco'}`,
                                                                    )
                                                                    .join(', ')}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-mono font-black whitespace-nowrap text-slate-900 dark:text-white">
                                                        $
                                                        {q.total_amount.toFixed(
                                                            2,
                                                        )}{' '}
                                                        USD
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <span
                                                            className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-black ${
                                                                q.status ===
                                                                'Despachado'
                                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                    : q.status ===
                                                                        'Contactado'
                                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                                      : q.status ===
                                                                          'Cancelado'
                                                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                            }`}
                                                        >
                                                            {q.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        {q.is_downloaded ? (
                                                            <span
                                                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                                                                title={`Descargado: ${q.downloaded_at}`}
                                                            >
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span>
                                                                    Descargado
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">
                                                                No descargado
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {q.customer_contact && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleWhatsAppReply(
                                                                            q,
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-950"
                                                                    title="Chatear con el cliente por WhatsApp"
                                                                >
                                                                    <MessageCircle className="h-4 w-4" />
                                                                </button>
                                                            )}

                                                            <a
                                                                href={`/admin/quotes/${q.id}/print`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="rounded-lg bg-blue-50 p-1.5 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-cyan-400"
                                                                title="Ver / Imprimir Comprobante Oficial"
                                                            >
                                                                <Printer className="h-4 w-4" />
                                                            </a>

                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        q,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg bg-slate-100 p-1.5 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                                                                title="Gestionar estado y notas"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteQuote(
                                                                        q.id,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-950/60"
                                                                title="Eliminar cotización"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación simple */}
                            {quotes.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs text-slate-500 dark:border-slate-800">
                                    <span>
                                        Página {quotes.current_page} de{' '}
                                        {quotes.last_page}
                                    </span>
                                    <div className="flex gap-2">
                                        {quotes.current_page > 1 && (
                                            <Link
                                                href={`/admin/quotes?page=${quotes.current_page - 1}`}
                                                className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold hover:bg-slate-200 dark:bg-slate-800"
                                            >
                                                Anterior
                                            </Link>
                                        )}
                                        {quotes.current_page <
                                            quotes.last_page && (
                                            <Link
                                                href={`/admin/quotes?page=${quotes.current_page + 1}`}
                                                className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold hover:bg-slate-200 dark:bg-slate-800"
                                            >
                                                Siguiente
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PESTAÑA 2: INVENTARIO & STOCK DE TIENDA */}
                {activeTab === 'inventory' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/60 dark:bg-blue-950/40">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-[#002072] dark:text-cyan-400" />
                                <div className="text-xs text-slate-700 dark:text-slate-300">
                                    <strong>
                                        Carga y Control de Unidades Disponibles:
                                    </strong>{' '}
                                    Modifica el stock de cualquier fármaco para
                                    la tienda virtual y presiona "Guardar" para
                                    sincronizar de inmediato.
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                                        <tr>
                                            <th className="px-4 py-3.5">
                                                Fármaco / Producto
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Presentación
                                            </th>
                                            <th className="px-4 py-3.5 text-right">
                                                Precio ($ USD)
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Demanda Acumulada
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Estado de Stock
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Unidades Disponibles
                                            </th>
                                            <th className="px-4 py-3.5 text-right">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {allProducts.map((p) => {
                                            const currentInput =
                                                stockInputs[p.id] ?? p.stock;
                                            const isLow = currentInput < 15;
                                            return (
                                                <tr
                                                    key={p.id}
                                                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                                >
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {p.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            ID #{p.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                                        {p.presentation}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                                        ${p.price.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                                                        {
                                                            p.quote_inquiries_count
                                                        }{' '}
                                                        cotizaciones
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        {isLow ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                <span>
                                                                    Stock Bajo
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                                Óptimo
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="50000"
                                                                value={
                                                                    currentInput
                                                                }
                                                                onChange={(e) =>
                                                                    setStockInputs(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [p.id]:
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ) ||
                                                                                0,
                                                                        }),
                                                                    )
                                                                }
                                                                className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center font-mono text-xs font-bold focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                                            />
                                                            <span className="text-[11px] text-slate-400">
                                                                uds
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <button
                                                            onClick={() =>
                                                                handleSaveStock(
                                                                    p.id,
                                                                )
                                                            }
                                                            disabled={
                                                                savingStockId ===
                                                                p.id
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-blue-500 disabled:opacity-50"
                                                        >
                                                            <Save className="h-3.5 w-3.5" />
                                                            <span>
                                                                {savingStockId ===
                                                                p.id
                                                                    ? 'Guardando...'
                                                                    : 'Guardar'}
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* PESTAÑA 3: EMBUDO DE CONVERSIÓN & CLIENTES */}
                {activeTab === 'funnel' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Canales y Tipología de Cliente */}
                        <div className="space-y-6">
                            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                    <Layers className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                    <span>
                                        Distribución por Canal de Origen
                                    </span>
                                </h3>

                                <div className="space-y-3">
                                    {[
                                        {
                                            label: 'WhatsApp Directo',
                                            count:
                                                stats.channel_stats?.whatsapp ||
                                                0,
                                            color: 'bg-emerald-500',
                                        },
                                        {
                                            label: 'Carrito Web (Telemetría)',
                                            count:
                                                stats.channel_stats?.web_cart ||
                                                0,
                                            color: 'bg-blue-500',
                                        },
                                        {
                                            label: 'Registro Manual en Planta',
                                            count:
                                                stats.channel_stats?.manual ||
                                                0,
                                            color: 'bg-purple-500',
                                        },
                                    ].map((c) => {
                                        const pct =
                                            stats.total_quotes > 0
                                                ? (
                                                      (c.count /
                                                          stats.total_quotes) *
                                                      100
                                                  ).toFixed(1)
                                                : '0';
                                        return (
                                            <div
                                                key={c.label}
                                                className="space-y-1"
                                            >
                                                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    <span>{c.label}</span>
                                                    <span>
                                                        {c.count} ({pct}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className={`h-full ${c.color} rounded-full`}
                                                        style={{
                                                            width: `${pct}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                    <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <span>
                                        Segmentación por Tipo de Cliente
                                    </span>
                                </h3>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                            Farmacias Aliadas
                                        </span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats
                                                ?.Farmacia || 0}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                            Clínicas / Doctores
                                        </span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats
                                                ?.Clínica || 0}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                            Distribuidores B2B
                                        </span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats
                                                ?.Distribuidor || 0}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                            Pacientes Particulares
                                        </span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats
                                                ?.Paciente || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Fármacos Demandados */}
                        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                <BarChart2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Ranking de Fármacos Más Cotizados</span>
                            </h3>

                            <div className="space-y-3">
                                {topProducts.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-[#002072] dark:bg-blue-950 dark:text-cyan-400">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {p.name}
                                                </div>
                                                <div className="font-mono text-[10px] text-slate-400">
                                                    ${p.price.toFixed(2)} USD •
                                                    Stock: {p.stock} uds
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                                {p.quote_inquiries_count} cotiz.
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: DETALLE Y EDICIÓN DE ESTADO */}
                <Modal
                    isOpen={isEditModalOpen}
                    show={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    maxWidth="2xl"
                >
                    {selectedQuote && (
                        <div className="space-y-6 p-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                <div>
                                    <div className="text-xs font-bold text-slate-400">
                                        Gestión de Pedido / Cotización
                                    </div>
                                    <h2 className="font-mono text-lg font-black text-slate-900 dark:text-white">
                                        {selectedQuote.quote_number}
                                    </h2>
                                </div>
                                <a
                                    href={`/admin/quotes/${selectedQuote.id}/print`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#002072] transition-all hover:bg-blue-100 dark:bg-blue-950 dark:text-cyan-400"
                                >
                                    <Printer className="h-3.5 w-3.5" />
                                    <span>Comprobante Oficial</span>
                                </a>
                            </div>

                            {/* Datos del Cliente */}
                            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-700 dark:bg-slate-800/60">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                        Cliente
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {selectedQuote.customer_name}
                                    </span>
                                    <span className="block text-[11px] text-slate-500">
                                        {selectedQuote.customer_contact ||
                                            'Sin teléfono'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                        Tipo & Canal
                                    </span>
                                    <span className="font-bold text-[#002072] dark:text-cyan-400">
                                        {selectedQuote.customer_type}
                                    </span>
                                    <span className="block text-[11px] text-slate-500 capitalize">
                                        Vía {selectedQuote.channel}
                                    </span>
                                </div>
                            </div>

                            {/* Detalle de Fármacos */}
                            <div>
                                <h4 className="mb-2 text-xs font-bold text-slate-900 dark:text-white">
                                    Fármacos Incluidos:
                                </h4>
                                <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 text-xs dark:divide-slate-800 dark:border-slate-800">
                                    {selectedQuote.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3"
                                        >
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {item.product?.name ||
                                                        `Fármaco #${item.product_id}`}
                                                </span>
                                                <span className="block text-[11px] text-slate-400">
                                                    {item.product?.presentation}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {item.quantity} uds
                                                </span>
                                                <span className="block font-mono text-[11px] text-slate-400">
                                                    $
                                                    {(
                                                        item.unit_price *
                                                        item.quantity
                                                    ).toFixed(2)}{' '}
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between bg-slate-50 p-3 font-bold dark:bg-slate-800/80">
                                        <span>
                                            Total ({selectedQuote.total_items}{' '}
                                            unidades):
                                        </span>
                                        <span className="font-mono text-sm text-[#002072] dark:text-cyan-400">
                                            $
                                            {selectedQuote.total_amount.toFixed(
                                                2,
                                            )}{' '}
                                            USD
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario de Actualización */}
                            <form
                                onSubmit={handleUpdateQuote}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Estado de la Cotización:
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) =>
                                            setEditStatus(
                                                e.target.value as QuoteStatus,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        <option value="Pendiente">
                                            Pendiente (Por atender)
                                        </option>
                                        <option value="Contactado">
                                            Contactado (En conversación)
                                        </option>
                                        <option value="Despachado">
                                            Despachado (Entregado / Pagado)
                                        </option>
                                        <option value="Cancelado">
                                            Cancelado
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Notas Administrativas y de Despacho:
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editNotes}
                                        onChange={(e) =>
                                            setEditNotes(e.target.value)
                                        }
                                        placeholder="Ej: Número de guía de despacho, banco emisor de transferencia, farmacia receptora..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    />
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteQuote(selectedQuote.id)
                                        }
                                        className="text-xs font-bold text-rose-600 hover:underline"
                                    >
                                        Eliminar Cotización
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsEditModalOpen(false)
                                            }
                                            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            Cerrar
                                        </button>
                                        <button
                                            type="submit"
                                            className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </Modal>

                {/* MODAL: NUEVA COTIZACIÓN MANUAL */}
                <Modal
                    isOpen={isCreateModalOpen}
                    show={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    maxWidth="2xl"
                >
                    <form
                        onSubmit={handleCreateManualQuote}
                        className="space-y-5 p-6"
                    >
                        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h2 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                                <Plus className="h-5 w-5 text-emerald-600" />
                                <span>Registrar Nueva Cotización Manual</span>
                            </h2>
                            <p className="text-xs text-slate-500">
                                Carga manual de pedidos recibidos por teléfono,
                                visita en planta o convenio institucional.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                    Nombre o Razón Social *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Farmacia San José / Dr. Ramón Silva"
                                    value={manualForm.customer_name}
                                    onChange={(e) =>
                                        setManualForm({
                                            ...manualForm,
                                            customer_name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                    Teléfono o WhatsApp
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: 0414-1234567"
                                    value={manualForm.customer_contact}
                                    onChange={(e) =>
                                        setManualForm({
                                            ...manualForm,
                                            customer_contact: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                    Tipo de Cliente *
                                </label>
                                <select
                                    value={manualForm.customer_type}
                                    onChange={(e) =>
                                        setManualForm({
                                            ...manualForm,
                                            customer_type: e.target
                                                .value as CustomerType,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="Farmacia">
                                        Farmacia Aliada
                                    </option>
                                    <option value="Clínica">
                                        Clínica / Hospital / Médico
                                    </option>
                                    <option value="Distribuidor">
                                        Distribuidor B2B
                                    </option>
                                    <option value="Paciente">
                                        Paciente Particular
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                                    Estado Inicial
                                </label>
                                <select
                                    value={manualForm.status}
                                    onChange={(e) =>
                                        setManualForm({
                                            ...manualForm,
                                            status: e.target
                                                .value as QuoteStatus,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Contactado">
                                        Contactado
                                    </option>
                                    <option value="Despachado">
                                        Despachado
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Listado dinámico de fármacos */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-900 dark:text-white">
                                    Fármacos Solicitados:
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddItemToManual}
                                    className="flex cursor-pointer items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-cyan-400"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Agregar otro fármaco</span>
                                </button>
                            </div>

                            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                                {manualForm.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <select
                                            value={item.product_id}
                                            onChange={(e) =>
                                                handleManualItemChange(
                                                    idx,
                                                    'product_id',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
                                        >
                                            {allProducts.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.presentation})
                                                    - ${p.price.toFixed(2)} USD
                                                </option>
                                            ))}
                                        </select>

                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10000"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleManualItemChange(
                                                        idx,
                                                        'quantity',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    )
                                                }
                                                className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center font-bold dark:border-slate-700 dark:bg-slate-900"
                                            />
                                            <span className="text-[11px] text-slate-400">
                                                uds
                                            </span>
                                        </div>

                                        {manualForm.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveItemFromManual(
                                                        idx,
                                                    )
                                                }
                                                className="p-1 text-slate-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <span>
                                    Total Estimado (
                                    {manualForm.items.reduce(
                                        (acc, it) => acc + it.quantity,
                                        0,
                                    )}{' '}
                                    unidades):
                                </span>
                                <span className="font-mono text-sm">
                                    ${manualEstimatedTotal.toFixed(2)} USD
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Notas Comerciales:
                            </label>
                            <textarea
                                rows={2}
                                value={manualForm.admin_notes}
                                onChange={(e) =>
                                    setManualForm({
                                        ...manualForm,
                                        admin_notes: e.target.value,
                                    })
                                }
                                placeholder="Condiciones de pago, plazo, dirección de entrega..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer rounded-xl bg-[#002072] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
                            >
                                Crear Cotización
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AppLayout>
    );
}
