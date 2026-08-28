import BoozLayout from '@/layouts/booz-layout';
import { Head, Link } from '@inertiajs/react';
import type { Product } from '@/types';
import { 
    ShieldCheck, ArrowLeft, MessageCircle, AlertTriangle, 
    Pill, Clock, FileText, CheckCircle2, Share2, Sparkles, ArrowRight
} from 'lucide-react';
import React from 'react';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
    const whatsappUrl = `https://wa.me/584148873615?text=${encodeURIComponent(
        `Hola Booz Laboratorio, estoy consultando la ficha de ${product.name} (${product.presentation}) y deseo recibir más información médica o disponibilidad.`
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

            <div className="bg-slate-50 min-h-screen py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Navigation Bar / Breadcrumb */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            href="/#productos"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver al Catálogo</span>
                        </Link>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm"
                            title="Compartir ficha de producto"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Compartir</span>
                        </button>
                    </div>

                    {/* Main Product Presentation Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                        {/* Image Showcase (Left) */}
                        <div className="lg:col-span-5 sticky top-28">
                            <div className="aspect-square rounded-3xl bg-white p-8 border border-slate-200 shadow-xl flex items-center justify-center relative overflow-hidden group">
                                <img
                                    src={product.image_path}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
                            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-blue-600" />
                                    <span className="text-xs font-semibold text-slate-700">Presentación Oficial:</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                                    {product.presentation}
                                </span>
                            </div>
                        </div>

                        {/* Clinical Datasheet (Right) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Line & Code */}
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                                    {product.product_line?.name || 'Línea Terapéutica'}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Código L{product.product_line?.code || '01'}
                                </span>
                            </div>

                            {/* Product Title & Formula */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                                    {product.name}
                                </h1>
                                <p className="text-lg font-bold text-blue-700 mt-2">
                                    {product.active_ingredients}
                                </p>
                            </div>

                            {/* Description / Summary */}
                            <div className="p-5 rounded-2xl bg-white border-l-4 border-blue-900 border-slate-200 shadow-sm">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* WhatsApp Direct CTA Button (Requisito Específico del Usuario) */}
                            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-6 w-6" />
                                        <h3 className="font-bold text-base">Atención Médica y Farmacias Aliadas</h3>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-md">Directo</span>
                                </div>
                                <p className="text-xs text-emerald-50 leading-relaxed">
                                    ¿Deseas consultar sobre disponibilidad, dosificación o puntos de distribución autorizados de <strong>{product.name}</strong>? Nuestro equipo farmacéutico te atiende de inmediato.
                                </p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 px-6 rounded-xl bg-white text-emerald-900 font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-md"
                                >
                                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                                    <span>Consultar sobre {product.name} vía WhatsApp</span>
                                </a>
                            </div>

                            {/* Technical Clinical Sections */}
                            <div className="space-y-4">
                                {/* Indicaciones */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                        Indicaciones Terapéuticas
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                        {product.indications}
                                    </p>
                                </div>

                                {/* Posología */}
                                {product.posology && (
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-indigo-600" />
                                            Posología y Modo de Empleo
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                            {product.posology}
                                        </p>
                                    </div>
                                )}

                                {/* Contraindicaciones y Precauciones */}
                                {product.contraindications && (
                                    <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-2 bg-gradient-to-r from-white to-amber-50/30">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                                            Advertencias y Precauciones
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                            {product.contraindications}
                                        </p>
                                    </div>
                                )}

                                {/* Reporte Sanitario Disclaimer */}
                                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                                    <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Garantía Sanitaria y Farmacovigilancia</p>
                                        <p className="text-[11px] text-blue-800 mt-0.5">
                                            Elaborado por <strong>BOOZ LABORATORIO VGME, C.A.</strong> (Valle de Guanape, Venezuela). Si experimenta alguna reacción adversa, por favor notifíquelo a través de nuestro canal de <Link href="/farmacovigilancia" className="underline font-bold">Farmacovigilancia Oficial</Link>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================
                        Related Products Section (Requisito Específico)
                    ======================================================== */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-20 pt-12 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                        Misma Línea Terapéutica
                                    </span>
                                    <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                                        Otros productos relacionados
                                    </h2>
                                </div>
                                <Link
                                    href="/#productos"
                                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
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
                                        className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex gap-4 items-center group"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
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
                                            <span className="text-[10px] font-bold text-blue-600 block">
                                                {rel.presentation}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                                                {rel.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 line-clamp-1">
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
