import { Head, Link } from '@inertiajs/react';
import { Clock, ArrowRight } from 'lucide-react';
import BoozLayout from '@/layouts/booz-layout';

const MOCK_POSTS = [
    {
        slug: 'importancia-vitamina-c-topica',
        title: 'La Ciencia detrás de la Vitamina C Tópica Estabilizada',
        excerpt:
            'Análisis de la biodisponibilidad del ácido L-ascórbico y su papel crucial en la síntesis de colágeno y fotoprotección celular.',
        category: 'Dermatología Molecular',
        date: '12 Feb, 2026',
        readTime: '5 min',
        image: 'https://placehold.co/800x600/e2e8f0/004aad?text=Vitamina+C+Moleculas',
    },
    {
        slug: 'nuevos-protocolos-acne',
        title: 'Actualización en Protocolos de Acné Inflamatorio',
        excerpt:
            'Revisión de las últimas guías clínicas para el manejo del acné resistente a terapias convencionales mediante combinaciones sinérgicas.',
        category: 'Práctica Clínica',
        date: '08 Feb, 2026',
        readTime: '7 min',
        image: 'https://placehold.co/800x600/e2e8f0/004aad?text=Protocolos+Acne',
    },
    {
        slug: 'microbioma-cutaneo',
        title: 'El Microbioma Cutáneo: La Nueva Frontera',
        excerpt:
            'Cómo los prebióticos y postbióticos están redefiniendo las estrategias terapéuticas para la dermatitis atópica y la rosácea.',
        category: 'Investigación',
        date: '25 Ene, 2026',
        readTime: '6 min',
        image: 'https://placehold.co/800x600/e2e8f0/004aad?text=Microbioma',
    },
];

export default function BlogIndex() {
    return (
        <BoozLayout>
            <Head title="Ciencia de la Piel - Blog" />

            <header className="relative overflow-hidden bg-slate-900 py-20 text-white">
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">
                        Publicaciones Científicas
                    </span>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
                        Ciencia de la{' '}
                        <span className="text-cyan-400">Piel</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-slate-300">
                        Artículos técnicos, revisiones de literatura y novedades
                        en farmacología dermatológica para el profesional
                        moderno.
                    </p>
                </div>
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(#3b82f6 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                ></div>
            </header>

            <section className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {MOCK_POSTS.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-8">
                                    <div className="mb-4 flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="rounded bg-blue-50 px-2 py-1 tracking-wider text-blue-600 uppercase">
                                            {post.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />{' '}
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-xl leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                        {post.title}
                                    </h3>
                                    <p className="flex-1 text-sm leading-relaxed text-slate-600">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                        <span className="text-xs font-bold text-slate-400">
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-all group-hover:gap-3">
                                            Leer Artículo{' '}
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </BoozLayout>
    );
}
