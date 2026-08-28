import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, MessageCircle, Building, User, Hospital, Truck } from 'lucide-react';
import type { CartItem } from '@/types';
import { useWhatsApp } from '@/hooks/use-whatsapp';

interface StoreCartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (productId: number, delta: number) => void;
    onRemoveItem: (productId: number) => void;
    onClearCart: () => void;
}

type CustomerType = 'Paciente' | 'Farmacia' | 'Clínica' | 'Distribuidor';

export default function StoreCartDrawer({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
}: StoreCartDrawerProps) {
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
    const { createWhatsAppUrl, cartHeader, cartFooter, customerTypes } = useWhatsApp();
    const availableTypes = customerTypes.length > 0 ? customerTypes : ['Paciente', 'Farmacia', 'Clínica', 'Distribuidor'];
    const [customerType, setCustomerType] = useState<string>(availableTypes[0] || 'Paciente');
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');

    if (!isOpen) return null;

    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

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
        return createWhatsAppUrl(text);
    };

    const handleCheckout = async () => {
        setIsSubmittingQuote(true);

        // Registrar formalmente la cotización en backend para trazabilidad comercial y métricas
        try {
            await fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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
            window.open(generateWhatsAppOrderUrl(), '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-[#002072]/40 dark:bg-black/70 backdrop-blur-sm transition-opacity cursor-pointer"
                onClick={onClose}
                aria-label="Cerrar bolsa de pedidos"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
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
                            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                            aria-label="Cerrar panel"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Drawer Body: Items List */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                                    <ShoppingBag className="h-8 w-8" />
                                </div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">
                                    Tu bolsa está vacía
                                </h4>
                                <p className="text-xs max-w-xs text-slate-400">
                                    Explora el vademécum de Booz Laboratorio y añade formulaciones a tu cotización directa.
                                </p>
                            </div>
                        ) : (
                            items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3 relative group transition-all hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    <img
                                        src={product.image_path || '/assets/img/product_1.png'}
                                        alt={product.name}
                                        className="h-14 w-14 rounded-xl object-contain bg-white dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                {product.name}
                                            </h4>
                                            <button
                                                onClick={() => onRemoveItem(product.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                                title="Eliminar de la bolsa"
                                                aria-label={`Eliminar ${product.name}`}
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
                                            
                                            {/* Quantity Selector con Ergonomía Táctil Móvil (≥ 34px) */}
                                            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                                                <button
                                                    onClick={() => onUpdateQuantity(product.id, -1)}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer active:scale-90 transition-all"
                                                    title="Disminuir unidad"
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="text-xs font-bold px-2 text-slate-900 dark:text-white min-w-[20px] text-center">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(product.id, 1)}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer active:scale-90 transition-all"
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
                        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0D172E] border-t border-slate-200 dark:border-slate-800 space-y-3.5 pb-safe">
                            {/* Selector de Tipo de Cliente */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                    ¿Cómo solicitas esta cotización?
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {availableTypes.map((typeName) => {
                                        const isSelected = customerType === typeName;
                                        return (
                                            <button
                                                key={typeName}
                                                type="button"
                                                onClick={() => setCustomerType(typeName)}
                                                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#002072] text-white border-[#002072] dark:bg-blue-600 dark:border-blue-500 shadow-xs'
                                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
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
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-[11px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Teléfono / WhatsApp (Opcional)"
                                    value={customerContact}
                                    onChange={(e) => setCustomerContact(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-[11px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                                <span className="text-slate-500 dark:text-slate-400">Total en bolsa:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{items.length} fármacos ({totalUnits} uds)</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmittingQuote}
                                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer min-h-[44px]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>{isSubmittingQuote ? 'Registrando cotización...' : 'Solicitar Pedido por WhatsApp'}</span>
                            </button>

                            <div className="flex items-center justify-between pt-0.5">
                                <button
                                    onClick={onClearCart}
                                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    Vaciar bolsa
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline p-1"
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
