import { Head, Link } from '@inertiajs/react';
import { Clock, ArrowLeft, Share2, Printer } from 'lucide-react';
import BoozLayout from '@/layouts/booz-layout';

export default function BlogPost({ slug }: { slug: string }) {
    // Mock data based on slug (in a real app, this would come from the backend)
    const post = {
        title: 'La Ciencia detrás de la Vitamina C Tópica Estabilizada',
        category: 'Dermatología Molecular',
        date: '12 Feb, 2026',
        readTime: '5 min',
        author: 'Dr. Roberto Méndez',
        authorRole: 'Director Científico',
        image: 'https://placehold.co/1200x600/e2e8f0/004aad?text=Vitamina+C+Moleculas',
        content: `
            <p class="lead">El ácido L-ascórbico es el antioxidante más abundante en la piel humana, pero su inestabilidad química ha sido históricamente un desafío para la formulación tópica.</p>
            
            <h2>Mecanismo de Acción</h2>
            <p>La vitamina C actúa como un cofactor esencial para las enzimas lisil y prolil hidroxilasas, que son necesarias para estabilizar la estructura de triple hélice del colágeno. Además, su capacidad para neutralizar especies reactivas de oxígeno (ROS) la convierte en una primera línea de defensa contra el fotoenvejecimiento.</p>
            
            <blockquote>
                "La estabilización del pH por debajo de 3.5 es crítica para asegurar la penetración percutánea del ácido ascórbico libre."
            </blockquote>

            <h2>Desafíos de Estabilidad</h2>
            <p>En solución acuosa, la vitamina C se oxida rápidamente a ácido dehidroascórbico, perdiendo su eficacia y cambiando de color. En Booz Clinical, utilizamos una tecnología de microencapsulación que protege la molécula hasta su liberación en el estrato córneo.</p>

            <h2>Evidencia Clínica</h2>
            <p>Estudios doble ciego han demostrado que la aplicación tópica diaria de vitamina C al 15% durante 12 semanas reduce significativamente la profundidad de las arrugas y mejora la luminosidad global de la piel.</p>
        `
    };

    return (
        <BoozLayout>
            <Head title={post.title} />
            
            <article className="bg-white min-h-screen pb-24">
                {/* Hero / Header */}
                <div className="relative h-[60vh] bg-slate-900 w-full overflow-hidden">
                    <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                        <div className="mx-auto max-w-4xl">
                            <Link href="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Blog
                            </Link>
                            <div className="flex items-center gap-4 text-sm font-bold text-blue-200 mb-4 uppercase tracking-wider">
                                <span className="bg-blue-600/20 border border-blue-500/50 px-3 py-1 rounded">{post.category}</span>
                                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white border-2 border-slate-900">
                                    RM
                                </div>
                                <div>
                                    <div className="font-bold text-white">{post.author}</div>
                                    <div className="text-xs opacity-70">{post.authorRole}</div>
                                </div>
                                <span className="mx-2 text-slate-600">•</span>
                                <span>{post.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-3xl px-6 -mt-10 relative z-10">
                    <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-slate-100">
                        <div className="flex justify-end gap-4 mb-8 border-b border-slate-100 pb-8">
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                <Share2 className="h-4 w-4" /> Compartir
                            </button>
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                <Printer className="h-4 w-4" /> Imprimir
                            </button>
                        </div>

                        <div 
                            className="prose prose-lg prose-slate prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-blockquote:border-l-blue-600 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            </article>
        </BoozLayout>
    );
}
