import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    ArrowLeft,
    MessageCircle,
    AlertTriangle,
    Pill,
    Clock,
    CheckCircle2,
    Share2,
    ArrowRight,
    ShoppingBag,
    Sparkles,
    Printer,
} from 'lucide-react';
import React from 'react';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import BoozLayout from '@/layouts/booz-layout';
import { trackInteractionEvent } from '@/lib/telemetry';
import type { Product } from '@/types';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({
    product,
    relatedProducts = [],
}: ProductDetailProps) {
    const { createWhatsAppUrl } = useWhatsApp();
    const whatsappUrl = createWhatsAppUrl(
        `Hola Booz Laboratorio, estoy consultando la ficha médica de ${product.name} (${product.presentation}) y deseo recibir más información médica o disponibilidad.`,
    );

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: `${product.name} | Booz Laboratorio`,
                    text: `${product.name} - ${product.active_ingredients}. ${product.description}`,
                    url: window.location.href,
                })
                .catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('¡Enlace de la ficha médica copiado al portapapeles!');
        }
    };

    const handleAddToCart = () => {
        window.dispatchEvent(
            new CustomEvent('booz:add-to-cart', { detail: product }),
        );
    };

    const handleOpenLira = () => {
        window.dispatchEvent(new CustomEvent('booz:open-lira'));
    };

    const renderClinicalSpecs = () => (
        <div className="space-y-4">
            {/* Indicaciones */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                    Indicaciones Terapéuticas
                </h3>
                <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                    {product.indications}
                </p>
            </div>

            {/* Posología */}
            {product.posology && (
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                    <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                        <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Posología y Modo de Empleo
                    </h3>
                    <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                        {product.posology}
                    </p>
                </div>
            )}

            {/* Advertencias y Precauciones */}
            {product.contraindications && (
                <div className="space-y-2 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-amber-900/50 dark:bg-[#0D172E]">
                    <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-amber-900 uppercase dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Advertencias y Precauciones
                    </h3>
                    <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                        {product.contraindications}
                    </p>
                </div>
            )}

            {/* Reporte Sanitario Disclaimer */}
            <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-cyan-300">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-cyan-400" />
                <div>
                    <p className="font-bold">
                        Garantía Sanitaria y Farmacovigilancia
                    </p>
                    <p className="mt-0.5 text-[11px] text-blue-800 dark:text-slate-300">
                        Elaborado por{' '}
                        <strong>BOOZ LABORATORIO VGME, C.A.</strong> (Valle de
                        Guanape, Venezuela). Si experimenta alguna reacción
                        adversa, por favor notifíquelo a través de nuestro canal
                        de{' '}
                        <Link
                            href="/farmacovigilancia"
                            className="font-bold underline hover:text-cyan-400"
                        >
                            Farmacovigilancia Oficial
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <BoozLayout>
            <Head>
                <title>{`${product.name} | Ficha Médica Oficial - Booz Laboratorio`}</title>
                <meta
                    name="description"
                    content={`${product.name} - ${product.active_ingredients}. ${product.description}`}
                />
                <meta
                    property="og:title"
                    content={`${product.name} | Booz Laboratorio`}
                />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={product.image_path} />
            </Head>

            <div className="min-h-screen bg-slate-50 py-6 text-slate-900 transition-colors duration-300 sm:py-10 dark:bg-[#070C18] dark:text-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1536px] 2xl:px-12 3xl:max-w-[1840px]">
                    {/* Navigation Bar / Breadcrumb */}
                    <div className="mb-6 flex items-center justify-between sm:mb-8">
                        <Link
                            href="/#productos"
                            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:text-[#002072] dark:border-slate-800 dark:bg-[#0D172E] dark:text-slate-300 dark:hover:text-cyan-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver al Catálogo</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <a
                                href={`/producto/${product.slug}/vademecum`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-[#002072] shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0D172E] dark:text-cyan-300 dark:hover:bg-slate-800"
                                title="Descargar o imprimir Vademécum Oficial en PDF"
                            >
                                <Printer className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                                <span className="hidden sm:inline">
                                    Vademécum
                                </span>
                                <span>PDF</span>
                            </a>

                            <button
                                onClick={handleShare}
                                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition-colors hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-slate-700"
                                title="Compartir ficha de producto"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                <span>Compartir</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Product Presentation Grid */}
                    <div className="mb-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Image Showcase & Clinical Datasheet (Left Column on Desktop) */}
                        <div className="space-y-6 lg:col-span-5">
                            <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 dark:border-slate-800 dark:bg-[#0D172E]">
                                <img
                                    src={product.image_path}
                                    alt={product.name}
                                    className="h-full w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/assets/img/product_1.png';
                                    }}
                                />
                                {product.is_prescription_required ? (
                                    <span className="absolute top-4 right-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                                        Requiere Récipe Médico
                                    </span>
                                ) : (
                                    <span className="absolute top-4 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                                        Venta Libre
                                    </span>
                                )}
                            </div>

                            {/* Presentation Badge */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0D172E]">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Presentación Oficial:
                                    </span>
                                </div>
                                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-white">
                                    {product.presentation}
                                </span>
                            </div>

                            {/* En PC: Las indicaciones terapéuticas y posología ocupan el espacio libre de la izquierda */}
                            <div className="hidden lg:block">
                                {renderClinicalSpecs()}
                            </div>
                        </div>

                        {/* Commercial & Consultation Column (Right) */}
                        <div className="space-y-6 lg:col-span-7">
                            {/* Line & Code Badge (con soporte oficial Pantone 506 C) */}
                            <div className="flex items-center gap-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                                        product.product_line_id === 2
                                            ? 'border border-[#842D44]/30 bg-[#842D44]/15 text-[#842D44] dark:bg-[#842D44]/30 dark:text-rose-300'
                                            : 'border border-blue-200 bg-blue-100 text-[#002072] dark:border-blue-900 dark:bg-blue-950/60 dark:text-cyan-300'
                                    }`}
                                >
                                    {product.product_line?.name ||
                                        'Línea Terapéutica'}
                                </span>
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                    Código L{product.product_line?.code || '01'}
                                </span>
                            </div>

                            {/* Product Title & Formula */}
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                                    {product.name}
                                </h1>
                                <p className="mt-2 text-lg font-bold text-blue-700 dark:text-cyan-400">
                                    {product.active_ingredients}
                                </p>
                            </div>

                            {/* Description Box */}
                            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 shadow-xs dark:border-slate-800 dark:bg-[#0D172E]">
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                    {product.description}
                                </p>
                            </div>

                            {/* Card Comercial de Pedido y Bolsa Virtual (Llamativa y Estratégica) */}
                            <div className="relative space-y-4 overflow-hidden rounded-3xl border-2 border-blue-600/30 bg-white p-6 shadow-xl dark:border-cyan-500/30 dark:bg-[#0D172E]">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <span className="mb-0.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            Precio Referencial Vademécum
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-mono text-3xl font-black text-emerald-600 sm:text-4xl dark:text-emerald-400">
                                                $
                                                {Number(
                                                    product.price || 0,
                                                ).toFixed(2)}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                USD / unidad
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                            <span>Disponible en Planta</span>
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#002072] px-6 py-4 text-center text-sm font-black text-white shadow-xl ring-2 shadow-blue-900/25 ring-blue-400/20 transition-all hover:bg-blue-800 hover:shadow-2xl hover:shadow-blue-900/40 active:scale-[0.98] sm:text-base dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    <ShoppingBag className="h-5 w-5 text-cyan-300 transition-transform group-hover:scale-110 sm:h-6 sm:w-6" />
                                    <span>Añadir a la Bolsa de Pedidos</span>
                                </button>

                                <a
                                    href={`/producto/${product.slug}/vademecum`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-[#002072] shadow-sm transition-all hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-cyan-300 dark:hover:bg-slate-800"
                                >
                                    <Printer className="h-4 w-4 text-blue-600 transition-transform group-hover:scale-110 dark:text-cyan-400" />
                                    <span>
                                        Descargar Ficha Técnica & Vademécum (PDF
                                        Oficial)
                                    </span>
                                </a>

                                <p className="text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                                    Al añadir a la bolsa podrás seleccionar tu
                                    tipo de solicitante (Paciente, Farmacia o
                                    Clínica) y tramitar la cotización formal por
                                    WhatsApp.
                                </p>
                            </div>

                            {/* Tarjeta Dual: Orientación Farmacéutica con Lira AI & Canal WhatsApp */}
                            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#0D172E]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-cyan-400">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                                Orientación Científica &
                                                Atención Directa
                                            </h3>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                Consulta 24/7 con Lira AI o
                                                enlace directo con nuestra
                                                regencia farmacéutica
                                            </p>
                                        </div>
                                    </div>
                                    <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 uppercase sm:inline-block dark:border-blue-800 dark:bg-blue-950/60 dark:text-cyan-300">
                                        Canales Oficiales
                                    </span>
                                </div>

                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                    ¿Deseas conocer más sobre el uso de{' '}
                                    <strong>{product.name}</strong>,
                                    interacciones o condiciones comerciales para
                                    farmacias y clínicas? Elige tu canal
                                    preferido:
                                </p>

                                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                                    {/* Botón Lira AI */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            trackInteractionEvent(
                                                'lira_open',
                                                'lira_ai',
                                                'pdp_dual_card',
                                                product.id,
                                                { product_name: product.name },
                                            );
                                            handleOpenLira();
                                        }}
                                        className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-br from-[#002072] to-blue-800 p-3.5 text-left text-white shadow-md transition-all hover:from-blue-900 hover:to-blue-950 hover:shadow-lg active:scale-[0.98] dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600"
                                        title="Abrir asistente virtual Lira AI"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-cyan-300 bg-gradient-to-b from-white via-white to-blue-50 p-0.5 shadow-md ring-2 ring-white/40 transition-transform group-hover:scale-110">
                                            <img
                                                src="/assets/img/lira_avatar_animated.gif"
                                                alt="Lira AI"
                                                className="h-full w-full rounded-lg object-cover"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLElement
                                                    ).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className="block flex items-center gap-1 text-xs leading-tight font-bold">
                                                Consultar a Lira AI
                                                <Sparkles className="h-3 w-3 text-cyan-300" />
                                            </span>
                                            <span className="mt-0.5 block text-[10px] text-blue-200 dark:text-blue-100">
                                                Respuesta clínica 24/7
                                            </span>
                                        </div>
                                    </button>

                                    {/* Botón WhatsApp */}
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => {
                                            trackInteractionEvent(
                                                'whatsapp_click',
                                                'whatsapp',
                                                'pdp_dual_card',
                                                product.id,
                                                { product_name: product.name },
                                            );
                                        }}
                                        className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-emerald-600 p-3.5 text-left text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
                                        title="Contactar al equipo por WhatsApp"
                                    >
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 transition-transform group-hover:scale-110">
                                            <MessageCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="block text-xs leading-tight font-bold">
                                                Atención por WhatsApp
                                            </span>
                                            <span className="mt-0.5 block text-[10px] text-emerald-100">
                                                Ventas y regencia en vivo
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* En móvil: Indicaciones y Posología se muestran aquí al final */}
                            <div className="block lg:hidden">
                                {renderClinicalSpecs()}
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-cyan-400">
                                        Misma Línea Terapéutica
                                    </span>
                                    <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                                        Otros productos relacionados
                                    </h2>
                                </div>
                                <Link
                                    href="/#productos"
                                    className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline dark:text-cyan-400"
                                >
                                    <span>Ver catálogo completo</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedProducts.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/producto/${rel.slug}`}
                                        className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#0D172E] dark:hover:border-cyan-500"
                                    >
                                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-2 transition-transform group-hover:scale-105 dark:bg-slate-800/60">
                                            <img
                                                src={rel.image_path}
                                                alt={rel.name}
                                                className="h-full w-full object-contain"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        '/assets/img/product_1.png';
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                                                {rel.presentation}
                                            </span>
                                            <h4 className="line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-300">
                                                {rel.name}
                                            </h4>
                                            <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                                {rel.active_ingredients}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BoozLayout>
    );
}
