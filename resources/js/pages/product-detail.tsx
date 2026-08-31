import { Head, Link } from '@inertiajs/react';
import { 
    ShieldCheck, ArrowLeft, MessageCircle, AlertTriangle, 
    Pill, Clock, CheckCircle2, Share2, ArrowRight, ShoppingBag, Sparkles, Printer, FileText, Download
} from 'lucide-react';
import React from 'react';
import BoozLayout from '@/layouts/booz-layout';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { trackInteractionEvent } from '@/lib/telemetry';
import type { Product } from '@/types';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
    const { createWhatsAppUrl } = useWhatsApp();
    const whatsappUrl = createWhatsAppUrl(
        `Hola Booz Laboratorio, estoy consultando la ficha médica de ${product.name} (${product.presentation}) y deseo recibir más información médica o disponibilidad.`
    );

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${product.name} | Booz Laboratorio`,
                text: `${product.name} - ${product.active_ingredients}. ${product.description}`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('¡Enlace de la ficha médica copiado al portapapeles!');
        }
    };

    const handleAddToCart = () => {
        window.dispatchEvent(new CustomEvent('booz:add-to-cart', { detail: product }));
    };

    const handleOpenLira = () => {
        window.dispatchEvent(new CustomEvent('booz:open-lira'));
    };

    const renderClinicalSpecs = () => (
        <div className="space-y-4">
            {/* Indicaciones */}
            <div className="bg-white dark:bg-[#0D172E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                    Indicaciones Terapéuticas
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {product.indications}
                </p>
            </div>

            {/* Posología */}
            {product.posology && (
                <div className="bg-white dark:bg-[#0D172E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Posología y Modo de Empleo
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {product.posology}
                    </p>
                </div>
            )}

            {/* Advertencias y Precauciones */}
            {product.contraindications && (
                <div className="bg-white dark:bg-[#0D172E] p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Advertencias y Precauciones
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {product.contraindications}
                    </p>
                </div>
            )}

            {/* Reporte Sanitario Disclaimer */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-cyan-300 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold">Garantía Sanitaria y Farmacovigilancia</p>
                    <p className="text-[11px] text-blue-800 dark:text-slate-300 mt-0.5">
                        Elaborado por <strong>BOOZ LABORATORIO VGME, C.A.</strong> (Valle de Guanape, Venezuela). Si experimenta alguna reacción adversa, por favor notifíquelo a través de nuestro canal de <Link href="/farmacovigilancia" className="underline font-bold hover:text-cyan-400">Farmacovigilancia Oficial</Link>.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <BoozLayout>
            <Head>
                <title>{`${product.name} | Ficha Médica Oficial - Booz Laboratorio`}</title>
                <meta name="description" content={`${product.name} - ${product.active_ingredients}. ${product.description}`} />
                <meta property="og:title" content={`${product.name} | Booz Laboratorio`} />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={product.image_path} />
            </Head>

            <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 transition-colors duration-300 py-6 sm:py-10">
                <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] px-4 sm:px-6 lg:px-8 2xl:px-12">
                    {/* Navigation Bar / Breadcrumb */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <Link
                            href="/#productos"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#002072] dark:hover:text-cyan-400 transition-colors bg-white dark:bg-[#0D172E] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[40px]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver al Catálogo</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <a
                                href={`/producto/${product.slug}/vademecum`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002072] dark:text-cyan-300 bg-white dark:bg-[#0D172E] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm min-h-[40px] cursor-pointer"
                                title="Descargar o imprimir Vademécum Oficial en PDF"
                            >
                                <Printer className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                                <span className="hidden sm:inline">Vademécum</span>
                                <span>PDF</span>
                            </a>

                            <button
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors shadow-sm min-h-[40px] cursor-pointer"
                                title="Compartir ficha de producto"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                <span>Compartir</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Product Presentation Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
                        {/* Image Showcase & Clinical Datasheet (Left Column on Desktop) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="aspect-square rounded-3xl bg-white dark:bg-[#0D172E] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center relative overflow-hidden group">
                                <img
                                    src={product.image_path}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                    }}
                                />
                                {product.is_prescription_required ? (
                                    <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-md">
                                        Requiere Récipe Médico
                                    </span>
                                ) : (
                                    <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                                        Venta Libre
                                    </span>
                                )}
                            </div>

                            {/* Presentation Badge */}
                            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Presentación Oficial:</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                    {product.presentation}
                                </span>
                            </div>

                            {/* En PC: Las indicaciones terapéuticas y posología ocupan el espacio libre de la izquierda */}
                            <div className="hidden lg:block">
                                {renderClinicalSpecs()}
                            </div>
                        </div>

                        {/* Commercial & Consultation Column (Right) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Line & Code Badge (con soporte oficial Pantone 506 C) */}
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    product.product_line_id === 2
                                        ? 'bg-[#842D44]/15 text-[#842D44] dark:bg-[#842D44]/30 dark:text-rose-300 border border-[#842D44]/30'
                                        : 'bg-blue-100 text-[#002072] dark:bg-blue-950/60 dark:text-cyan-300 border border-blue-200 dark:border-blue-900'
                                }`}>
                                    {product.product_line?.name || 'Línea Terapéutica'}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    Código L{product.product_line?.code || '01'}
                                </span>
                            </div>

                            {/* Product Title & Formula */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                                    {product.name}
                                </h1>
                                <p className="text-lg font-bold text-blue-700 dark:text-cyan-400 mt-2">
                                    {product.active_ingredients}
                                </p>
                            </div>

                            {/* Description Box */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D172E] border-l-4 border-[#002072] dark:border-cyan-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Card Comercial de Pedido y Bolsa Virtual (Llamativa y Estratégica) */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D172E] border-2 border-blue-600/30 dark:border-cyan-500/30 shadow-xl space-y-4 relative overflow-hidden">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
                                            Precio Referencial Vademécum
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                                ${Number(product.price || 0).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                USD / unidad
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>Disponible en Planta</span>
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="w-full py-4 px-6 rounded-2xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-black text-sm sm:text-base text-center flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/25 hover:shadow-2xl hover:shadow-blue-900/40 cursor-pointer group ring-2 ring-blue-400/20"
                                >
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-300 group-hover:scale-110 transition-transform" />
                                    <span>Añadir a la Bolsa de Pedidos</span>
                                </button>

                                <a
                                    href={`/producto/${product.slug}/vademecum`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-[#002072] dark:text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm group"
                                >
                                    <Printer className="h-4 w-4 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span>Descargar Ficha Técnica & Vademécum (PDF Oficial)</span>
                                </a>

                                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                                    Al añadir a la bolsa podrás seleccionar tu tipo de solicitante (Paciente, Farmacia o Clínica) y tramitar la cotización formal por WhatsApp.
                                </p>
                            </div>

                            {/* Tarjeta Dual: Orientación Farmacéutica con Lira AI & Canal WhatsApp */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                                Orientación Científica & Atención Directa
                                            </h3>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                Consulta 24/7 con Lira AI o enlace directo con nuestra regencia farmacéutica
                                            </p>
                                        </div>
                                    </div>
                                    <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full">
                                        Canales Oficiales
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    ¿Deseas conocer más sobre el uso de <strong>{product.name}</strong>, interacciones o condiciones comerciales para farmacias y clínicas? Elige tu canal preferido:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {/* Botón Lira AI */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            trackInteractionEvent('lira_open', 'lira_ai', 'pdp_dual_card', product.id, { product_name: product.name });
                                            handleOpenLira();
                                        }}
                                        className="p-3.5 rounded-2xl bg-gradient-to-br from-[#002072] to-blue-800 hover:from-blue-900 hover:to-blue-950 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white flex items-center gap-3 shadow-md hover:shadow-lg transition-all text-left cursor-pointer group active:scale-[0.98]"
                                        title="Abrir asistente virtual Lira AI"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-b from-white via-white to-blue-50 border-2 border-cyan-300 shadow-md p-0.5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden ring-2 ring-white/40">
                                            <img
                                                src="/assets/img/lira_avatar_animated.gif"
                                                alt="Lira AI"
                                                className="h-full w-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold leading-tight flex items-center gap-1">
                                                Consultar a Lira AI
                                                <Sparkles className="h-3 w-3 text-cyan-300" />
                                            </span>
                                            <span className="block text-[10px] text-blue-200 dark:text-blue-100 mt-0.5">
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
                                            trackInteractionEvent('whatsapp_click', 'whatsapp', 'pdp_dual_card', product.id, { product_name: product.name });
                                        }}
                                        className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white flex items-center gap-3 shadow-md hover:shadow-lg transition-all text-left cursor-pointer group"
                                        title="Contactar al equipo por WhatsApp"
                                    >
                                        <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <MessageCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold leading-tight">
                                                Atención por WhatsApp
                                            </span>
                                            <span className="block text-[10px] text-emerald-100 mt-0.5">
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
                        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                                        Misma Línea Terapéutica
                                    </span>
                                    <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                                        Otros productos relacionados
                                    </h2>
                                </div>
                                <Link
                                    href="/#productos"
                                    className="text-xs font-bold text-blue-700 dark:text-cyan-400 hover:underline flex items-center gap-1"
                                >
                                    <span>Ver catálogo completo</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedProducts.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/producto/${rel.slug}`}
                                        className="bg-white dark:bg-[#0D172E] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-cyan-500 transition-all flex gap-4 items-center group"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <img
                                                src={rel.image_path}
                                                alt={rel.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/assets/img/product_1.png';
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block">
                                                {rel.presentation}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                {rel.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
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
