import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import BoozLayout from '@/layouts/booz-layout';

interface ProductOption {
    id: number;
    name: string;
    presentation: string;
}

export default function Farmacovigilancia({
    products = [],
}: {
    products?: ProductOption[];
}) {
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
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setTicketGenerated(data.ticket_number);
            } else {
                setErrorMessage(
                    data.message ||
                        'Ocurrió un error al procesar el reporte. Verifique los campos.',
                );
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

            <div className="min-h-screen bg-slate-50 py-8 text-slate-900 transition-colors duration-300 sm:py-12 dark:bg-[#070C18] dark:text-slate-100">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
                    {/* Header Breadcrumb */}
                    <div className="mb-6 sm:mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-[#002072] dark:text-slate-400 dark:hover:text-cyan-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver a la Página Principal</span>
                        </Link>
                    </div>

                    {ticketGenerated ? (
                        /* Ticket Success Card */
                        <div className="animate-in space-y-6 rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-xl duration-300 fade-in zoom-in sm:p-12 dark:border-emerald-900/60 dark:bg-[#0D172E]">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                                    Reporte Registrado Exitosamente
                                </span>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                    Ticket N°:{' '}
                                    <span className="text-[#002072] dark:text-cyan-400">
                                        {ticketGenerated}
                                    </span>
                                </h1>
                                <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                    Hemos recibido su notificación de
                                    farmacovigilancia. Nuestro departamento de
                                    Calidad y Farmacéutica Patrocinante
                                    analizará la información conforme a las
                                    normativas del{' '}
                                    <strong>
                                        Instituto Nacional de Higiene "Rafael
                                        Rangel"
                                    </strong>
                                    .
                                </p>
                            </div>

                            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                                Guarde este número de ticket para cualquier
                                seguimiento técnico o comunicación posterior con
                                nuestro laboratorio.
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 pt-4 sm:gap-4">
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
                                    className="cursor-pointer rounded-xl bg-slate-100 px-6 py-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    Enviar Otro Reporte
                                </button>
                                <Link
                                    href="/"
                                    className="cursor-pointer rounded-xl bg-[#002072] px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    Ir al Inicio
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Main Form Card */
                        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10 dark:border-slate-800 dark:bg-[#0D172E]">
                            {/* Legal Notice */}
                            <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
                                <ShieldAlert className="mt-1 h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                <div className="space-y-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200/90">
                                    <h3 className="text-sm font-bold text-amber-950 dark:text-amber-300">
                                        Canal Sanitario de Notificación
                                        (Cumplimiento INH)
                                    </h3>
                                    <p>
                                        Este formulario está destinado al
                                        registro de sospechas de reacciones
                                        adversas a medicamentos (RAM), fallas de
                                        empaque o reportes de calidad por parte
                                        de pacientes, médicos o farmacéuticos
                                        para{' '}
                                        <strong>
                                            BOOZ LABORATORIO VGME, C.A.
                                        </strong>{' '}
                                        (RIF J-40906185-0).
                                    </p>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Sección 1: Datos del Medicamento */}
                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 text-xs font-bold tracking-wider text-[#002072] uppercase dark:border-slate-800 dark:text-cyan-400">
                                        1. Datos del Producto y Lote
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Producto Notificado *
                                            </label>
                                            {products.length > 0 ? (
                                                <select
                                                    value={
                                                        formData.product_name
                                                    }
                                                    onChange={(e) => {
                                                        const pName =
                                                            e.target.value;
                                                        const pObj =
                                                            products.find(
                                                                (p) =>
                                                                    p.name ===
                                                                    pName,
                                                            );
                                                        setFormData({
                                                            ...formData,
                                                            product_name: pName,
                                                            product_id: pObj
                                                                ? String(
                                                                      pObj.id,
                                                                  )
                                                                : '',
                                                        });
                                                    }}
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                >
                                                    <option value="">
                                                        Seleccione el
                                                        producto...
                                                    </option>
                                                    {products.map((p) => (
                                                        <option
                                                            key={p.id}
                                                            value={p.name}
                                                        >
                                                            {p.name} (
                                                            {p.presentation})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={
                                                        formData.product_name
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            product_name:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="Ej. Bactrocis Crema 20g"
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Número de Lote (Grabado en
                                                estuche/tubo)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.batch_number}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        batch_number:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Ej. L-202607"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 2: Evento Adverso o Queja */}
                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 text-xs font-bold tracking-wider text-[#002072] uppercase dark:border-slate-800 dark:text-cyan-400">
                                        2. Descripción del Evento Adverso o
                                        Falla
                                    </h4>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Severidad del Evento *
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Leve', 'Moderada', 'Grave'].map(
                                                (sev) => (
                                                    <button
                                                        key={sev}
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                severity: sev,
                                                            })
                                                        }
                                                        className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                                                            formData.severity ===
                                                            sev
                                                                ? sev ===
                                                                  'Grave'
                                                                    ? 'border-red-600 bg-red-600 text-white shadow-md'
                                                                    : sev ===
                                                                        'Moderada'
                                                                      ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                                                                      : 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                                                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                        }`}
                                                    >
                                                        {sev}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Detalle de la Reacción o Falla
                                            Observada *
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.adverse_reaction}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    adverse_reaction:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Describa los síntomas observados, tiempo de aparición, zona de aplicación o defecto físico detectado en el producto..."
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Sección 3: Datos del Notificante */}
                                <div className="space-y-4">
                                    <h4 className="border-b border-slate-100 pb-2 text-xs font-bold tracking-wider text-[#002072] uppercase dark:border-slate-800 dark:text-cyan-400">
                                        3. Datos del Notificante
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Tipo de Notificante *
                                            </label>
                                            <select
                                                value={formData.reporter_type}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        reporter_type:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            >
                                                <option value="Paciente">
                                                    Paciente / Familiar
                                                </option>
                                                <option value="Médico">
                                                    Médico Tratante
                                                </option>
                                                <option value="Farmacéutico">
                                                    Farmacéutico
                                                </option>
                                                <option value="Distribuidor">
                                                    Distribuidor / Droguería
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.reporter_name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        reporter_name:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Ej. Dr. Carlos Silva"
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Teléfono o Correo de Contacto *
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData.reporter_contact
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        reporter_contact:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Ej. 0414-1234567 o email@..."
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#002072] py-4 text-sm font-bold text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>
                                        {isSubmitting
                                            ? 'Registrando en Farmacovigilancia...'
                                            : 'Enviar Reporte Oficial'}
                                    </span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </BoozLayout>
    );
}
