import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Pill,
    ShieldAlert,
    MessageSquare,
    TrendingUp,
    Users,
    Bot,
    Settings,
    Globe,
    FileText,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

interface ExtendedNavItem extends NavItem {
    badge?: number | string;
    badgeVariant?: 'default' | 'amber' | 'rose';
    roles?: string[];
}

export function AppSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const pageProps = usePage().props as any;

    const currentUserRole = pageProps.auth?.user?.role || 'super_admin';
    const isSuperAdmin = currentUserRole === 'super_admin' || !!pageProps.auth?.user?.is_admin;
    const pendingReports = pageProps.stats?.pending_reports || 0;
    const pendingMessages = pageProps.stats?.pending_messages || 0;

    const navigationGroups = useMemo(() => [
        {
            label: 'Consola Central',
            items: [
                {
                    title: 'Consola Principal',
                    href: '/dashboard',
                    icon: LayoutDashboard,
                    roles: ['super_admin', 'director_tecnico', 'gestor_comercial', 'oficial_farmacovigilancia'],
                },
            ],
        },
        {
            label: 'Operaciones',
            items: [
                {
                    title: 'Gestión de Catálogo',
                    href: '/admin/products',
                    icon: Pill,
                    roles: ['super_admin', 'director_tecnico', 'gestor_comercial'],
                },
                {
                    title: 'Farmacovigilancia INH',
                    href: '/admin/reports',
                    icon: ShieldAlert,
                    badge: pendingReports > 0 ? pendingReports : undefined,
                    badgeVariant: 'amber' as const,
                    roles: ['super_admin', 'director_tecnico', 'oficial_farmacovigilancia'],
                },
                {
                    title: 'Bandeja de Mensajes',
                    href: '/admin/messages',
                    icon: MessageSquare,
                    badge: pendingMessages > 0 ? pendingMessages : undefined,
                    badgeVariant: 'rose' as const,
                    roles: ['super_admin', 'gestor_comercial'],
                },
                {
                    title: 'Analítica & Cotizaciones',
                    href: '/admin/quotes',
                    icon: TrendingUp,
                    roles: ['super_admin', 'gestor_comercial'],
                },
            ],
        },
        {
            label: 'Sistema & Control',
            items: [
                {
                    title: 'Usuarios & Roles',
                    href: '/admin/users',
                    icon: Users,
                    roles: ['super_admin'],
                },
                {
                    title: 'Inteligencia Artificial',
                    href: '/admin/ai',
                    icon: Bot,
                    roles: ['super_admin'],
                },
                {
                    title: 'Ajustes & WhatsApp',
                    href: '/admin/settings',
                    icon: Settings,
                    roles: ['super_admin'],
                },
            ],
        },
    ], [pendingReports, pendingMessages]);

    const footerNavItems: NavItem[] = [
        { title: 'Portal Web Público', href: '/', icon: Globe },
        { title: 'Farmacovigilancia INH', href: '/farmacovigilancia', icon: ShieldAlert },
        { title: 'Vademécum & Fórmulas', href: '/herramientas', icon: FileText },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navigationGroups.map((group) => {
                    const filteredItems = group.items.filter(
                        (item) => isSuperAdmin || !item.roles || item.roles.includes(currentUserRole)
                    );

                    if (filteredItems.length === 0) return null;

                    return (
                        <SidebarGroup key={group.label} className="px-2 py-1">
                            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {filteredItems.map((item) => {
                                        const active = isCurrentUrl(item.href);
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={active}
                                                    tooltip={{ children: item.title }}
                                                    className={active ? 'bg-[#002072] text-white hover:bg-[#00154D] dark:bg-blue-600 dark:hover:bg-blue-500' : ''}
                                                >
                                                    <Link href={item.href} prefetch className="flex items-center gap-2.5">
                                                        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                                                        <span className="font-medium text-xs">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>

                                                {item.badge !== undefined && (
                                                    <SidebarMenuBadge
                                                        className={
                                                            item.badgeVariant === 'amber'
                                                                ? 'bg-amber-500 text-white font-bold'
                                                                : 'bg-rose-500 text-white font-bold animate-pulse'
                                                        }
                                                    >
                                                        {item.badge}
                                                    </SidebarMenuBadge>
                                                )}
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
