import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, MessageCircle, ArrowRight, PackageCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Product } from '@/types';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface StoreCartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (productId: number, delta: number) => void;
    onRemoveItem: (productId: number) => void;
    onClearCart: () => void;
}

export default function StoreCartDrawer({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
}: StoreCartDrawerProps) {
    if (!isOpen) return null;

    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

    const generateWhatsAppOrderUrl = () => {
        let text = `*HOLA BOOZ LABORATORIO* 🔬\n`;
        text += `Deseo consultar disponibilidad y cotización para el siguiente pedido:\n\n`;

        items.forEach((item, index) => {
            text += `${index + 1}. *${item.product.name}* (${item.product.presentation})\n`;
            text += `   - Cantidad: *${item.quantity} unidades*\n`;
            text += `   - Principio: ${item.product.active_ingredients}\n`;
            if (item.product.is_prescription_required) {
                text += `   - [Nota: Bajo Récipe Médico]\n`;
            }
            text += `\n`;
        });

        text += `_Por favor confirmar disponibilidad en planta / droguería y tiempos de entrega._`;
        return `https://wa.me/584148873615?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-[#002072]/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white dark:bg-[#0A1124] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors duration-300">
                    {/* Drawer Header */}
                    <div className="px-6 py-5 bg-[#002072] text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-cyan-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base leading-tight">Tienda & Pedidos Booz</h3>
                                <p className="text-[11px] text-blue-200">
                                    {totalUnits} {totalUnits === 1 ? 'unidad seleccionada' : 'unidades seleccionadas'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Drawer Body: Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                                    <ShoppingBag className="h-8 w-8" />
                                </div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">
                                    Tu bolsa de pedidos está vacía
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                                    Explora nuestro catálogo oficial y añade los productos que deseas cotizar o solicitar.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl bg-[#002072] text-white text-xs font-bold hover:bg-blue-800 transition-colors cursor-pointer"
                                >
                                    Ver Catálogo Farmacéutico
                                </button>
                            </div>
                        ) : (
                            items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0D172E] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 transition-colors"
                                >
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="h-16 w-16 object-contain rounded-xl bg-white dark:bg-slate-800 p-1 flex-shrink-0 border border-slate-100 dark:border-slate-700"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                {product.name}
                                            </h4>
                                            <button
                                                onClick={() => onRemoveItem(product.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                title="Eliminar de la bolsa"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-blue-600 dark:text-cyan-400 font-semibold truncate">
                                            {product.presentation}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[9px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 font-medium border border-slate-200 dark:border-slate-700">
                                                {product.product_line?.name || 'Línea Booz'}
                                            </span>
                                            {/* Quantity Selector */}
                                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-1.5 py-0.5">
                                                <button
                                                    onClick={() => onUpdateQuantity(product.id, -1)}
                                                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-bold px-1.5 text-slate-900 dark:text-white">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(product.id, 1)}
                                                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Drawer Footer: Actions */}
                    {items.length > 0 && (
                        <div className="p-6 bg-slate-50 dark:bg-[#0D172E] border-t border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Total de productos:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{items.length} ({totalUnits} unidades)</span>
                            </div>

                            <a
                                href={generateWhatsAppOrderUrl()}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>Solicitar Pedido por WhatsApp</span>
                            </a>

                            <div className="flex items-center justify-between pt-1">
                                <button
                                    onClick={onClearCart}
                                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Vaciar bolsa
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                                >
                                    Continuar explorando
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
