import { Head } from '@inertiajs/react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import BoozLayout from '@/layouts/booz-layout';

const MOCK_GLOSSARY = [
    {
        term: 'Biodisponibilidad',
        definition:
            'Fracción de la dosis administrada de un fármaco que llega a la circulación sistémica de forma inalterada.',
    },
    {
        term: 'Eritema',
        definition:
            'Enrojecimiento de la piel debido a procesos inflamatorios o inmunológicos.',
    },
    {
        term: 'Farmacocinética',
        definition:
            'Estudio de los procesos de absorción, distribución, metabolismo y excreción (ADME) de un fármaco.',
    },
    {
        term: 'Lincosamida',
        definition:
            'Clase de antibióticos que inhiben la síntesis proteica bacteriana (ej. Clindamicina).',
    },
    {
        term: 'Pápula',
        definition:
            'Elevación sólida y circunscrita de la piel, generalmente de menos de 1 cm de diámetro.',
    },
    {
        term: 'Teratogénico',
        definition:
            'Sustancia capaz de provocar malformaciones congénitas durante el desarrollo embrionario.',
    },
];

export default function Glossary() {
    const [search, setSearch] = useState('');
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const filteredTerms = MOCK_GLOSSARY.filter((item) => {
        const matchesSearch = item.term
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesLetter = selectedLetter
            ? item.term.startsWith(selectedLetter)
            : true;
        return matchesSearch && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));

    return (
        <BoozLayout>
            <Head title="Glosario Farmacéutico" />

            <header className="border-b border-slate-200 bg-slate-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900">
                                <BookOpen className="text-blue-600" />
                                Glosario Técnico
                            </h1>
                            <p className="mt-2 text-lg text-slate-600">
                                Terminología científica y farmacológica para
                                profesionales.
                            </p>
                        </div>

                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar término..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border-slate-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                    </div>

                    {/* Alphabet Filter */}
                    <div className="mt-10 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedLetter(null)}
                            className={`rounded-lg px-3 py-1 text-sm font-bold transition-all ${!selectedLetter ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                        >
                            Todos
                        </button>
                        {alphabet.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => setSelectedLetter(letter)}
                                className={`rounded-lg px-3 py-1 text-sm font-bold transition-all ${selectedLetter === letter ? 'bg-blue-600 text-white' : 'border border-slate-100 bg-white text-slate-500 hover:bg-slate-100'}`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {filteredTerms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTerms.map((item) => (
                                <div
                                    key={item.term}
                                    className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                            {item.term}
                                        </h3>
                                        <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        {item.definition}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                No se encontraron términos
                            </h3>
                            <p className="text-slate-500">
                                Intenta con otra palabra o letra.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </BoozLayout>
    );
}
