import { Link } from '@inertiajs/react';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 bg-white dark:bg-[#0A1124] text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2.5">
                {/* Enlace al Portal Público de Booz */}
                <Link
                    href="/"
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Ver Portal Público de Booz Laboratorio"
                >
                    <span>Portal Público</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>

                {/* Botón de Claro / Oscuro con consistencia global */}
                <button
                    onClick={toggleTheme}
                    type="button"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px] focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label={`Cambiar a modo ${resolvedAppearance === 'dark' ? 'claro' : 'oscuro'}`}
                    title={resolvedAppearance === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                >
                    {resolvedAppearance === 'dark' ? (
                        <Sun className="h-4 w-4 text-amber-400" />
                    ) : (
                        <Moon className="h-4 w-4 text-[#002072]" />
                    )}
                </button>
            </div>
        </header>
    );
}
