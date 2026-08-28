import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, CheckCircle2, AlertTriangle, FileText, ArrowLeft, Phone, Mail, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import BoozLayout from '@/layouts/booz-layout';

interface ProductOption {
    id: number;
    name: string;
    presentation: string;
}

export default function Farmacovigilancia({ products = [] }: { products?: ProductOption[] }) {
    const [formData, setFormData] = useState({
        product_id: '',
        product_name: '',
        batch_number: '',
        expiry_date: '',
        reporter_name: '',
        reporter_type: 'Paciente',
        reporter_contact: '',
        adverse_reaction: '',
        severity: 'Leve',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketGenerated, setTicketGenerated] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/farmacovigilancia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setTicketGenerated(data.ticket_number);
            } else {
                setErrorMessage(data.message || 'Ocurrió un error al procesar el reporte. Verifique los campos.');
            }
        } catch {
            setErrorMessage('Error de conexión. Intente nuevamente más tarde.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BoozLayout>
            <Head title="Canal Oficial de Farmacovigilancia | Booz Laboratorio" />

            <div className="bg-slate-50 min-h-screen py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header Breadcrumb */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver a la Página Principal</span>
                        </Link>
                    </div>

                    {ticketGenerated ? (
                        /* Ticket Success Card */
                        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                                    Reporte Registrado Exitosamente
                                </span>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Ticket N°: <span className="text-blue-900">{ticketGenerated}</span>
                                </h1>
                                <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                                    Hemos recibido su notificación de farmacovigilancia. Nuestro departamento de Calidad y Farmacéutica Patrocinante analizará la información conforme a las normativas del <strong>Instituto Nacional de Higiene "Rafael Rangel"</strong>.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md mx-auto">
                                Guarde este número de ticket para cualquier seguimiento técnico o comunicación posterior con nuestro laboratorio.
                            </div>

                            <div className="pt-4 flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setTicketGenerated(null);
                                        setFormData({
                                            product_id: '',
                                            product_name: '',
                                            batch_number: '',
                                            expiry_date: '',
                                            reporter_name: '',
                                            reporter_type: 'Paciente',
                                            reporter_contact: '',
                                            adverse_reaction: '',
                                            severity: 'Leve',
                                        });
                                    }}
                                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                                >
                                    Enviar Otro Reporte
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    Ir al Inicio
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Main Form Card */
                        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
                            {/* Legal Notice */}
                            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
                                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
                                    <h3 className="font-bold text-sm text-amber-950">
                                        Canal Sanitario de Notificación (Cumplimiento INH)
                                    </h3>
                                    <p>
                                        Este formulario está destinado al registro de sospechas de reacciones adversas a medicamentos (RAM), fallas de empaque o reportes de calidad por parte de pacientes, médicos o farmacéuticos para <strong>BOOZ LABORATORIO VGME, C.A.</strong> (RIF J-40906185-0).
                                    </p>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Sección 1: Datos del Medicamento */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 pb-2 border-b border-slate-100">
                                        1. Datos del Producto y Lote
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Producto Notificado *
                                            </label>
                                            {products.length > 0 ? (
                                                <select
                                                    value={formData.product_name}
                                                    onChange={(e) => {
                                                        const pName = e.target.value;
                                                        const pObj = products.find((p) => p.name === pName);
                                                        setFormData({
                                                            ...formData,
                                                            product_name: pName,
                                                            product_id: pObj ? String(pObj.id) : '',
                                                        });
                                                    }}
                                                    required
                                                    className="w-full rounded-xl border-slate-200 text-xs py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                                >
                                                    <option value="">Seleccione el producto...</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.name}>
                                                            {p.name} ({p.presentation})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={formData.product_name}
                                                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                                    placeholder="Ej. Bactrocis Crema 20g"
                                                    required
                                                    className="w-full rounded-xl border-slate-200 text-xs py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Número de Lote (Grabado en estuche/tubo)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.batch_number}
                                                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                                                placeholder="Ej. L-202607"
                                                className="w-full rounded-xl border-slate-200 text-xs py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 2: Evento Adverso o Queja */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 pb-2 border-b border-slate-100">
                                        2. Descripción del Evento Adverso o Falla
                                    </h4>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Severidad del Evento *
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Leve', 'Moderada', 'Grave'].map((sev) => (
                                                <button
                                                    key={sev}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, severity: sev })}
                                                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                                                        formData.severity === sev
                                                            ? sev === 'Grave'
                                                                ? 'bg-red-600 text-white border-red-600 shadow-md'
                                                                : sev === 'Moderada'
                                                                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                                                                : 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {sev}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Detalle de la Reacción o Falla Observada *
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.adverse_reaction}
                                            onChange={(e) => setFormData({ ...formData, adverse_reaction: e.target.value })}
                                            placeholder="Describa los síntomas observados, tiempo de aparición, zona de aplicación o defecto físico detectado en el producto..."
                                            required
                                            className="w-full rounded-xl border-slate-200 text-xs p-3 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {/* Sección 3: Datos del Notificante */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 pb-2 border-b border-slate-100">
                                        3. Datos del Notificante
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Tipo de Notificante *
                                            </label>
                                            <select
                                                value={formData.reporter_type}
                                                onChange={(e) => setFormData({ ...formData, reporter_type: e.target.value })}
                                                className="w-full rounded-xl border-slate-200 text-xs py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                            >
                                                <option value="Paciente">Paciente / Familiar</option>
                                                <option value="Médico">Médico Tratante</option>
                                                <option value="Farmacéutico">Farmacéutico</option>
                                                <option value="Distribuidor">Distribuidor / Droguería</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.reporter_name}
                                                onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                                                placeholder="Ej. Dr. Carlos Silva"
                                                required
                                                className="w-full rounded-xl border-slate-200 text-xs py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Teléfono o Correo de Contacto *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.reporter_contact}
                                                onChange={(e) => setFormData({ ...formData, reporter_contact: e.target.value })}
                                                placeholder="Ej. 0414-1234567 o email@..."
                                                required
                                                className="w-full rounded-xl border-slate-200 text-xs py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-xl shadow-blue-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>{isSubmitting ? 'Registrando en Farmacovigilancia...' : 'Enviar Reporte Oficial'}</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </BoozLayout>
    );
}
