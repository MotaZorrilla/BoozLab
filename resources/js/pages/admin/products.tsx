import { Head, useForm, router } from '@inertiajs/react';
import { Pill, Plus, Search, Filter, Edit3, Trash2, CheckCircle2, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';
import type { Product, ProductLine } from '@/types';

interface ProductsPageProps {
    products: (Product & { product_line?: ProductLine })[];
    productLines: ProductLine[];
}

export default function AdminProducts({ products, productLines }: ProductsPageProps) {
    const [selectedLine, setSelectedLine] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    // Formulario de creación
    const createForm = useForm({
        product_line_id: productLines[0]?.id || 1,
        name: '',
        slug: '',
        active_ingredients: '',
        presentation: '',
        description: '',
        indications: '',
        posology: '',
        contraindications: '',
        price: 0,
        stock: 100,
        is_prescription_required: false,
        is_active: true,
        image_path: '/assets/img/product_1.png',
    });

    // Formulario de edición
    const editForm = useForm({
        product_line_id: 1,
        name: '',
        slug: '',
        active_ingredients: '',
        presentation: '',
        description: '',
        indications: '',
        posology: '',
        contraindications: '',
        price: 0,
        stock: 100,
        is_prescription_required: false,
        is_active: true,
        image_path: '',
    });

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesLine = selectedLine === 'all' || p.product_line_id === selectedLine;
            const matchesSearch =
                !searchQuery ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.active_ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.presentation.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLine && matchesSearch;
        });
    }, [products, selectedLine, searchQuery]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/products', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (product: Product) => {
        setEditingProduct(product);
        editForm.setData({
            product_line_id: product.product_line_id,
            name: product.name,
            slug: product.slug,
            active_ingredients: product.active_ingredients,
            presentation: product.presentation,
            description: product.description,
            indications: product.indications,
            posology: product.posology || '',
            contraindications: product.contraindications || '',
            price: Number(product.price),
            stock: product.stock,
            is_prescription_required: Boolean(product.is_prescription_required),
            is_active: Boolean(product.is_active),
            image_path: product.image_path || '',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        editForm.put(`/admin/products/${editingProduct.id}`, {
            onSuccess: () => {
                setEditingProduct(null);
                editForm.reset();
            },
        });
    };

    const handleToggleActive = (product: Product) => {
        router.post(`/admin/products/${product.id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDeleteConfirm = () => {
        if (!deletingProduct) return;
        router.delete(`/admin/products/${deletingProduct.id}`, {
            onSuccess: () => setDeletingProduct(null),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Catálogo Farmacéutico', href: '/admin/products' }]}>
            <Head title="Gestión de Catálogo Farmacéutico | Booz Laboratorio" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#002072] dark:text-cyan-400">
                            <Pill className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Catálogo Farmacéutico & Vademécum
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de los 18 productos registrados, especificaciones del INH, precios y estatus de venta.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/20 cursor-pointer transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Agregar Fármaco</span>
                    </button>
                </div>

                {/* Filtros y Buscador */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {/* Selector de Línea Terapéutica */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        <button
                            type="button"
                            onClick={() => setSelectedLine('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedLine === 'all'
                                    ? 'bg-[#002072] text-white shadow'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            Todas las Líneas ({products.length})
                        </button>
                        {productLines.map((line) => {
                            const count = products.filter((p) => p.product_line_id === line.id).length;
                            return (
                                <button
                                    key={line.id}
                                    type="button"
                                    onClick={() => setSelectedLine(line.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        selectedLine === line.id
                                            ? 'bg-[#002072] text-white shadow'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                    }`}
                                >
                                    Línea {line.code} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Buscador Rápido */}
                    <div className="relative w-full sm:w-64">
                        <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar fármaco o principio..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>

                {/* Tabla de Catálogo */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">Producto & Presentación</th>
                                    <th className="py-3 px-4">Línea Terapéutica</th>
                                    <th className="py-3 px-4">Principio Activo</th>
                                    <th className="py-3 px-4">Precio (USD)</th>
                                    <th className="py-3 px-4">Stock</th>
                                    <th className="py-3 px-4">Condición de Venta</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span>{p.name}</span>
                                                <span className="text-[11px] text-slate-400 font-normal">({p.presentation})</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400">
                                                {p.product_line?.name || `Línea #${p.product_line_id}`}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                            {p.active_ingredients}
                                        </td>
                                        <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">
                                            ${Number(p.price).toFixed(2)}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                                            {p.stock} uds
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {p.is_prescription_required ? (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold">
                                                    Bajo Récipe
                                                </span>
                                            ) : (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                                                    Venta Libre
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleActive(p)}
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                                    p.is_active
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}
                                            >
                                                {p.is_active ? '● Activo' : '○ Inactivo'}
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditOpen(p)}
                                                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                                title="Editar Fármaco"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingProduct(p)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer transition-colors"
                                                title="Eliminar Fármaco"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL CREAR */}
                <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Agregar Fármaco al Catálogo">
                    <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre Comercial</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="Ej. Bactrocis Crema"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Línea Terapéutica</label>
                                <select
                                    value={createForm.data.product_line_id}
                                    onChange={(e) => createForm.setData('product_line_id', Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    {productLines.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Principio Activo & Concentración</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.active_ingredients}
                                    onChange={(e) => createForm.setData('active_ingredients', e.target.value)}
                                    placeholder="Ej. Moxifloxacina 0.5%"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Presentación Comercial</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.presentation}
                                    onChange={(e) => createForm.setData('presentation', e.target.value)}
                                    placeholder="Ej. Tubo de 30g"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Indicaciones Clínicas</label>
                            <textarea
                                rows={2}
                                required
                                value={createForm.data.indications}
                                onChange={(e) => createForm.setData('indications', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Precio Unitario (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={createForm.data.price}
                                    onChange={(e) => createForm.setData('price', Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Stock Disponible</label>
                                <input
                                    type="number"
                                    required
                                    value={createForm.data.stock}
                                    onChange={(e) => createForm.setData('stock', Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer text-xs">
                                <input
                                    type="checkbox"
                                    checked={createForm.data.is_prescription_required}
                                    onChange={(e) => createForm.setData('is_prescription_required', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Requiere Récipe Médico</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs">
                                <input
                                    type="checkbox"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Publicar Inmediatamente</span>
                            </label>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-6 py-2 rounded-xl bg-[#002072] text-white text-xs font-bold shadow hover:bg-blue-800"
                            >
                                Guardar Fármaco
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* MODAL EDITAR */}
                {editingProduct && (
                    <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title={`Editar: ${editingProduct.name}`}>
                        <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre Comercial</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Línea Terapéutica</label>
                                    <select
                                        value={editForm.data.product_line_id}
                                        onChange={(e) => editForm.setData('product_line_id', Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                    >
                                        {productLines.map((l) => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Principio Activo</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.active_ingredients}
                                        onChange={(e) => editForm.setData('active_ingredients', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Presentación Comercial</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.presentation}
                                        onChange={(e) => editForm.setData('presentation', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Precio Unitario (USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Stock Disponible</label>
                                    <input
                                        type="number"
                                        required
                                        value={editForm.data.stock}
                                        onChange={(e) => editForm.setData('stock', Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_prescription_required}
                                        onChange={(e) => editForm.setData('is_prescription_required', e.target.checked)}
                                        className="rounded text-blue-600"
                                    />
                                    <span>Requiere Récipe Médico</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                        className="rounded text-blue-600"
                                    />
                                    <span>Activo en Catálogo</span>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-6 py-2 rounded-xl bg-[#002072] text-white text-xs font-bold shadow hover:bg-blue-800"
                                >
                                    Actualizar Fármaco
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* MODAL ELIMINAR */}
                {deletingProduct && (
                    <Modal isOpen={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Confirmar Eliminación">
                        <div className="space-y-4">
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar <strong>{deletingProduct.name}</strong> del catálogo de Booz Laboratorio?
                            </p>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setDeletingProduct(null)}
                                    className="px-4 py-2 rounded-xl text-slate-500 text-xs font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteConfirm}
                                    className="px-6 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow hover:bg-red-700"
                                >
                                    Eliminar del Catálogo
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </AppLayout>
    );
}
