import { Head, useForm, router } from '@inertiajs/react';
import { 
    Pill, Plus, Search, Filter, Edit3, Trash2, CheckCircle2, 
    XCircle, AlertCircle, Eye, EyeOff, ExternalLink, Image as ImageIcon,
    FileText, ShieldCheck, Sparkles, LayoutList, SlidersHorizontal, Upload
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';
import type { Product, ProductLine } from '@/types';

interface ProductsPageProps {
    products: (Product & { product_line?: ProductLine })[];
    productLines: ProductLine[];
    stockImages?: { label: string; url: string }[];
}

export default function AdminProducts({ products, productLines, stockImages = [] }: ProductsPageProps) {
    const [activeTab, setActiveTab] = useState<'table' | 'editor'>('table');
    const [selectedLine, setSelectedLine] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    
    // Producto seleccionado en el Editor Integral
    const [selectedEditorProduct, setSelectedEditorProduct] = useState<Product>(products[0] || null);

    // Formulario de creación rápida
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

    // Formulario de edición integral (usado tanto en el Editor como en el Modal)
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

    // Subida de imágenes desde la PC
    const editorFileInputRef = React.useRef<HTMLInputElement>(null);
    const createFileInputRef = React.useRef<HTMLInputElement>(null);
    const editModalFileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

    const handleUploadImage = async (file: File, onSuccess: (url: string) => void) => {
        setIsUploadingPhoto(true);
        setUploadSuccessMessage(null);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/admin/products/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.url) {
                onSuccess(data.url);
                setUploadSuccessMessage('¡Fotografía cargada exitosamente!');
                setTimeout(() => setUploadSuccessMessage(null), 4000);
            } else {
                alert(data.message || 'Error al subir la imagen. Verifica que sea un archivo JPG, PNG o WEBP de menos de 5MB.');
            }
        } catch {
            alert('Error de conexión al subir la imagen.');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    // Sincronizar formulario del Editor cuando cambia el producto seleccionado
    React.useEffect(() => {
        if (selectedEditorProduct) {
            editForm.setData({
                product_line_id: selectedEditorProduct.product_line_id,
                name: selectedEditorProduct.name,
                slug: selectedEditorProduct.slug,
                active_ingredients: selectedEditorProduct.active_ingredients,
                presentation: selectedEditorProduct.presentation,
                description: selectedEditorProduct.description || '',
                indications: selectedEditorProduct.indications || '',
                posology: selectedEditorProduct.posology || '',
                contraindications: selectedEditorProduct.contraindications || '',
                price: Number(selectedEditorProduct.price),
                stock: selectedEditorProduct.stock,
                is_prescription_required: Boolean(selectedEditorProduct.is_prescription_required),
                is_active: Boolean(selectedEditorProduct.is_active),
                image_path: selectedEditorProduct.image_path || '/assets/img/product_1.png',
            });
        }
    }, [selectedEditorProduct?.id]);

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

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setSelectedEditorProduct(product);
        editForm.setData({
            product_line_id: product.product_line_id,
            name: product.name,
            slug: product.slug,
            active_ingredients: product.active_ingredients,
            presentation: product.presentation,
            description: product.description || '',
            indications: product.indications || '',
            posology: product.posology || '',
            contraindications: product.contraindications || '',
            price: Number(product.price),
            stock: product.stock,
            is_prescription_required: Boolean(product.is_prescription_required),
            is_active: Boolean(product.is_active),
            image_path: product.image_path || '/assets/img/product_1.png',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const targetId = editingProduct ? editingProduct.id : selectedEditorProduct?.id;
        if (!targetId) return;

        editForm.put(`/admin/products/${targetId}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (editingProduct) {
                    setEditingProduct(null);
                }
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

            <div className="p-3 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1880px] mx-auto space-y-6">
                {/* Cabecera Principal */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#002072] dark:text-cyan-400">
                            <Pill className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Catálogo Farmacéutico & Fichas de Producto
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Control de fórmulas, fotografías, presentaciones, inventarios y fichas técnicas públicas de los 18 fármacos.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/20 cursor-pointer transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Nuevo Fármaco</span>
                        </button>
                    </div>
                </div>

                {/* Navegación por Pestañas de Vista */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('table')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            activeTab === 'table'
                                ? 'bg-[#002072] text-white dark:bg-blue-600 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        <LayoutList className="h-4 w-4" />
                        <span>Inventario & Tabla General ({products.length} Fármacos)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('editor')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            activeTab === 'editor'
                                ? 'bg-[#002072] text-white dark:bg-blue-600 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Editor de Fichas Médicas & Landing Page</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px]">En Vivo</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* VISTA 1: TABLA GENERAL DE INVENTARIO CON COLUMNAS SEPARADAS Y NOMBRES REALES */}
                {/* ========================================================================= */}
                {activeTab === 'table' && (
                    <div className="space-y-4">
                        {/* Filtros por Nombre Real de Línea y Buscador */}
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            {/* Botones con los NOMBRES REALES de las Líneas Oficiales */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                                <button
                                    type="button"
                                    onClick={() => setSelectedLine('all')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        selectedLine === 'all'
                                            ? 'bg-[#002072] text-white shadow dark:bg-blue-600'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                                                    ? 'bg-[#002072] text-white shadow dark:bg-blue-600'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {line.name} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Buscador Rápido */}
                            <div className="relative w-full lg:w-72 shrink-0">
                                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar fármaco, principio o presentación..."
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {/* Tabla de Catálogo con Columnas Separadas: Miniatura, Producto, Presentación, etc. */}
                        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            {/* VISTA ESCRITORIO (md:block): TABLA COMPLETA CON 10 COLUMNAS */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="py-3 px-3 w-14 text-center">Foto</th>
                                            <th className="py-3 px-4">Producto</th>
                                            <th className="py-3 px-4">Presentación</th>
                                            <th className="py-3 px-4">Línea Terapéutica</th>
                                            <th className="py-3 px-4">Principio Activo</th>
                                            <th className="py-3 px-4 text-right">Precio ($ USD)</th>
                                            <th className="py-3 px-4 text-center">Stock</th>
                                            <th className="py-3 px-4">Venta</th>
                                            <th className="py-3 px-4 text-center">Estado</th>
                                            <th className="py-3 px-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredProducts.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                {/* Miniatura Fotográfica */}
                                                <td className="py-2.5 px-3 text-center">
                                                    <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={p.image_path || '/assets/img/product_1.png'}
                                                            alt={p.name}
                                                            className="h-full w-full object-contain"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                             }}
                                                        />
                                                    </div>
                                                </td>

                                                {/* Columna: Producto (Nombre y Enlace a Ficha) */}
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                                                        {p.name}
                                                    </div>
                                                    <a
                                                        href={`/producto/${p.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
                                                    >
                                                        <span>/producto/{p.slug}</span>
                                                        <ExternalLink className="h-2.5 w-2.5" />
                                                    </a>
                                                </td>

                                                {/* Columna SEPARADA: Presentación */}
                                                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono border border-slate-200/60 dark:border-slate-700">
                                                        {p.presentation}
                                                    </span>
                                                </td>

                                                {/* Columna: Línea Terapéutica */}
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                        p.product_line_id === 1
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-cyan-300 border border-blue-200/80 dark:border-blue-900'
                                                            : p.product_line_id === 2
                                                            ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900'
                                                            : p.product_line_id === 3
                                                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900'
                                                            : 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900'
                                                    }`}>
                                                        {p.product_line?.name || `Línea #${p.product_line_id}`}
                                                    </span>
                                                </td>

                                                {/* Columna: Principio Activo */}
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                                    {p.active_ingredients}
                                                </td>

                                                {/* Columna: Precio */}
                                                <td className="py-3 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                                                    ${Number(p.price || 0).toFixed(2)}
                                                </td>

                                                {/* Columna: Stock */}
                                                <td className="py-3 px-4 text-center font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    <span className={`px-2 py-0.5 rounded-full ${p.stock < 15 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                        {p.stock} uds
                                                    </span>
                                                </td>

                                                {/* Condición de Venta */}
                                                <td className="py-3 px-4">
                                                    {p.is_prescription_required ? (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold border border-amber-200/60 dark:border-amber-900">
                                                            Bajo Récipe
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-900">
                                                            Venta Libre
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Estado Activo / Inactivo */}
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleActive(p)}
                                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                                            p.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}
                                                        title="Hacer clic para activar o desactivar del catálogo público"
                                                    >
                                                        {p.is_active ? '● Activo' : '○ Inactivo'}
                                                    </button>
                                                </td>

                                                {/* Acciones */}
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <a
                                                            href={`/producto/${p.slug}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Ver Ficha Médica Pública"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedEditorProduct(p);
                                                                setActiveTab('editor');
                                                            }}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#002072] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Abrir en Editor de Landing Page"
                                                        >
                                                            <SlidersHorizontal className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditModal(p)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Editar Ficha de Producto"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletingProduct(p)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Eliminar Fármaco"
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

                            {/* VISTA MÓVIL (md:hidden): TARJETAS TÁCTILES ESTILO APP PARA TELÉFONOS */}
                            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredProducts.map((p) => (
                                    <div key={p.id} className="p-3.5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 p-1.5 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={p.image_path || '/assets/img/product_1.png'}
                                                    alt={p.name}
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-1.5">
                                                    <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                                        {p.name}
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleActive(p)}
                                                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 transition-colors ${
                                                            p.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {p.is_active ? '● Activo' : '○ Inactivo'}
                                                    </button>
                                                </div>
                                                <p className="text-xs font-semibold text-blue-600 dark:text-cyan-400 truncate">
                                                    {p.presentation}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                                                    {p.active_ingredients}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#002072] dark:text-cyan-300">
                                                        {p.product_line?.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono">
                                                        Stock: {p.stock}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                                        ${Number(p.price || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botones Táctiles Móviles Cómodos (min-h 38px) */}
                                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditModal(p)}
                                                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 min-h-[38px]"
                                            >
                                                <Edit3 className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedEditorProduct(p);
                                                    setActiveTab('editor');
                                                }}
                                                className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-[#002072] dark:text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 min-h-[38px]"
                                            >
                                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                                <span>Editor</span>
                                            </button>
                                            <a
                                                href={`/producto/${p.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 min-h-[38px]"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>Ver</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* VISTA 2: EDITOR INTEGRAL DE FICHAS MÉDICAS & LANDING PAGE DEL PRODUCTO */}
                {/* ========================================================================= */}
                {activeTab === 'editor' && selectedEditorProduct && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Selector Lateral de Fármacos (Desktop) */}
                        <div className="hidden lg:block lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Seleccionar Fármaco ({products.length})
                                </h3>
                                <span className="text-[10px] text-slate-400 font-mono">18 Registrados</span>
                            </div>

                            <div className="max-h-[680px] overflow-y-auto space-y-1.5 pr-1">
                                {products.map((p) => {
                                    const isSelected = selectedEditorProduct.id === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setSelectedEditorProduct(p)}
                                            className={`w-full p-2.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#002072] text-white shadow-md dark:bg-blue-600'
                                                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 p-1 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={p.image_path || '/assets/img/product_1.png'}
                                                    alt={p.name}
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold truncate">{p.name}</div>
                                                <div className={`text-[10px] truncate ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                                    {p.presentation} • {p.product_line?.name}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Ficha de Edición Completa */}
                        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-6">
                            {/* Selector Rápido para Teléfono (Mobile Only) */}
                            <div className="block lg:hidden rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-3 shadow-xs">
                                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Cambiar Fármaco en Edición:
                                </label>
                                <select
                                    value={selectedEditorProduct.id}
                                    onChange={(e) => {
                                        const found = products.find((pr) => pr.id === Number(e.target.value));
                                        if (found) setSelectedEditorProduct(found);
                                    }}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    {products.map((pr) => (
                                        <option key={pr.id} value={pr.id}>
                                            {pr.name} ({pr.presentation})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Cabecera del Editor */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-cyan-400">
                                        Ficha Médica & Landing Page Oficial
                                    </span>
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                        {selectedEditorProduct.name}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/producto/${editForm.data.slug || selectedEditorProduct.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Previsualizar Landing</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                {/* SECCIÓN 1: FOTOGRAFÍA Y MINIATURAS DEL PRODUCTO */}
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                                        <ImageIcon className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                        <span>Fotografía del Fármaco & Miniaturas Disponibles</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-5">
                                        {/* Vista previa en vivo */}
                                        <div className="h-28 w-28 rounded-2xl bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                            <img
                                                src={editForm.data.image_path || '/assets/img/product_1.png'}
                                                alt="Preview"
                                                className="h-full w-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                }}
                                            />
                                        </div>

                                        {/* Selector de Fotografías del Laboratorio */}
                                        <div className="space-y-2 flex-1 w-full">
                                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                Seleccionar Imagen Oficial de Booz Laboratorio (Clic para aplicar):
                                            </label>
                                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                                {stockImages.map((img) => {
                                                    const isSelected = editForm.data.image_path === img.url;
                                                    return (
                                                        <button
                                                            key={img.url}
                                                            type="button"
                                                            onClick={() => editForm.setData('image_path', img.url)}
                                                            className={`h-12 rounded-xl p-1 border transition-all flex items-center justify-center cursor-pointer bg-white dark:bg-slate-800 ${
                                                                isSelected
                                                                    ? 'border-[#002072] dark:border-cyan-400 ring-2 ring-blue-500/20'
                                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                                            }`}
                                                            title={img.label}
                                                        >
                                                            <img src={img.url} alt={img.label} className="h-full w-full object-contain" />
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <input
                                                        type="file"
                                                        ref={editorFileInputRef}
                                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleUploadImage(file, (url) => editForm.setData('image_path', url));
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={isUploadingPhoto}
                                                        onClick={() => editorFileInputRef.current?.click()}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all disabled:opacity-50"
                                                    >
                                                        <Upload className="h-3.5 w-3.5" />
                                                        <span>{isUploadingPhoto ? 'Subiendo fotografía...' : '📁 Subir Foto desde tu PC'}</span>
                                                    </button>
                                                </div>

                                                {uploadSuccessMessage && (
                                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        {uploadSuccessMessage}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="pt-1">
                                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                    O ingresa la Ruta / URL de la Imagen:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.data.image_path}
                                                    onChange={(e) => editForm.setData('image_path', e.target.value)}
                                                    placeholder="/assets/img/product_1.png"
                                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-1.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2: IDENTIFICACIÓN & CLASIFICACIÓN COMERCIAL */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Nombre Comercial
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Presentación Oficial (Envase / Capacidad)
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.presentation}
                                            onChange={(e) => editForm.setData('presentation', e.target.value)}
                                            placeholder="Tubo colapsible 20g"
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Línea Terapéutica
                                        </label>
                                        <select
                                            value={editForm.data.product_line_id}
                                            onChange={(e) => editForm.setData('product_line_id', Number(e.target.value))}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        >
                                            {productLines.map((l) => (
                                                <option key={l.id} value={l.id}>
                                                    {l.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Principio Activo & Concentración
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.active_ingredients}
                                            onChange={(e) => editForm.setData('active_ingredients', e.target.value)}
                                            placeholder="Moxifloxacina 0.5%"
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Precio Unitario ($ USD)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={editForm.data.price}
                                            onChange={(e) => editForm.setData('price', Number(e.target.value))}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-mono font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Stock Disponible en Planta (Unidades)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={editForm.data.stock}
                                            onChange={(e) => editForm.setData('stock', Number(e.target.value))}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                {/* SECCIÓN 3: CONTENIDO CLÍNICO DE LA LANDING PAGE DEL PRODUCTO */}
                                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                        <span>Textos Clínicos de la Ficha Técnica (Landing Page Pública)</span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Descripción Clínica Destacada (Cuadro azul principal de la landing)
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={editForm.data.description}
                                            onChange={(e) => editForm.setData('description', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                Indicaciones Terapéuticas
                                            </label>
                                            <textarea
                                                rows={4}
                                                required
                                                value={editForm.data.indications}
                                                onChange={(e) => editForm.setData('indications', e.target.value)}
                                                placeholder="Tratamiento de infecciones bacterianas dérmicas..."
                                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                Posología y Modo de Empleo
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={editForm.data.posology}
                                                onChange={(e) => editForm.setData('posology', e.target.value)}
                                                placeholder="Aplicar una capa fina sobre el área afectada cada 12 horas..."
                                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                            Advertencias, Precauciones y Contraindicaciones (Recuadro sanitario ámbar)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={editForm.data.contraindications}
                                            onChange={(e) => editForm.setData('contraindications', e.target.value)}
                                            placeholder="Hipersensibilidad a los componentes. Evitar contacto con mucosas oculares..."
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {/* SECCIÓN 4: CONDICIONES REGULATORIAS & BOTÓN GUARDAR */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={editForm.data.is_prescription_required}
                                                onChange={(e) => editForm.setData('is_prescription_required', e.target.checked)}
                                                className="rounded text-blue-600 h-4 w-4 cursor-pointer"
                                            />
                                            <span>Requiere Récipe Médico</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={editForm.data.is_active}
                                                onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                                className="rounded text-blue-600 h-4 w-4 cursor-pointer"
                                            />
                                            <span>Publicar en Landing Page</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#002072] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/20 cursor-pointer transition-all disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>{editForm.processing ? 'Guardando Ficha...' : 'Guardar y Publicar Ficha Médica'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* MODAL CREAR NUEVO FÁRMACO */}
                {/* ========================================================================= */}
                <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Registrar Nuevo Fármaco">
                    <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre Comercial</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="Ej: Calamicis Dermo"
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
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Principio Activo</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.active_ingredients}
                                    onChange={(e) => createForm.setData('active_ingredients', e.target.value)}
                                    placeholder="Ej: Calamina 8% + Óxido de Zinc"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Presentación Oficial</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.presentation}
                                    onChange={(e) => createForm.setData('presentation', e.target.value)}
                                    placeholder="Ej: Frasco 200ml"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Precio Unitario ($ USD)</label>
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

                        {/* Miniaturas y Foto */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={createForm.data.image_path || '/assets/img/product_1.png'}
                                    alt="Preview"
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                    }}
                                />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                        Fotografía del Producto:
                                    </label>
                                    <div>
                                        <input
                                            type="file"
                                            ref={createFileInputRef}
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleUploadImage(file, (url) => createForm.setData('image_path', url));
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            disabled={isUploadingPhoto}
                                            onClick={() => createFileInputRef.current?.click()}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs cursor-pointer disabled:opacity-50"
                                        >
                                            <Upload className="h-3 w-3" />
                                            <span>{isUploadingPhoto ? 'Subiendo...' : 'Subir desde PC'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {stockImages.map((img) => (
                                        <button
                                            key={img.url}
                                            type="button"
                                            onClick={() => createForm.setData('image_path', img.url)}
                                            className={`h-7 w-7 rounded-lg p-0.5 border cursor-pointer ${
                                                createForm.data.image_path === img.url ? 'border-blue-600 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                        >
                                            <img src={img.url} alt={img.label} className="h-full w-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Descripción Clínica</label>
                            <textarea
                                rows={2}
                                required
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Indicaciones Terapéuticas</label>
                            <textarea
                                rows={2}
                                required
                                value={createForm.data.indications}
                                onChange={(e) => createForm.setData('indications', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>

                        <div className="pt-2 flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={createForm.data.is_prescription_required}
                                    onChange={(e) => createForm.setData('is_prescription_required', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Requiere Récipe Médico</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Publicar en Landing Page</span>
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

                {/* ========================================================================= */}
                {/* MODAL EDITAR FÁRMACO COMPLETO */}
                {/* ========================================================================= */}
                {editingProduct && (
                    <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title={`Editar Ficha: ${editingProduct.name}`}>
                        <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                            {/* Miniaturas y Foto */}
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={editForm.data.image_path || '/assets/img/product_1.png'}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                        }}
                                    />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                            Seleccionar Miniatura:
                                        </label>
                                        <div>
                                            <input
                                                type="file"
                                                ref={editModalFileInputRef}
                                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleUploadImage(file, (url) => editForm.setData('image_path', url));
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                disabled={isUploadingPhoto}
                                                onClick={() => editModalFileInputRef.current?.click()}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs cursor-pointer disabled:opacity-50"
                                            >
                                                <Upload className="h-3 w-3" />
                                                <span>{isUploadingPhoto ? 'Subiendo...' : 'Subir desde PC'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {stockImages.map((img) => (
                                            <button
                                                key={img.url}
                                                type="button"
                                                onClick={() => editForm.setData('image_path', img.url)}
                                                className={`h-8 w-8 rounded-lg p-0.5 border cursor-pointer ${
                                                    editForm.data.image_path === img.url ? 'border-blue-600 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                <img src={img.url} alt={img.label} className="h-full w-full object-contain" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

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
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Presentación Oficial (Envase / Capacidad)</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.presentation}
                                        onChange={(e) => editForm.setData('presentation', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Precio Unitario ($ USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Stock en Planta (Unidades)</label>
                                    <input
                                        type="number"
                                        required
                                        value={editForm.data.stock}
                                        onChange={(e) => editForm.setData('stock', Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Descripción Clínica de la Landing Page</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Indicaciones Terapéuticas</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={editForm.data.indications}
                                        onChange={(e) => editForm.setData('indications', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Posología y Modo de Empleo</label>
                                    <textarea
                                        rows={3}
                                        value={editForm.data.posology}
                                        onChange={(e) => editForm.setData('posology', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Advertencias y Contraindicaciones</label>
                                <textarea
                                    rows={2}
                                    value={editForm.data.contraindications}
                                    onChange={(e) => editForm.setData('contraindications', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                />
                            </div>

                            <div className="pt-2 flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_prescription_required}
                                        onChange={(e) => editForm.setData('is_prescription_required', e.target.checked)}
                                        className="rounded text-blue-600 h-4 w-4"
                                    />
                                    <span>Requiere Récipe Médico</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                        className="rounded text-blue-600 h-4 w-4"
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
                                    Actualizar Ficha Completa
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* ========================================================================= */}
                {/* MODAL CONFIRMAR ELIMINACIÓN */}
                {/* ========================================================================= */}
                {deletingProduct && (
                    <Modal isOpen={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Confirmar Eliminación">
                        <div className="space-y-4">
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar <strong>{deletingProduct.name}</strong> ({deletingProduct.presentation}) del catálogo oficial de Booz Laboratorio?
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
                                    Eliminar Fármaco
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </AppLayout>
    );
}
