import { Head, Link } from '@inertiajs/react';
import { 
    ShieldCheck, ArrowLeft, MessageCircle, AlertTriangle, 
    Pill, Clock, CheckCircle2, Share2, ArrowRight
} from 'lucide-react';
import React from 'react';
import BoozLayout from '@/layouts/booz-layout';
import type { Product } from '@/types';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
    const whatsappUrl = `https://wa.me/584148873615?text=${encodeURIComponent(
        `Hola Booz Laboratorio, estoy consultando la ficha médica de ${product.name} (${product.presentation}) y deseo recibir más información médica o disponibilidad.`
    )}`;

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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Navigation Bar / Breadcrumb */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <Link
                            href="/#productos"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#002072] dark:hover:text-cyan-400 transition-colors bg-white dark:bg-[#0D172E] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[40px]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver al Catálogo</span>
                        </Link>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors shadow-sm min-h-[40px] cursor-pointer"
                            title="Compartir ficha de producto"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Compartir</span>
                        </button>
                    </div>

                    {/* Main Product Presentation Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
                        {/* Image Showcase (Left) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28">
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
                            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-[#0D172E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Presentación Oficial:</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                    {product.presentation}
                                </span>
                            </div>
                        </div>

                        {/* Clinical Datasheet (Right) */}
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

                            {/* WhatsApp Direct CTA Button */}
                            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-6 w-6" />
                                        <h3 className="font-bold text-base">Atención Médica y Farmacias Aliadas</h3>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-md">Canal Directo</span>
                                </div>
                                <p className="text-xs text-emerald-50 leading-relaxed">
                                    ¿Deseas consultar sobre disponibilidad, dosificación o puntos de distribución autorizados de <strong>{product.name}</strong>? Nuestro equipo farmacéutico te atiende de inmediato.
                                </p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 px-6 rounded-xl bg-white text-emerald-900 font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                                >
                                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                                    <span>Consultar sobre {product.name} vía WhatsApp</span>
                                </a>
                            </div>

                            {/* Technical Clinical Sections */}
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
