import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 font-sans text-slate-800 print:bg-white print:p-0 print:m-0">
            <Head title={`Cotización ${quote.quote_number} | Booz Laboratorio`} />

            {/* Print & Back Bar (Hidden on print) */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/admin/quotes"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a Cotizaciones</span>
                </Link>

                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002072] hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-900/20 transition-all cursor-pointer"
                >
                    <Printer className="h-4 w-4" />
                    <span>Imprimir o Guardar en PDF</span>
                </button>
            </div>

            {/* Voucher Paper Container */}
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-6 print:rounded-none">
                {/* Header with Laboratory Branding */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-[#002072] pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#002072] text-white flex items-center justify-center font-black text-2xl tracking-wider shadow-md">
                            BZ
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#002072] uppercase tracking-tight">
                                Booz Laboratorio VGME, C.A.
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Registro de Información Fiscal (RIF): <strong className="text-slate-800">J-40906185-0</strong>
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                                Planta Farmacéutica: Valle de Guanape, Estado Anzoátegui, Venezuela.
                            </p>
                        </div>
                    </div>

                    <div className="text-left sm:text-right border-l-2 sm:border-l-0 pl-4 sm:pl-0 border-blue-200">
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#002072] font-black text-xs uppercase mb-1 tracking-wider">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Cliente / Razón Social
                        </span>
                        <span className="text-sm font-black text-slate-900 block mt-0.5">
                            {quote.customer_name}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-1">
                            Tipo de Solicitante: <strong className="text-[#002072]">{quote.customer_type}</strong>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Datos de Contacto & Canal
                        </span>
                        <span className="text-sm font-semibold text-slate-900 block mt-0.5">
                            {quote.customer_contact || 'Sin teléfono registrado'}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-1">
                            Canal de Emisión: <strong className="capitalize">{quote.channel}</strong> • Estado: <strong className="text-emerald-700">{quote.status}</strong>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto my-6">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                                <th className="py-3 px-3">#</th>
                                <th className="py-3 px-3">Fármaco / Producto</th>
                                <th className="py-3 px-3">Presentación</th>
                                <th className="py-3 px-3 text-center">Cantidad</th>
                                <th className="py-3 px-3 text-right">P. Unitario ($)</th>
                                <th className="py-3 px-3 text-right">Subtotal ($)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {quote.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                                    <td className="py-3 px-3">
                                        <div className="font-bold text-slate-900">{item.name}</div>
                                        <div className="text-[10px] text-slate-500">{item.active_ingredients}</div>
                                    </td>
                                    <td className="py-3 px-3 text-slate-600">{item.presentation}</td>
                                    <td className="py-3 px-3 text-center font-bold text-slate-900">{item.quantity} uds</td>
                                    <td className="py-3 px-3 text-right text-slate-700 font-mono">${item.price.toFixed(2)}</td>
                                    <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">${item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-300 bg-slate-50">
                                <td colSpan={3} className="py-3.5 px-3 font-bold text-right text-slate-700">
                                    Total de Unidades Cotizadas:
                                </td>
                                <td className="py-3.5 px-3 text-center font-black text-[#002072]">
                                    {quote.total_items} unidades
                                </td>
                                <td className="py-3.5 px-3 font-bold text-right text-slate-700">
                                    Monto Total Estimado:
                                </td>
                                <td className="py-3.5 px-3 text-right font-black text-lg text-[#002072] font-mono">
                                    ${quote.total_amount.toFixed(2)} USD
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Administrative Notes if any */}
                {quote.admin_notes && (
                    <div className="my-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                        <span className="font-bold text-amber-900 block mb-1">Notas Comerciales y de Despacho:</span>
                        <p className="text-amber-800 leading-relaxed">{quote.admin_notes}</p>
                    </div>
                )}

                {/* Footer and Legal Health Regulations */}
                <div className="mt-10 pt-6 border-t border-slate-200 space-y-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Fabricado bajo Normas de Buenas Prácticas de Manufactura (BPM) y control sanitario INH.</span>
                    </div>

                    <p className="leading-relaxed">
                        <strong>Condiciones Comerciales:</strong> Esta cotización tiene una validez de 15 días continuos a partir de su emisión. Los medicamentos que requieran prescripción facultativa serán despachados exclusivamente previa consignación del récipe médico correspondiente. Precios expresados en Dólares Estadounidenses (USD), pagaderos en moneda nacional a la tasa oficial del Banco Central de Venezuela (BCV) a la fecha de facturación.
                    </p>

                    <div className="pt-8 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-400">
                        <div>
                            Documento emitido electrónicamente por el Sistema de Gestión Comercial BoozLab.
                        </div>
                        <div className="font-mono">
                            VERIFICACIÓN: {quote.quote_number} • BOOZ-CONFIDENTIAL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
