import {
    ShoppingBag,
    X,
    Trash2,
    Plus,
    Minus,
    MessageCircle,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { trackInteractionEvent } from '@/lib/telemetry';
import type { CartItem } from '@/types';

export type { CartItem };

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
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
    const { createWhatsAppUrl, cartHeader, cartFooter, customerTypes } =
        useWhatsApp();
    const availableTypes =
        customerTypes.length > 0
            ? customerTypes
            : ['Paciente', 'Farmacia', 'Clínica', 'Distribuidor'];
    const [customerType, setCustomerType] = useState<string>(
        availableTypes[0] || 'Paciente',
    );
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');

    if (!isOpen) return null;

    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleNavigateToProducts = () => {
        onClose();
        if (typeof window !== 'undefined') {
            if (window.location.pathname === '/') {
                const target = document.getElementById('productos');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', '#productos');
                    return;
                }
            }
            window.location.href = '/#productos';
        }
    };

    const generateWhatsAppOrderUrl = () => {
        let text = `${cartHeader}\n\n`;
        text += `🏛️ *Tipo de Solicitante:* ${customerType}\n`;
        if (customerName.trim()) {
            text += `👤 *Nombre / Razón Social:* ${customerName.trim()}\n`;
        }
        if (customerContact.trim()) {
            text += `📞 *Teléfono:* ${customerContact.trim()}\n`;
        }
        text += `\n📦 *Detalle de Fármacos Seleccionados:*\n`;

        items.forEach((item, index) => {
            text += `${index + 1}. *${item.product.name}* (${item.product.presentation})\n`;
            text += `   - Cantidad: *${item.quantity} unidades*\n`;
            text += `   - Principio: ${item.product.active_ingredients}\n`;
            if (item.product.is_prescription_required) {
                text += `   - [Nota Sanitaria: Venta bajo Récipe Médico]\n`;
            }
            text += `\n`;
        });

        text += `${cartFooter}`;
        return createWhatsAppUrl(text, 'sales');
    };

    const handleCheckout = async () => {
        setIsSubmittingQuote(true);

        // Registrar formalmente la cotización en backend para trazabilidad comercial y métricas
        try {
            await fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    customer_type: customerType,
                    customer_name: customerName.trim() || undefined,
                    customer_contact: customerContact.trim() || undefined,
                    channel: 'whatsapp',
                    items: items.map((item) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                    })),
                }),
            });
        } catch (err) {
            console.error('Error registrando cotización de telemetría:', err);
        } finally {
            setIsSubmittingQuote(false);
            const calculatedSubtotal = items.reduce((acc, item) => {
                const p =
                    typeof item.product.price === 'string'
                        ? parseFloat(item.product.price) || 0
                        : item.product.price || 0;
                return acc + p * item.quantity;
            }, 0);
            trackInteractionEvent(
                'quote_whatsapp_sent',
                'store_cart',
                'cart_checkout',
                items[0]?.product?.id,
                {
                    total_units: totalUnits,
                    total_amount: calculatedSubtotal,
                    customer_type: customerType,
                },
            );
            window.open(generateWhatsAppOrderUrl(), '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with Blur */}
            <div
                className="fixed inset-0 cursor-pointer bg-[#002072]/40 backdrop-blur-sm transition-opacity dark:bg-black/70"
                onClick={onClose}
                aria-label="Cerrar bolsa de pedidos"
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
                <div className="flex w-screen max-w-full flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl transition-colors duration-300 sm:max-w-md dark:border-slate-800 dark:bg-[#0A1124] dark:text-slate-100">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between bg-[#002072] px-6 py-5 text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <ShoppingBag className="h-5 w-5 text-cyan-300" />
                            </div>
                            <div>
                                <h3 className="text-base leading-tight font-bold">
                                    Tienda & Pedidos Booz
                                </h3>
                                <p className="text-[11px] text-blue-200">
                                    {totalUnits}{' '}
                                    {totalUnits === 1
                                        ? 'unidad seleccionada'
                                        : 'unidades seleccionadas'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-xl p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Cerrar panel"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Drawer Body: Items List */}
                    <div className="flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-6">
                        {items.length === 0 ? (
                            <div
                                onClick={handleNavigateToProducts}
                                className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-3xl p-6 text-center text-slate-400 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                title="Presiona para ir al catálogo de productos"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleNavigateToProducts();
                                    }
                                }}
                            >
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-[#002072] shadow-sm transition-transform group-hover:scale-110 group-hover:bg-blue-100 dark:bg-slate-800/80 dark:text-cyan-400 dark:group-hover:bg-slate-700">
                                    <ShoppingBag className="h-10 w-10" />
                                </div>
                                <h4 className="mb-1.5 text-base font-bold text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-cyan-400">
                                    Tu bolsa está vacía
                                </h4>
                                <p className="mb-5 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Explora el vademécum de Booz Laboratorio y
                                    añade formulaciones a tu cotización directa.
                                </p>
                                <span className="inline-flex items-center gap-2 rounded-xl bg-[#002072] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all group-hover:bg-blue-800 active:scale-95 dark:bg-blue-600 dark:group-hover:bg-blue-500">
                                    <Sparkles className="h-4 w-4 text-cyan-300" />
                                    <span>Ver Catálogo de Productos</span>
                                </span>
                            </div>
                        ) : (
                            items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="group relative flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-all hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700"
                                >
                                    <img
                                        src={
                                            product.image_path ||
                                            '/assets/img/product_1.png'
                                        }
                                        alt={product.name}
                                        className="h-14 w-14 flex-shrink-0 rounded-xl border border-slate-200/60 bg-white object-contain p-1 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                {product.name}
                                            </h4>
                                            <button
                                                onClick={() =>
                                                    onRemoveItem(product.id)
                                                }
                                                className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-red-500"
                                                title="Eliminar de la bolsa"
                                                aria-label={`Eliminar ${product.name}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <p className="truncate text-[10px] font-semibold text-blue-600 dark:text-cyan-400">
                                            {product.presentation}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                                                {product.product_line?.name ||
                                                    'Línea Booz'}
                                            </span>

                                            {/* Quantity Selector con Ergonomía Táctil Móvil (≥ 34px) */}
                                            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                                                <button
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            product.id,
                                                            -1,
                                                        )
                                                    }
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-90 dark:hover:bg-slate-700 dark:hover:text-white"
                                                    title="Disminuir unidad"
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="min-w-[20px] px-2 text-center text-xs font-bold text-slate-900 dark:text-white">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            product.id,
                                                            1,
                                                        )
                                                    }
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-90 dark:hover:bg-slate-700 dark:hover:text-white"
                                                    title="Aumentar unidad"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Drawer Footer: Formulario de Tipo de Cliente y Checkout */}
                    {items.length > 0 && (
                        <div className="pb-safe space-y-3.5 border-t border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-[#0D172E]">
                            {/* Selector de Tipo de Cliente */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                    ¿Cómo solicitas esta cotización?
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {availableTypes.map((typeName: string) => {
                                        const isSelected =
                                            customerType === typeName;
                                        return (
                                            <button
                                                key={typeName}
                                                type="button"
                                                onClick={() =>
                                                    setCustomerType(typeName)
                                                }
                                                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                                                    isSelected
                                                        ? 'border-[#002072] bg-[#002072] text-white shadow-xs dark:border-blue-500 dark:bg-blue-600'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60'
                                                }`}
                                            >
                                                <span>{typeName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Datos de contacto rápidos (opcionales) */}
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Tu Nombre / Entidad (Opcional)"
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                />
                                <input
                                    type="text"
                                    placeholder="Teléfono / WhatsApp (Opcional)"
                                    value={customerContact}
                                    onChange={(e) =>
                                        setCustomerContact(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-1 text-xs dark:border-slate-800">
                                <span className="text-slate-500 dark:text-slate-400">
                                    Total en bolsa:
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {items.length} fármacos ({totalUnits} uds)
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmittingQuote}
                                className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>
                                    {isSubmittingQuote
                                        ? 'Registrando cotización...'
                                        : 'Solicitar Pedido por WhatsApp'}
                                </span>
                            </button>

                            <div className="flex items-center justify-between pt-0.5">
                                <button
                                    onClick={onClearCart}
                                    className="p-1 text-[11px] text-slate-400 transition-colors hover:text-red-500"
                                >
                                    Vaciar bolsa
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1 text-[11px] font-bold text-blue-600 hover:underline dark:text-cyan-400"
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
