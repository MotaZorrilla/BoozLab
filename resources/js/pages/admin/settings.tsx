import { Head, useForm } from '@inertiajs/react';
import {
    Settings,
    Phone,
    Building2,
    CheckCircle2,
    Save,
    ExternalLink,
    ShoppingBag,
    Sparkles,
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
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm({
            whatsapp_sales_phone:
                settings.whatsapp_sales_phone || '584148873615',
            whatsapp_contact_phone:
                settings.whatsapp_contact_phone ||
                settings.whatsapp_sales_phone ||
                '584148873615',
            company_phone:
                settings.company_phone ||
                settings.whatsapp_sales_phone ||
                '584148873615',
            whatsapp_default_message:
                settings.whatsapp_default_message ||
                'Hola Booz Laboratorio, deseo cotizar productos farmacéuticos.',
            whatsapp_cart_header:
                settings.whatsapp_cart_header ||
                '*HOLA BOOZ LABORATORIO* 🔬\nDeseo solicitar cotización y disponibilidad para el siguiente pedido:',
            whatsapp_cart_footer:
                settings.whatsapp_cart_footer ||
                '_Por favor confirmar disponibilidad en planta / droguería y tiempos de entrega oficial._',
            whatsapp_cart_customer_types:
                settings.whatsapp_cart_customer_types ||
                'Paciente,Farmacia,Clínica,Distribuidor',
            company_name:
                settings.company_name || 'Booz Laboratorio VGME, C.A.',
            company_rif: settings.company_rif || 'J-40906185-0',
            plant_location:
                settings.plant_location || 'Valle de Guanape, Edo. Anzoátegui',
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
        return data.whatsapp_cart_customer_types
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }, [data.whatsapp_cart_customer_types]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
                { title: 'Ajustes & WhatsApp', href: '/admin/settings' },
            ]}
        >
            <Head title="Ajustes Generales y WhatsApp | Booz Laboratorio" />

            <div className="mx-auto max-w-5xl space-y-6 p-3 sm:p-6 lg:p-8 2xl:max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-2xl bg-blue-50 p-2.5 text-[#002072] dark:bg-blue-900/30 dark:text-cyan-400">
                                <Settings className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                    Ajustes Generales, WhatsApp & Tienda Virtual
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Configura el número oficial, plantillas
                                    automáticas de pedidos y membretes legales.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>
                            Configuraciones actualizadas exitosamente en base de
                            datos y sincronizadas con la tienda pública.
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tarjeta 1: Canales Telefónicos y WhatsApp Multi-Departamento */}
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>
                                    Canales Oficiales de Telefonía y WhatsApp
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                3 Canales Configurables
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Puedes configurar líneas telefónicas separadas para
                            cada departamento o registrar el mismo número en
                            todos los campos según la logística de tu
                            laboratorio.
                        </p>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Canal 1: WhatsApp Atención General */}
                            <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/60 dark:bg-slate-800/40">
                                <span className="block text-[11px] font-bold tracking-wider text-[#002072] uppercase dark:text-cyan-400">
                                    1. Atención y Botón Flotante
                                </span>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    WhatsApp General
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp_contact_phone}
                                    onChange={(e) =>
                                        setData(
                                            'whatsapp_contact_phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="584148873615"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Abre chats desde el botón flotante y
                                    consultas generales.
                                </p>
                            </div>

                            {/* Canal 2: WhatsApp Tienda / Pedidos */}
                            <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/60 dark:bg-slate-800/40">
                                <span className="block text-[11px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                    2. Ventas y Pedidos
                                </span>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    WhatsApp Tienda Virtual
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp_sales_phone}
                                    onChange={(e) =>
                                        setData(
                                            'whatsapp_sales_phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="584148873615"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Recibe los pedidos y cotizaciones desde la
                                    bolsa de compras.
                                </p>
                            </div>

                            {/* Canal 3: Central Planta */}
                            <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/60 dark:bg-slate-800/40">
                                <span className="block text-[11px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                                    3. Central Telefónica
                                </span>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Llamadas de Planta
                                </label>
                                <input
                                    type="text"
                                    value={data.company_phone}
                                    onChange={(e) =>
                                        setData('company_phone', e.target.value)
                                    }
                                    placeholder="584148873615"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Número institucional visible en el footer
                                    oficial.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                Mensaje General de Bienvenida (Botón Flotante y
                                Footer)
                            </label>
                            <textarea
                                rows={2}
                                value={data.whatsapp_default_message}
                                onChange={(e) =>
                                    setData(
                                        'whatsapp_default_message',
                                        e.target.value,
                                    )
                                }
                                placeholder="Hola Booz Laboratorio, deseo cotizar productos farmacéuticos."
                                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>

                        {/* Previsualizaciones en vivo */}
                        <div className="grid grid-cols-1 gap-3 rounded-2xl border-t border-slate-100 bg-slate-50 p-3 pt-3 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        WhatsApp Atención:{' '}
                                    </span>
                                    <code className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                                        +{cleanContactPhone}
                                    </code>
                                </div>
                                <a
                                    href={previewGeneralUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white transition-all hover:bg-emerald-700"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Probar</span>
                                </a>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        WhatsApp Ventas:{' '}
                                    </span>
                                    <code className="font-mono text-[11px] text-blue-600 dark:text-cyan-400">
                                        +{cleanSalesPhone}
                                    </code>
                                </div>
                                <a
                                    href={previewSalesUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white transition-all hover:bg-blue-800"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Probar</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 2: Configuración de la Bolsa de Pedidos Pública (store-cart-drawer) */}
                    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                <ShoppingBag className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                                <span>
                                    Personalización de la Bolsa de Pedidos
                                    Pública & Mensaje de WhatsApp
                                </span>
                            </div>
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-cyan-300">
                                Tienda Virtual
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* Perfiles de cliente configurables */}
                            <div>
                                <label className="mb-1.5 block flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                                    <span>
                                        Perfiles de Solicitante Permitidos
                                        (Separados por coma)
                                    </span>
                                    <span className="text-[10px] font-normal text-slate-400">
                                        Aparecen como botones en la bolsa de
                                        compras
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={data.whatsapp_cart_customer_types}
                                    onChange={(e) =>
                                        setData(
                                            'whatsapp_cart_customer_types',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Paciente, Farmacia, Clínica, Distribuidor"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    <span className="text-[11px] text-slate-400">
                                        Vista previa de botones:
                                    </span>
                                    {parsedCustomerTypes.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#002072] dark:border-blue-800 dark:bg-blue-950/60 dark:text-cyan-400"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                {errors.whatsapp_cart_customer_types && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                        {errors.whatsapp_cart_customer_types}
                                    </p>
                                )}
                            </div>

                            {/* Encabezado y Pie del mensaje */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Encabezado / Saludo del Pedido en
                                        WhatsApp
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.whatsapp_cart_header}
                                        onChange={(e) =>
                                            setData(
                                                'whatsapp_cart_header',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="*HOLA BOOZ LABORATORIO* 🔬..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Texto inicial con el que el cliente abre
                                        la conversación al pedir la cotización.
                                    </p>
                                    {errors.whatsapp_cart_header && (
                                        <p className="mt-1 text-xs font-semibold text-red-600">
                                            {errors.whatsapp_cart_header}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Pie / Cierre del Pedido en WhatsApp
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.whatsapp_cart_footer}
                                        onChange={(e) =>
                                            setData(
                                                'whatsapp_cart_footer',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="_Por favor confirmar disponibilidad en planta..._"
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Despedida y solicitud de confirmación de
                                        despacho y tiempos de entrega.
                                    </p>
                                    {errors.whatsapp_cart_footer && (
                                        <p className="mt-1 text-xs font-semibold text-red-600">
                                            {errors.whatsapp_cart_footer}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Simulador / Previsualización en Tiempo Real del Mensaje de WhatsApp */}
                            <div className="space-y-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/20">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                    <Sparkles className="h-4 w-4 text-emerald-600" />
                                    <span>
                                        Simulador de Mensaje que Recibirá el
                                        Laboratorio en WhatsApp:
                                    </span>
                                </div>
                                <div className="rounded-xl border border-emerald-100 bg-white p-3.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-800 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {previewCartMessage}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3: Datos Legales e Institucionales */}
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span>
                                Datos Legales de la Compañía y Planta de
                                Producción
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Razón Social Oficial
                                </label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) =>
                                        setData('company_name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {errors.company_name && (
                                    <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                        {errors.company_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    RIF Sanitario (SENIAT / INH)
                                </label>
                                <input
                                    type="text"
                                    value={data.company_rif}
                                    onChange={(e) =>
                                        setData('company_rif', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {errors.company_rif && (
                                    <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                        {errors.company_rif}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Ubicación de Planta de Producción
                                </label>
                                <input
                                    type="text"
                                    value={data.plant_location}
                                    onChange={(e) =>
                                        setData(
                                            'plant_location',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {errors.plant_location && (
                                    <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                        {errors.plant_location}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón de Guardado */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#002072] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {processing
                                    ? 'Guardando Ajustes...'
                                    : 'Guardar y Aplicar Cambios'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
