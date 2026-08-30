import { Head, useForm } from '@inertiajs/react';
import { 
    Settings, Phone, MessageSquare, Building2, MapPin, CheckCircle2, 
    AlertCircle, Save, ExternalLink, ShoppingBag, Users, Sparkles 
} from 'lucide-react';
import React, { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';

interface SettingsProps {
    settings: {
        whatsapp_sales_phone: string;
        whatsapp_contact_phone?: string;
        company_phone?: string;
        whatsapp_default_message: string;
        whatsapp_cart_header: string;
        whatsapp_cart_footer: string;
        whatsapp_cart_customer_types: string;
        company_name: string;
        company_rif: string;
        plant_location: string;
    };
}

export default function AdminSettings({ settings }: SettingsProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        whatsapp_sales_phone: settings.whatsapp_sales_phone || '584148873615',
        whatsapp_contact_phone: settings.whatsapp_contact_phone || settings.whatsapp_sales_phone || '584148873615',
        company_phone: settings.company_phone || settings.whatsapp_sales_phone || '584148873615',
        whatsapp_default_message: settings.whatsapp_default_message || 'Hola Booz Laboratorio, deseo cotizar productos farmacéuticos.',
        whatsapp_cart_header: settings.whatsapp_cart_header || '*HOLA BOOZ LABORATORIO* 🔬\nDeseo solicitar cotización y disponibilidad para el siguiente pedido:',
        whatsapp_cart_footer: settings.whatsapp_cart_footer || '_Por favor confirmar disponibilidad en planta / droguería y tiempos de entrega oficial._',
        whatsapp_cart_customer_types: settings.whatsapp_cart_customer_types || 'Paciente,Farmacia,Clínica,Distribuidor',
        company_name: settings.company_name || 'Booz Laboratorio VGME, C.A.',
        company_rif: settings.company_rif || 'J-40906185-0',
        plant_location: settings.plant_location || 'Valle de Guanape, Edo. Anzoátegui',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings');
    };

    const cleanContactPhone = data.whatsapp_contact_phone.replace(/\D/g, '');
    const cleanSalesPhone = data.whatsapp_sales_phone.replace(/\D/g, '');
    const previewGeneralUrl = `https://wa.me/${cleanContactPhone}?text=${encodeURIComponent(data.whatsapp_default_message)}`;
    const previewSalesUrl = `https://wa.me/${cleanSalesPhone}?text=${encodeURIComponent('Hola Booz Laboratorio, deseo cotización de pedido')}`;

    // Vista previa dinámica del mensaje de la bolsa de pedidos
    const previewCartMessage = useMemo(() => {
        return `${data.whatsapp_cart_header}

🏛️ *Tipo de Solicitante:* Farmacia Aliada
👤 *Nombre / Razón Social:* Farmacia San José C.A.
📞 *Teléfono:* 0414-8899111

📦 *Detalle de Fármacos Seleccionados:*
1. *Bactrocis Crema Especializada* (Tubo colapsible 20g)
   - Cantidad: *20 unidades*
   - Principio: Moxifloxacina 0.5%
   - [Nota Sanitaria: Venta bajo Récipe Médico]

2. *Calamicis Loción Calmante* (Frasco 200ml)
   - Cantidad: *30 unidades*
   - Principio: Calamina 8% + Óxido de Zinc

${data.whatsapp_cart_footer}`;
    }, [data.whatsapp_cart_header, data.whatsapp_cart_footer]);

    const parsedCustomerTypes = useMemo(() => {
        return data.whatsapp_cart_customer_types.split(',').map((s) => s.trim()).filter(Boolean);
    }, [data.whatsapp_cart_customer_types]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Ajustes & WhatsApp', href: '/admin/settings' }]}>
            <Head title="Ajustes Generales y WhatsApp | Booz Laboratorio" />

            <div className="p-3 sm:p-6 lg:p-8 max-w-5xl 2xl:max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#002072] dark:text-cyan-400">
                                <Settings className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Ajustes Generales, WhatsApp & Tienda Virtual
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Configura el número oficial, plantillas automáticas de pedidos y membretes legales.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Configuraciones actualizadas exitosamente en base de datos y sincronizadas con la tienda pública.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tarjeta 1: Canales Telefónicos y WhatsApp Multi-Departamento */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Canales Oficiales de Telefonía y WhatsApp</span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                3 Canales Configurables
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Puedes configurar líneas telefónicas separadas para cada departamento o registrar el mismo número en todos los campos según la logística de tu laboratorio.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Canal 1: WhatsApp Atención General */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                                <span className="block text-[11px] font-bold text-[#002072] dark:text-cyan-400 uppercase tracking-wider">
                                    1. Atención y Botón Flotante
                                </span>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    WhatsApp General
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp_contact_phone}
                                    onChange={(e) => setData('whatsapp_contact_phone', e.target.value)}
                                    placeholder="584148873615"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors font-mono"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Abre chats desde el botón flotante y consultas generales.
                                </p>
                            </div>

                            {/* Canal 2: WhatsApp Tienda / Pedidos */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                                <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    2. Ventas y Pedidos
                                </span>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    WhatsApp Tienda Virtual
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp_sales_phone}
                                    onChange={(e) => setData('whatsapp_sales_phone', e.target.value)}
                                    placeholder="584148873615"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors font-mono"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Recibe los pedidos y cotizaciones desde la bolsa de compras.
                                </p>
                            </div>

                            {/* Canal 3: Central Planta */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                                <span className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                    3. Central Telefónica
                                </span>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Llamadas de Planta
                                </label>
                                <input
                                    type="text"
                                    value={data.company_phone}
                                    onChange={(e) => setData('company_phone', e.target.value)}
                                    placeholder="584148873615"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors font-mono"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Número institucional visible en el footer oficial.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                Mensaje General de Bienvenida (Botón Flotante y Footer)
                            </label>
                            <textarea
                                rows={2}
                                value={data.whatsapp_default_message}
                                onChange={(e) => setData('whatsapp_default_message', e.target.value)}
                                placeholder="Hola Booz Laboratorio, deseo cotizar productos farmacéuticos."
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs p-2.5 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                            />
                        </div>

                        {/* Previsualizaciones en vivo */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">WhatsApp Atención: </span>
                                    <code className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">+{cleanContactPhone}</code>
                                </div>
                                <a
                                    href={previewGeneralUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shrink-0"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Probar</span>
                                </a>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">WhatsApp Ventas: </span>
                                    <code className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono">+{cleanSalesPhone}</code>
                                </div>
                                <a
                                    href={previewSalesUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold transition-all shrink-0"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Probar</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 2: Configuración de la Bolsa de Pedidos Pública (store-cart-drawer) */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                <ShoppingBag className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                <span>Personalización de la Bolsa de Pedidos Pública & Mensaje de WhatsApp</span>
                            </div>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 font-bold">
                                Tienda Virtual
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* Perfiles de cliente configurables */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                                    <span>Perfiles de Solicitante Permitidos (Separados por coma)</span>
                                    <span className="text-[10px] text-slate-400 font-normal">Aparecen como botones en la bolsa de compras</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp_cart_customer_types}
                                    onChange={(e) => setData('whatsapp_cart_customer_types', e.target.value)}
                                    placeholder="Paciente, Farmacia, Clínica, Distribuidor"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                    <span className="text-[11px] text-slate-400">Vista previa de botones:</span>
                                    {parsedCustomerTypes.map((t) => (
                                        <span key={t} className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#002072] dark:text-cyan-400 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                {errors.whatsapp_cart_customer_types && (
                                    <p className="text-red-600 text-xs mt-1 font-semibold">{errors.whatsapp_cart_customer_types}</p>
                                )}
                            </div>

                            {/* Encabezado y Pie del mensaje */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                        Encabezado / Saludo del Pedido en WhatsApp
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.whatsapp_cart_header}
                                        onChange={(e) => setData('whatsapp_cart_header', e.target.value)}
                                        placeholder="*HOLA BOOZ LABORATORIO* 🔬..."
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs p-2.5 font-mono focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Texto inicial con el que el cliente abre la conversación al pedir la cotización.
                                    </p>
                                    {errors.whatsapp_cart_header && (
                                        <p className="text-red-600 text-xs mt-1 font-semibold">{errors.whatsapp_cart_header}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                        Pie / Cierre del Pedido en WhatsApp
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.whatsapp_cart_footer}
                                        onChange={(e) => setData('whatsapp_cart_footer', e.target.value)}
                                        placeholder="_Por favor confirmar disponibilidad en planta..._"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs p-2.5 font-mono focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Despedida y solicitud de confirmación de despacho y tiempos de entrega.
                                    </p>
                                    {errors.whatsapp_cart_footer && (
                                        <p className="text-red-600 text-xs mt-1 font-semibold">{errors.whatsapp_cart_footer}</p>
                                    )}
                                </div>
                            </div>

                            {/* Simulador / Previsualización en Tiempo Real del Mensaje de WhatsApp */}
                            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                    <Sparkles className="h-4 w-4 text-emerald-600" />
                                    <span>Simulador de Mensaje que Recibirá el Laboratorio en WhatsApp:</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-xs">
                                    {previewCartMessage}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3: Datos Legales e Institucionales */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span>Datos Legales de la Compañía y Planta de Producción</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Razón Social Oficial
                                </label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                {errors.company_name && (
                                    <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-semibold">{errors.company_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                    RIF Sanitario (SENIAT / INH)
                                </label>
                                <input
                                    type="text"
                                    value={data.company_rif}
                                    onChange={(e) => setData('company_rif', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                {errors.company_rif && (
                                    <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-semibold">{errors.company_rif}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Ubicación de Planta de Producción
                                </label>
                                <input
                                    type="text"
                                    value={data.plant_location}
                                    onChange={(e) => setData('plant_location', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                {errors.plant_location && (
                                    <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-semibold">{errors.plant_location}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón de Guardado */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/20 cursor-pointer transition-all disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{processing ? 'Guardando Ajustes...' : 'Guardar y Aplicar Cambios'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
