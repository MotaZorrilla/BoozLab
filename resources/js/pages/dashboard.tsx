import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import type { Product, ProductLine, PharmacovigilanceReport, Faq, Testimonial } from '@/types';
import { 
    Package, ShieldAlert, Plus, Edit2, Trash2, CheckCircle2, 
    XCircle, Eye, RefreshCw, Search, ArrowUpRight, Filter, AlertTriangle 
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import Modal from '@/components/modal';

interface DashboardProps {
    stats: {
        total_products: number;
        active_products: number;
        pending_reports: number;
        total_reports: number;
        total_lines: number;
    };
    products: Product[];
    productLines: ProductLine[];
    reports: PharmacovigilanceReport[];
    faqs: Faq[];
    testimonials: Testimonial[];
}

export default function Dashboard({
    stats = { total_products: 0, active_products: 0, pending_reports: 0, total_reports: 0, total_lines: 0 },
    products = [],
    productLines = [],
    reports = [],
    faqs = [],
    testimonials = [],
}: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'products' | 'reports' | 'faqs'>('products');
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedLineFilter, setSelectedLineFilter] = useState<number | null>(null);

    // Modal state for Product Create / Edit
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState({
        name: '',
        slug: '',
        product_line_id: 1,
        active_ingredients: '',
        presentation: 'Tubo colapsible 20g',
        description: '',
        indications: '',
        posology: '',
        contraindications: '',
        price: 0,
        stock: 50,
        is_prescription_required: false,
        is_active: true,
        image_path: '/assets/img/product_1.png',
    });

    // Modal state for Pharmacovigilance Report Inspection
    const [selectedReport, setSelectedReport] = useState<PharmacovigilanceReport | null>(null);
    const [reportStatus, setReportStatus] = useState<'Pendiente' | 'En Revisión' | 'Resuelto'>('Pendiente');
    const [adminNotes, setAdminNotes] = useState('');

    const openCreateModal = () => {
        setEditingProduct(null);
        setProductForm({
            name: '',
            slug: '',
            product_line_id: productLines[0]?.id || 1,
            active_ingredients: '',
            presentation: 'Tubo colapsible 20g',
            description: '',
            indications: '',
            posology: '',
            contraindications: '',
            price: 0,
            stock: 50,
            is_prescription_required: false,
            is_active: true,
            image_path: '/assets/img/product_1.png',
        });
        setIsProductModalOpen(true);
    };

    const openEditModal = (p: Product) => {
        setEditingProduct(p);
        setProductForm({
            name: p.name,
            slug: p.slug,
            product_line_id: p.product_line_id,
            active_ingredients: p.active_ingredients,
            presentation: p.presentation,
            description: p.description,
            indications: p.indications,
            posology: p.posology || '',
            contraindications: p.contraindications || '',
            price: Number(p.price),
            stock: p.stock,
            is_prescription_required: p.is_prescription_required,
            is_active: p.is_active,
            image_path: p.image_path,
        });
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.put(`/admin/products/${editingProduct.id}`, productForm, {
                onSuccess: () => setIsProductModalOpen(false),
            });
        } else {
            router.post('/admin/products', productForm, {
                onSuccess: () => setIsProductModalOpen(false),
            });
        }
    };

    const handleToggleActive = (p: Product) => {
        router.post(`/admin/products/${p.id}/toggle`);
    };

    const handleDeleteProduct = (p: Product) => {
        if (confirm(`¿Estás seguro de eliminar el producto "${p.name}" del catálogo?`)) {
            router.delete(`/admin/products/${p.id}`);
        }
    };

    const handleUpdateReportStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReport) return;

        router.put(`/admin/reports/${selectedReport.id}/status`, {
            status: reportStatus,
            admin_notes: adminNotes,
        }, {
            onSuccess: () => setSelectedReport(null),
        });
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesLine = selectedLineFilter === null || p.product_line_id === selectedLineFilter;
            const matchesQuery = searchFilter === '' || 
                p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                p.active_ingredients.toLowerCase().includes(searchFilter.toLowerCase());
            return matchesLine && matchesQuery;
        });
    }, [products, searchFilter, selectedLineFilter]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }]}>
            <Head title="Panel Administrativo | Booz Laboratorio" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Consola de Administración Farmacéutica
                        </h1>
                        <p className="text-xs text-slate-500">
                            Gestión integral de catálogo, vademécum en tiempo real y recepción de farmacovigilancia INH.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        >
                            <span>Ver Portal Público</span>
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-900/20 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Nuevo Producto</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Productos</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total_products}</h3>
                            <span className="text-[10px] text-emerald-600 font-bold">{stats.active_products} activos en web</span>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Líneas Oficiales</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total_lines}</h3>
                            <span className="text-[10px] text-slate-500 font-medium">Clasificación terapéutica</span>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center">
                            <Filter className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between bg-gradient-to-r from-white to-amber-50/20">
                        <div>
                            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Farmacovigilancia</span>
                            <h3 className="text-2xl font-black text-amber-900 mt-1">{stats.pending_reports}</h3>
                            <span className="text-[10px] text-amber-700 font-bold">Reportes pendientes INH</span>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Notificaciones</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total_reports}</h3>
                            <span className="text-[10px] text-slate-500 font-medium">Histórico acumulado</span>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-200 text-sm font-bold">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'products'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Package className="h-4 w-4" />
                        <span>Gestión de Catálogo ({products.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'reports'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span>Bandeja de Farmacovigilancia ({reports.length})</span>
                    </button>
                </div>

                {/* TAB 1: GESTIÓN DE PRODUCTOS */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        {/* Filters Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    placeholder="Buscar producto por nombre o principio activo..."
                                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={selectedLineFilter ?? ''}
                                    onChange={(e) => setSelectedLineFilter(e.target.value ? Number(e.target.value) : null)}
                                    className="rounded-xl border-slate-200 text-xs py-1.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value="">Todas las líneas</option>
                                    {productLines.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">Producto</th>
                                        <th className="py-3 px-4">Línea</th>
                                        <th className="py-3 px-4">Principio Activo</th>
                                        <th className="py-3 px-4">Presentación</th>
                                        <th className="py-3 px-4">Estado</th>
                                        <th className="py-3 px-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredProducts.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={prod.image_path}
                                                        alt={prod.name}
                                                        className="h-10 w-10 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100 flex-shrink-0"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                        }}
                                                    />
                                                    <div>
                                                        <a
                                                            href={`/producto/${prod.slug}`}
                                                            target="_blank"
                                                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                                                        >
                                                            {prod.name}
                                                        </a>
                                                        <span className="block text-[10px] text-slate-400">/{prod.slug}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                                    {prod.product_line?.name || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-700 max-w-[200px] truncate">
                                                {prod.active_ingredients}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500">{prod.presentation}</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleToggleActive(prod)}
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                                        prod.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                                    }`}
                                                    title="Clic para alternar estado"
                                                >
                                                    {prod.is_active ? '● Activo' : '○ Inactivo'}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(prod)}
                                                        className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                                                        title="Editar producto"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(prod)}
                                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: BANDEJA DE FARMACOVIGILANCIA (EXIGENCIA SANITARIA INH) */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Ticket</th>
                                    <th className="py-3 px-4">Producto</th>
                                    <th className="py-3 px-4">Lote</th>
                                    <th className="py-3 px-4">Severidad</th>
                                    <th className="py-3 px-4">Reportante</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-slate-400">
                                            No hay reportes de farmacovigilancia pendientes.
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((rep) => (
                                        <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4 font-mono font-bold text-blue-900">{rep.ticket_number}</td>
                                            <td className="py-3 px-4 font-bold text-slate-900">{rep.product_name}</td>
                                            <td className="py-3 px-4 text-slate-500">{rep.batch_number || 'N/A'}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        rep.severity === 'Grave'
                                                            ? 'bg-red-100 text-red-700'
                                                            : rep.severity === 'Moderada'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-emerald-100 text-emerald-700'
                                                    }`}
                                                >
                                                    {rep.severity}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                <span className="font-semibold block">{rep.reporter_name}</span>
                                                <span className="text-[10px] text-slate-400">{rep.reporter_type} • {rep.reporter_contact}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        rep.status === 'Pendiente'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : rep.status === 'En Revisión'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}
                                                >
                                                    {rep.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedReport(rep);
                                                        setReportStatus(rep.status);
                                                        setAdminNotes(rep.admin_notes || '');
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 transition-colors"
                                                >
                                                    Revisar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ========================================================
                MODAL DE CREACIÓN / EDICIÓN DE PRODUCTOS (CRUD)
            ======================================================== */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                title={editingProduct ? `Editar Producto: ${editingProduct.name}` : 'Crear Nuevo Medicamento / Producto'}
            >
                <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial *</label>
                            <input
                                type="text"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                placeholder="Ej. Bactrocis Crema"
                                required
                                className="w-full rounded-xl border-slate-200 text-xs py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Línea Terapéutica *</label>
                            <select
                                value={productForm.product_line_id}
                                onChange={(e) => setProductForm({ ...productForm, product_line_id: Number(e.target.value) })}
                                className="w-full rounded-xl border-slate-200 text-xs py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                            >
                                {productLines.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Principio Activo Cuali-Cuantitativo *</label>
                            <input
                                type="text"
                                value={productForm.active_ingredients}
                                onChange={(e) => setProductForm({ ...productForm, active_ingredients: e.target.value })}
                                placeholder="Ej. Moxifloxacina 0.5%"
                                required
                                className="w-full rounded-xl border-slate-200 text-xs py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Presentación Oficial *</label>
                            <input
                                type="text"
                                value={productForm.presentation}
                                onChange={(e) => setProductForm({ ...productForm, presentation: e.target.value })}
                                placeholder="Ej. Tubo colapsible 20g"
                                required
                                className="w-full rounded-xl border-slate-200 text-xs py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Descripción Breve *</label>
                        <textarea
                            rows={2}
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Resumen del producto y acción farmacológica..."
                            required
                            className="w-full rounded-xl border-slate-200 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Indicaciones Terapéuticas *</label>
                        <textarea
                            rows={3}
                            value={productForm.indications}
                            onChange={(e) => setProductForm({ ...productForm, indications: e.target.value })}
                            placeholder="Patologías, afecciones y usos clínicos aprobados..."
                            required
                            className="w-full rounded-xl border-slate-200 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Posología / Modo de Empleo</label>
                            <textarea
                                rows={2}
                                value={productForm.posology}
                                onChange={(e) => setProductForm({ ...productForm, posology: e.target.value })}
                                placeholder="Dosis recomendada y frecuencia..."
                                className="w-full rounded-xl border-slate-200 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Contraindicaciones / Advertencias</label>
                            <textarea
                                rows={2}
                                value={productForm.contraindications}
                                onChange={(e) => setProductForm({ ...productForm, contraindications: e.target.value })}
                                placeholder="Hipersensibilidad, precauciones..."
                                className="w-full rounded-xl border-slate-200 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Ruta de Imagen</label>
                            <input
                                type="text"
                                value={productForm.image_path}
                                onChange={(e) => setProductForm({ ...productForm, image_path: e.target.value })}
                                className="w-full rounded-xl border-slate-200 text-xs py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={productForm.is_prescription_required}
                                    onChange={(e) => setProductForm({ ...productForm, is_prescription_required: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 h-4 w-4"
                                />
                                <span>Requiere Récipe Médico</span>
                            </label>
                        </div>

                        <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={productForm.is_active}
                                    onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 h-4 w-4"
                                />
                                <span>Activo en Catálogo Web</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsProductModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-900/20"
                        >
                            {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ========================================================
                MODAL DE REVISIÓN DE REPORTE DE FARMACOVIGILANCIA
            ======================================================== */}
            {selectedReport && (
                <Modal
                    isOpen={!!selectedReport}
                    onClose={() => setSelectedReport(null)}
                    title={`Reporte de Farmacovigilancia: ${selectedReport.ticket_number}`}
                >
                    <form onSubmit={handleUpdateReportStatus} className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                            <div className="flex justify-between font-bold">
                                <span>Producto: {selectedReport.product_name}</span>
                                <span>Lote: {selectedReport.batch_number || 'No especificado'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Reportante:</span> {selectedReport.reporter_name} ({selectedReport.reporter_type}) • {selectedReport.reporter_contact}
                            </div>
                            <div>
                                <span className="text-slate-400">Severidad:</span> <strong className="text-red-700">{selectedReport.severity}</strong>
                            </div>
                            <div className="pt-2 border-t border-slate-200">
                                <span className="font-bold text-slate-700 block mb-1">Descripción del Evento Adverso:</span>
                                <p className="text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                                    {selectedReport.adverse_reaction}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="block text-xs font-bold text-slate-700">Cambiar Estado del Reporte:</label>
                            <div className="flex gap-3">
                                {['Pendiente', 'En Revisión', 'Resuelto'].map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setReportStatus(st as any)}
                                        className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                                            reportStatus === st
                                                ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>

                            <label className="block text-xs font-bold text-slate-700 pt-2">Notas Administrativas / Dictamen:</label>
                            <textarea
                                rows={3}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Registrar acciones correctivas, lote verificado o comunicación con el notificante..."
                                className="w-full rounded-xl border-slate-200 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setSelectedReport(null)}
                                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                            >
                                Cerrar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                            >
                                Actualizar Estado
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AppLayout>
    );
}
