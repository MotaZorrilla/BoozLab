import { Head, Link, router } from '@inertiajs/react';
import { 
    TrendingUp, ShoppingBag, MessageCircle, ArrowUpRight, BarChart2, Package,
    Plus, Search, Filter, Download, Printer, CheckCircle2, Clock, XCircle,
    Eye, Edit2, Trash2, Phone, Building2, User, Hospital, Truck, Layers,
    DollarSign, AlertTriangle, Save, Check
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';
import { useWhatsApp } from '@/hooks/use-whatsapp';

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
    filters = { search: '', status: 'Todos', customer_type: 'Todos', channel: 'Todos' },
    stats = {
        total_quotes: 0,
        pending_quotes: 0,
        dispatched_quotes: 0,
        total_amount_sum: 0,
        total_units_demanded: 0,
        channel_stats: { whatsapp: 0, web_cart: 0, manual: 0 },
        customer_type_stats: { Paciente: 0, Farmacia: 0, Clínica: 0, Distribuidor: 0 },
    },
    allProducts = [],
    topProducts = [],
}: QuotesPageProps) {
    const { createWhatsAppUrl } = useWhatsApp();
    const [activeTab, setActiveTab] = useState<'quotes' | 'inventory' | 'funnel'>('quotes');

    // Filtros locales
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'Todos');
    const [typeFilter, setTypeFilter] = useState(filters.customer_type || 'Todos');
    const [channelFilter, setChannelFilter] = useState(filters.channel || 'Todos');

    // Modales
    const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Formulario de edición de estado y notas
    const [editStatus, setEditStatus] = useState<'Pendiente' | 'Contactado' | 'Despachado' | 'Cancelado'>('Pendiente');
    const [editNotes, setEditNotes] = useState('');

    // Formulario de nueva cotización manual
    const [manualForm, setManualForm] = useState({
        customer_name: '',
        customer_contact: '',
        customer_type: 'Farmacia' as 'Paciente' | 'Farmacia' | 'Clínica' | 'Distribuidor',
        status: 'Pendiente' as 'Pendiente' | 'Contactado' | 'Despachado' | 'Cancelado',
        admin_notes: '',
        items: [{ product_id: allProducts[0]?.id || 1, quantity: 10 }],
    });

    // Estado local para carga rápida de unidades disponibles / inventario
    const [stockInputs, setStockInputs] = useState<Record<number, number>>(() => {
        const map: Record<number, number> = {};
        allProducts.forEach((p) => {
            map[p.id] = p.stock;
        });
        return map;
    });
    const [savingStockId, setSavingStockId] = useState<number | null>(null);

    const handleApplyFilters = () => {
        router.get('/admin/quotes', {
            search: searchTerm || undefined,
            status: statusFilter !== 'Todos' ? statusFilter : undefined,
            customer_type: typeFilter !== 'Todos' ? typeFilter : undefined,
            channel: channelFilter !== 'Todos' ? channelFilter : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
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

        router.put(`/admin/quotes/${selectedQuote.id}`, {
            status: editStatus,
            admin_notes: editNotes,
        }, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const handleDeleteQuote = (quoteId: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta cotización del registro?')) {
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
            items: [...prev.items, { product_id: allProducts[0]?.id || 1, quantity: 5 }],
        }));
    };

    const handleRemoveItemFromManual = (idx: number) => {
        setManualForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx),
        }));
    };

    const handleManualItemChange = (idx: number, field: 'product_id' | 'quantity', value: number) => {
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
            return sum + (price * item.quantity);
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
                    items: [{ product_id: allProducts[0]?.id || 1, quantity: 10 }],
                });
            },
        });
    };

    const handleSaveStock = (productId: number) => {
        const newStock = stockInputs[productId] ?? 0;
        setSavingStockId(productId);
        router.post('/admin/quotes/update-stock', {
            product_id: productId,
            stock: newStock,
        }, {
            preserveScroll: true,
            onFinish: () => setSavingStockId(null),
        });
    };

    const handleWhatsAppReply = (q: QuoteRecord) => {
        if (!q.customer_contact) return;
        const msg = `*HOLA ${q.customer_name.toUpperCase()}* 🔬\nLe escribe el Dpto. Comercial de *Booz Laboratorio* respecto a su cotización *#${q.quote_number}*.\n\nConfirmamos la recepción de su solicitud por un total de *${q.total_items} unidades* ($${q.total_amount.toFixed(2)} USD).\n\n¿En qué farmacia o ciudad requiere el despacho?`;
        window.open(createWhatsAppUrl(msg, q.customer_contact), '_blank');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Cotizaciones & Tienda Virtual', href: '/admin/quotes' }]}>
            <Head title="Administrador de Tienda Virtual & Cotizaciones | Booz Laboratorio" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Cabecera Principal */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                            <ShoppingBag className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase mb-1">
                                Administrador de Tienda Virtual
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Cotizaciones, Demanda Comercial & Stock
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de pedidos de la tienda, registro manual, descarga de comprobantes y carga rápida de unidades disponibles.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <a
                            href="/admin/quotes/export-csv"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <Download className="h-4 w-4" />
                            <span>Exportar CSV</span>
                        </a>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 transition-all cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Nueva Cotización Manual</span>
                        </button>
                    </div>
                </div>

                {/* Métricas y KPIs de Tienda */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Cotizaciones</span>
                            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total_quotes}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            {stats.pending_quotes} pendientes • {stats.dispatched_quotes} despachadas
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unidades Demandadas</span>
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
                                <Package className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total_units_demanded}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            Volumen solicitado por clientes
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monto Total Cotizado</span>
                            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                            ${stats.total_amount_sum.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                            En Dólares USD (Tasa BCV)
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Canales de Pedido</span>
                            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                                <Layers className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 space-y-0.5">
                            <div className="flex justify-between">
                                <span className="text-slate-400">WhatsApp:</span>
                                <span>{stats.channel_stats?.whatsapp || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Carrito Web:</span>
                                <span>{stats.channel_stats?.web_cart || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Manual / Planta:</span>
                                <span>{stats.channel_stats?.manual || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs de Navegación de la Tienda Virtual */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 text-sm font-bold gap-2">
                    <button
                        onClick={() => setActiveTab('quotes')}
                        className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
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
                        className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'inventory'
                                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Package className="h-4 w-4" />
                        <span>Inventario & Stock de Tienda ({allProducts.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('funnel')}
                        className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
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
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                            <div className="w-full md:w-80 relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por N° COT, cliente, teléfono..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                                >
                                    <option value="Todos">Todos los Estados</option>
                                    <option value="Pendiente">Pendientes</option>
                                    <option value="Contactado">Contactados</option>
                                    <option value="Despachado">Despachados</option>
                                    <option value="Cancelado">Cancelados</option>
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                                >
                                    <option value="Todos">Todos los Clientes</option>
                                    <option value="Paciente">Pacientes</option>
                                    <option value="Farmacia">Farmacias</option>
                                    <option value="Clínica">Clínicas / Médicos</option>
                                    <option value="Distribuidor">Distribuidores</option>
                                </select>

                                <select
                                    value={channelFilter}
                                    onChange={(e) => setChannelFilter(e.target.value)}
                                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                                >
                                    <option value="Todos">Todos los Canales</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="web_cart">Carrito Web</option>
                                    <option value="manual">Manual / Planta</option>
                                </select>

                                <button
                                    onClick={handleApplyFilters}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                                >
                                    Filtrar
                                </button>

                                {(searchTerm || statusFilter !== 'Todos' || typeFilter !== 'Todos' || channelFilter !== 'Todos') && (
                                    <button
                                        onClick={handleResetFilters}
                                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla Principal de Cotizaciones */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="py-3.5 px-4">N° Cotización</th>
                                            <th className="py-3.5 px-4">Cliente / Contacto</th>
                                            <th className="py-3.5 px-4">Tipo & Canal</th>
                                            <th className="py-3.5 px-4">Fármacos Solicitados</th>
                                            <th className="py-3.5 px-4 text-right">Total ($)</th>
                                            <th className="py-3.5 px-4 text-center">Estado</th>
                                            <th className="py-3.5 px-4 text-center">Comprobante</th>
                                            <th className="py-3.5 px-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {quotes.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center text-slate-400">
                                                    No se encontraron cotizaciones con los criterios seleccionados.
                                                </td>
                                            </tr>
                                        ) : (
                                            quotes.data.map((q) => (
                                                <tr key={q.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                        {q.quote_number}
                                                        <div className="text-[10px] text-slate-400 font-sans font-normal">{q.created_at}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-slate-900 dark:text-white">{q.customer_name}</div>
                                                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                            {q.customer_contact ? (
                                                                <>
                                                                    <Phone className="h-3 w-3 text-emerald-500" />
                                                                    <span>{q.customer_contact}</span>
                                                                </>
                                                            ) : (
                                                                <span className="text-slate-400 italic">Sin teléfono</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#002072] dark:text-cyan-300 font-bold text-[10px] w-fit">
                                                                {q.customer_type}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 capitalize">
                                                                Vía {q.channel === 'whatsapp' ? 'WhatsApp' : q.channel === 'web_cart' ? 'Carrito Web' : 'Manual'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="space-y-0.5 max-w-xs">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {q.total_items} {q.total_items === 1 ? 'unidad' : 'unidades'} ({q.items?.length || 0} fármacos)
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 truncate">
                                                                {q.items?.map((it) => `${it.quantity}x ${it.product?.name || 'Fármaco'}`).join(', ')}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-black font-mono text-slate-900 dark:text-white whitespace-nowrap">
                                                        ${q.total_amount.toFixed(2)} USD
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                                                            q.status === 'Despachado'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : q.status === 'Contactado'
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                                : q.status === 'Cancelado'
                                                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                        }`}>
                                                            {q.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        {q.is_downloaded ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold" title={`Descargado: ${q.downloaded_at}`}>
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span>Descargado</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">No descargado</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {q.customer_contact && (
                                                                <button
                                                                    onClick={() => handleWhatsAppReply(q)}
                                                                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                                    title="Chatear con el cliente por WhatsApp"
                                                                >
                                                                    <MessageCircle className="h-4 w-4" />
                                                                </button>
                                                            )}

                                                            <a
                                                                href={`/admin/quotes/${q.id}/print`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 transition-colors"
                                                                title="Ver / Imprimir Comprobante Oficial"
                                                            >
                                                                <Printer className="h-4 w-4" />
                                                            </a>

                                                            <button
                                                                onClick={() => openEditModal(q)}
                                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                                                                title="Gestionar estado y notas"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteQuote(q.id)}
                                                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
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
                                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                    <span>Página {quotes.current_page} de {quotes.last_page}</span>
                                    <div className="flex gap-2">
                                        {quotes.current_page > 1 && (
                                            <Link
                                                href={`/admin/quotes?page=${quotes.current_page - 1}`}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200"
                                            >
                                                Anterior
                                            </Link>
                                        )}
                                        {quotes.current_page < quotes.last_page && (
                                            <Link
                                                href={`/admin/quotes?page=${quotes.current_page + 1}`}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200"
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
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-[#002072] dark:text-cyan-400" />
                                <div className="text-xs text-slate-700 dark:text-slate-300">
                                    <strong>Carga y Control de Unidades Disponibles:</strong> Modifica el stock de cualquier fármaco para la tienda virtual y presiona "Guardar" para sincronizar de inmediato.
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="py-3.5 px-4">Fármaco / Producto</th>
                                            <th className="py-3.5 px-4">Presentación</th>
                                            <th className="py-3.5 px-4 text-right">Precio ($ USD)</th>
                                            <th className="py-3.5 px-4 text-center">Demanda Acumulada</th>
                                            <th className="py-3.5 px-4 text-center">Estado de Stock</th>
                                            <th className="py-3.5 px-4 text-center">Unidades Disponibles</th>
                                            <th className="py-3.5 px-4 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {allProducts.map((p) => {
                                            const currentInput = stockInputs[p.id] ?? p.stock;
                                            const isLow = currentInput < 15;
                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                                                        <div className="text-[10px] text-slate-400">ID #{p.id}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                                        {p.presentation}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                                        ${p.price.toFixed(2)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                                                        {p.quote_inquiries_count} cotizaciones
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        {isLow ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                <span>Stock Bajo</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                                                Óptimo
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="50000"
                                                                value={currentInput}
                                                                onChange={(e) => setStockInputs((prev) => ({
                                                                    ...prev,
                                                                    [p.id]: parseInt(e.target.value) || 0,
                                                                }))}
                                                                className="w-24 px-2.5 py-1.5 text-center text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                                                            />
                                                            <span className="text-[11px] text-slate-400">uds</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <button
                                                            onClick={() => handleSaveStock(p.id)}
                                                            disabled={savingStockId === p.id}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                                        >
                                                            <Save className="h-3.5 w-3.5" />
                                                            <span>{savingStockId === p.id ? 'Guardando...' : 'Guardar'}</span>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Canales y Tipología de Cliente */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <Layers className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                    <span>Distribución por Canal de Origen</span>
                                </h3>

                                <div className="space-y-3">
                                    {[
                                        { label: 'WhatsApp Directo', count: stats.channel_stats?.whatsapp || 0, color: 'bg-emerald-500' },
                                        { label: 'Carrito Web (Telemetría)', count: stats.channel_stats?.web_cart || 0, color: 'bg-blue-500' },
                                        { label: 'Registro Manual en Planta', count: stats.channel_stats?.manual || 0, color: 'bg-purple-500' },
                                    ].map((c) => {
                                        const pct = stats.total_quotes > 0 ? ((c.count / stats.total_quotes) * 100).toFixed(1) : '0';
                                        return (
                                            <div key={c.label} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    <span>{c.label}</span>
                                                    <span>{c.count} ({pct}%)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <span>Segmentación por Tipo de Cliente</span>
                                </h3>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Farmacias Aliadas</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats?.Farmacia || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Clínicas / Doctores</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats?.Clínica || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Distribuidores B2B</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats?.Distribuidor || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Pacientes Particulares</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {stats.customer_type_stats?.Paciente || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Fármacos Demandados */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <BarChart2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Ranking de Fármacos Más Cotizados</span>
                            </h3>

                            <div className="space-y-3">
                                {topProducts.map((p, idx) => (
                                    <div key={p.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#002072] dark:text-cyan-400 font-black text-xs flex items-center justify-center">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">${p.price.toFixed(2)} USD • Stock: {p.stock} uds</div>
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
                <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="2xl">
                    {selectedQuote && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400">Gestión de Pedido / Cotización</div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-mono">
                                        {selectedQuote.quote_number}
                                    </h2>
                                </div>
                                <a
                                    href={`/admin/quotes/${selectedQuote.id}/print`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#002072] dark:text-cyan-400 text-xs font-bold hover:bg-blue-100 transition-all"
                                >
                                    <Printer className="h-3.5 w-3.5" />
                                    <span>Comprobante Oficial</span>
                                </a>
                            </div>

                            {/* Datos del Cliente */}
                            <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                                <div>
                                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Cliente</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{selectedQuote.customer_name}</span>
                                    <span className="text-[11px] text-slate-500 block">{selectedQuote.customer_contact || 'Sin teléfono'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Tipo & Canal</span>
                                    <span className="font-bold text-[#002072] dark:text-cyan-400">{selectedQuote.customer_type}</span>
                                    <span className="text-[11px] text-slate-500 block capitalize">Vía {selectedQuote.channel}</span>
                                </div>
                            </div>

                            {/* Detalle de Fármacos */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Fármacos Incluidos:</h4>
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
                                    {selectedQuote.items?.map((item) => (
                                        <div key={item.id} className="p-3 flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white">{item.product?.name || `Fármaco #${item.product_id}`}</span>
                                                <span className="text-slate-400 text-[11px] block">{item.product?.presentation}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.quantity} uds</span>
                                                <span className="text-[11px] text-slate-400 block font-mono">${(item.unit_price * item.quantity).toFixed(2)} USD</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between font-bold">
                                        <span>Total ({selectedQuote.total_items} unidades):</span>
                                        <span className="text-sm text-[#002072] dark:text-cyan-400 font-mono">${selectedQuote.total_amount.toFixed(2)} USD</span>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario de Actualización */}
                            <form onSubmit={handleUpdateQuote} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                        Estado de la Cotización:
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value as any)}
                                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                                    >
                                        <option value="Pendiente">Pendiente (Por atender)</option>
                                        <option value="Contactado">Contactado (En conversación)</option>
                                        <option value="Despachado">Despachado (Entregado / Pagado)</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                        Notas Administrativas y de Despacho:
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        placeholder="Ej: Número de guía de despacho, banco emisor de transferencia, farmacia receptora..."
                                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuote(selectedQuote.id)}
                                        className="text-xs text-rose-600 hover:underline font-bold"
                                    >
                                        Eliminar Cotización
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                                        >
                                            Cerrar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
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
                <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="2xl">
                    <form onSubmit={handleCreateManualQuote} className="p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Plus className="h-5 w-5 text-emerald-600" />
                                <span>Registrar Nueva Cotización Manual</span>
                            </h2>
                            <p className="text-xs text-slate-500">
                                Carga manual de pedidos recibidos por teléfono, visita en planta o convenio institucional.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Nombre o Razón Social *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Farmacia San José / Dr. Ramón Silva"
                                    value={manualForm.customer_name}
                                    onChange={(e) => setManualForm({ ...manualForm, customer_name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                />
                            </div>

                            <div>
                                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Teléfono o WhatsApp
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: 0414-1234567"
                                    value={manualForm.customer_contact}
                                    onChange={(e) => setManualForm({ ...manualForm, customer_contact: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                />
                            </div>

                            <div>
                                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Tipo de Cliente *
                                </label>
                                <select
                                    value={manualForm.customer_type}
                                    onChange={(e) => setManualForm({ ...manualForm, customer_type: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                                >
                                    <option value="Farmacia">Farmacia Aliada</option>
                                    <option value="Clínica">Clínica / Hospital / Médico</option>
                                    <option value="Distribuidor">Distribuidor B2B</option>
                                    <option value="Paciente">Paciente Particular</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Estado Inicial
                                </label>
                                <select
                                    value={manualForm.status}
                                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Contactado">Contactado</option>
                                    <option value="Despachado">Despachado</option>
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
                                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Agregar otro fármaco</span>
                                </button>
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {manualForm.items.map((item, idx) => (
                                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs">
                                        <select
                                            value={item.product_id}
                                            onChange={(e) => handleManualItemChange(idx, 'product_id', parseInt(e.target.value))}
                                            className="flex-1 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                                        >
                                            {allProducts.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.presentation}) - ${p.price.toFixed(2)} USD
                                                </option>
                                            ))}
                                        </select>

                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10000"
                                                value={item.quantity}
                                                onChange={(e) => handleManualItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                                                className="w-16 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold"
                                            />
                                            <span className="text-[11px] text-slate-400">uds</span>
                                        </div>

                                        {manualForm.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItemFromManual(idx)}
                                                className="p-1 text-slate-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                <span>Total Estimado ({manualForm.items.reduce((acc, it) => acc + it.quantity, 0)} unidades):</span>
                                <span className="text-sm font-mono">${manualEstimatedTotal.toFixed(2)} USD</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                Notas Comerciales:
                            </label>
                            <textarea
                                rows={2}
                                value={manualForm.admin_notes}
                                onChange={(e) => setManualForm({ ...manualForm, admin_notes: e.target.value })}
                                placeholder="Condiciones de pago, plazo, dirección de entrega..."
                                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-xl bg-[#002072] hover:bg-blue-800 text-white text-xs font-bold shadow-md cursor-pointer"
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
