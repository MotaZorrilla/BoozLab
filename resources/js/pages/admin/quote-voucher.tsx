import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import React from 'react';

interface QuoteVoucherItem {
    name: string;
    presentation: string;
    active_ingredients: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface QuoteVoucherProps {
    quote: {
        id: number;
        quote_number: string;
        customer_name: string;
        customer_contact: string | null;
        customer_type: string;
        channel: string;
        total_items: number;
        total_amount: number;
        status: string;
        admin_notes: string | null;
        created_at: string;
        items: QuoteVoucherItem[];
    };
}

export default function QuoteVoucher({ quote }: QuoteVoucherProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 font-sans text-slate-800 sm:px-6 print:m-0 print:bg-white print:p-0">
            <Head
                title={`Cotización ${quote.quote_number} | Booz Laboratorio`}
            />

            {/* Print & Back Bar (Hidden on print) */}
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between print:hidden">
                <Link
                    href="/admin/quotes"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a Cotizaciones</span>
                </Link>

                <button
                    onClick={handlePrint}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002072] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800"
                >
                    <Printer className="h-4 w-4" />
                    <span>Imprimir o Guardar en PDF</span>
                </button>
            </div>

            {/* Voucher Paper Container */}
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-12 print:rounded-none print:border-none print:p-6 print:shadow-none">
                {/* Header with Laboratory Branding */}
                <div className="flex flex-col items-start justify-between gap-6 border-b-2 border-[#002072] pb-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#002072] text-2xl font-black tracking-wider text-white shadow-md">
                            BZ
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-[#002072] uppercase">
                                Booz Laboratorio VGME, C.A.
                            </h1>
                            <p className="text-xs font-medium text-slate-500">
                                Registro de Información Fiscal (RIF):{' '}
                                <strong className="text-slate-800">
                                    J-40906185-0
                                </strong>
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                                Planta Farmacéutica: Valle de Guanape, Estado
                                Anzoátegui, Venezuela.
                            </p>
                        </div>
                    </div>

                    <div className="border-l-2 border-blue-200 pl-4 text-left sm:border-l-0 sm:pl-0 sm:text-right">
                        <div className="mb-1 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black tracking-wider text-[#002072] uppercase">
                            Cotización Oficial
                        </div>
                        <div className="font-mono text-base font-black text-slate-900">
                            {quote.quote_number}
                        </div>
                        <div className="text-[11px] text-slate-400">
                            Fecha de Emisión: {quote.created_at}
                        </div>
                    </div>
                </div>

                {/* Customer Information Block */}
                <div className="my-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-2">
                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Cliente / Razón Social
                        </span>
                        <span className="mt-0.5 block text-sm font-black text-slate-900">
                            {quote.customer_name}
                        </span>
                        <div className="mt-1 text-[11px] text-slate-600">
                            Tipo de Solicitante:{' '}
                            <strong className="text-[#002072]">
                                {quote.customer_type}
                            </strong>
                        </div>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Datos de Contacto & Canal
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold text-slate-900">
                            {quote.customer_contact ||
                                'Sin teléfono registrado'}
                        </span>
                        <div className="mt-1 text-[11px] text-slate-600">
                            Canal de Emisión:{' '}
                            <strong className="capitalize">
                                {quote.channel}
                            </strong>{' '}
                            • Estado:{' '}
                            <strong className="text-emerald-700">
                                {quote.status}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="my-6 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b-2 border-slate-300 bg-slate-100 text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                                <th className="px-3 py-3">#</th>
                                <th className="px-3 py-3">
                                    Fármaco / Producto
                                </th>
                                <th className="px-3 py-3">Presentación</th>
                                <th className="px-3 py-3 text-center">
                                    Cantidad
                                </th>
                                <th className="px-3 py-3 text-right">
                                    P. Unitario ($)
                                </th>
                                <th className="px-3 py-3 text-right">
                                    Subtotal ($)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {quote.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="px-3 py-3 font-bold text-slate-400">
                                        {idx + 1}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="font-bold text-slate-900">
                                            {item.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            {item.active_ingredients}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">
                                        {item.presentation}
                                    </td>
                                    <td className="px-3 py-3 text-center font-bold text-slate-900">
                                        {item.quantity} uds
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-slate-700">
                                        ${item.price.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono font-black text-slate-900">
                                        ${item.subtotal.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-300 bg-slate-50">
                                <td
                                    colSpan={3}
                                    className="px-3 py-3.5 text-right font-bold text-slate-700"
                                >
                                    Total de Unidades Cotizadas:
                                </td>
                                <td className="px-3 py-3.5 text-center font-black text-[#002072]">
                                    {quote.total_items} unidades
                                </td>
                                <td className="px-3 py-3.5 text-right font-bold text-slate-700">
                                    Monto Total Estimado:
                                </td>
                                <td className="px-3 py-3.5 text-right font-mono text-lg font-black text-[#002072]">
                                    ${quote.total_amount.toFixed(2)} USD
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Administrative Notes if any */}
                {quote.admin_notes && (
                    <div className="my-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs">
                        <span className="mb-1 block font-bold text-amber-900">
                            Notas Comerciales y de Despacho:
                        </span>
                        <p className="leading-relaxed text-amber-800">
                            {quote.admin_notes}
                        </p>
                    </div>
                )}

                {/* Footer and Legal Health Regulations */}
                <div className="mt-10 space-y-4 border-t border-slate-200 pt-6 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 font-semibold text-emerald-800">
                        <ShieldCheck className="h-4 w-4" />
                        <span>
                            Fabricado bajo Normas de Buenas Prácticas de
                            Manufactura (BPM) y control sanitario INH.
                        </span>
                    </div>

                    <p className="leading-relaxed">
                        <strong>Condiciones Comerciales:</strong> Esta
                        cotización tiene una validez de 15 días continuos a
                        partir de su emisión. Los medicamentos que requieran
                        prescripción facultativa serán despachados
                        exclusivamente previa consignación del récipe médico
                        correspondiente. Precios expresados en Dólares
                        Estadounidenses (USD), pagaderos en moneda nacional a la
                        tasa oficial del Banco Central de Venezuela (BCV) a la
                        fecha de facturación.
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-8 text-[10px] text-slate-400">
                        <div>
                            Documento emitido electrónicamente por el Sistema de
                            Gestión Comercial BoozLab.
                        </div>
                        <div className="font-mono">
                            VERIFICACIÓN: {quote.quote_number} •
                            BOOZ-CONFIDENTIAL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
