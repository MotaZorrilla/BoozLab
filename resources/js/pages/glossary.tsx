import BoozLayout from '@/layouts/booz-layout';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

const MOCK_GLOSSARY = [
    { term: 'Biodisponibilidad', definition: 'Fracción de la dosis administrada de un fármaco que llega a la circulación sistémica de forma inalterada.' },
    { term: 'Eritema', definition: 'Enrojecimiento de la piel debido a procesos inflamatorios o inmunológicos.' },
    { term: 'Farmacocinética', definition: 'Estudio de los procesos de absorción, distribución, metabolismo y excreción (ADME) de un fármaco.' },
    { term: 'Lincosamida', definition: 'Clase de antibióticos que inhiben la síntesis proteica bacteriana (ej. Clindamicina).' },
    { term: 'Pápula', definition: 'Elevación sólida y circunscrita de la piel, generalmente de menos de 1 cm de diámetro.' },
    { term: 'Teratogénico', definition: 'Sustancia capaz de provocar malformaciones congénitas durante el desarrollo embrionario.' },
];

export default function Glossary() {
    const [search, setSearch] = useState('');
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const filteredTerms = useMemo(() => {
        return MOCK_GLOSSARY.filter(item => {
            const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase());
            const matchesLetter = selectedLetter ? item.term.startsWith(selectedLetter) : true;
            return matchesSearch && matchesLetter;
        }).sort((a, b) => a.term.localeCompare(b.term));
    }, [search, selectedLetter]);

    return (
        <BoozLayout>
            <Head title="Glosario Farmacéutico" />
            
            <header className="bg-slate-50 py-16 border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
                                <BookOpen className="text-blue-600" />
                                Glosario Técnico
                            </h1>
                            <p className="mt-2 text-lg text-slate-600">
                                Terminología científica y farmacológica para profesionales.
                            </p>
                        </div>
                        
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <input 
                                type="text"
                                placeholder="Buscar término..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-white pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Alphabet Filter */}
                    <div className="mt-10 flex flex-wrap gap-2">
                        <button 
                            onClick={() => setSelectedLetter(null)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${!selectedLetter ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                        >
                            Todos
                        </button>
                        {alphabet.map(letter => (
                            <button 
                                key={letter}
                                onClick={() => setSelectedLetter(letter)}
                                className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${selectedLetter === letter ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {filteredTerms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTerms.map((item) => (
                                <div key={item.term} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.term}</h3>
                                        <ChevronRight className="text-slate-300 group-hover:text-blue-400 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {item.definition}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No se encontraron términos</h3>
                            <p className="text-slate-500">Intenta con otra palabra o letra.</p>
                        </div>
                    )}
                </div>
            </section>
        </BoozLayout>
    );
}
