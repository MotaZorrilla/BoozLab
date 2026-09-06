import { Head, Link } from '@inertiajs/react';
import { Clock, ArrowRight } from 'lucide-react';
import BoozLayout from '@/layouts/booz-layout';

const MOCK_POSTS = [
    {
        slug: 'importancia-vitamina-c-topica',
        title: 'La Ciencia detrás de la Vitamina C Tópica Estabilizada',
        excerpt: 'Análisis de la biodisponibilidad del ácido L-ascórbico y su papel crucial en la síntesis de colágeno y fotoprotección celular.',
        category: 'Dermatología Molecular',
        date: '12 Feb, 2026',
        readTime: '5 min',
        image: 'https://placehold.co/800x600/e2e8f0/004aad?text=Vitamina+C+Moleculas'
    },
    {
        slug: 'nuevos-protocolos-acne',
        title: 'Actualización en Protocolos de Acné Inflamatorio',
        excerpt: 'Revisión de las últimas guías clínicas para el manejo del acné resistente a terapias convencionales mediante combinaciones sinérgicas.',
        category: 'Práctica Clínica',
        date: '08 Feb, 2026',
        readTime: '7 min',
        image: 'https://placehold.co/800x600/e2e8f0/004aad?text=Protocolos+Acne'
    },
    {
        slug: 'microbioma-cutaneo',
        title: 'El Microbioma Cutáneo: La Nueva Frontera',
        excerpt: 'Cómo los prebióticos y postbióticos están redefiniendo las estrategias terapéuticas para la dermatitis atópica y la rosácea.',
        category: 'Investigación',
        date: '25 Ene, 2026',
        readTime: '6 min',
        image: 'https://placehold.co/800x600/e2e8f0/004aad?text=Microbioma'
    }
];

export default function BlogIndex() {
    return (
        <BoozLayout>
            <Head title="Ciencia de la Piel - Blog" />
            
            <header className="bg-slate-900 py-20 text-white relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">Publicaciones Científicas</span>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
                        Ciencia de la <span className="text-cyan-400">Piel</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-slate-300">
                        Artículos técnicos, revisiones de literatura y novedades en farmacología dermatológica para el profesional moderno.
                    </p>
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            </header>

            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {MOCK_POSTS.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                                <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 p-8 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{post.category}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400">{post.date}</span>
                                        <span className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
                                            Leer Artículo <ArrowRight className="h-4 w-4" />
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
