import { Head, useForm, router } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    Shield,
    ShieldCheck,
    Trash2,
    Edit3,
} from 'lucide-react';
import React, { useState } from 'react';
import Modal from '@/components/modal';
import AppLayout from '@/layouts/app-layout';

interface RoleItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    permissions: string[];
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    role: string;
    roles: Record<string, string>;
    created_at: string;
}

interface UsersProps {
    users: UserItem[];
    roles: RoleItem[];
    currentUserId: number;
}

export default function AdminUsers({
    users,
    roles,
    currentUserId,
}: UsersProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('create') === '1';
        }
        return false;
    });
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    // Formulario de creación
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'gestor_comercial',
    });

    // Formulario de edición
    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'gestor_comercial',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(`/admin/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleDeleteConfirm = () => {
        if (!deletingUser) return;
        router.delete(`/admin/users/${deletingUser.id}`, {
            onSuccess: () => setDeletingUser(null),
        });
    };

    const getRoleBadge = (roleSlug: string) => {
        switch (roleSlug) {
            case 'super_admin':
                return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'director_tecnico':
                return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'gestor_comercial':
                return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'oficial_farmacovigilancia':
                return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const getRoleName = (roleSlug: string) => {
        const found = roles.find((r) => r.slug === roleSlug);
        return found ? found.name : roleSlug;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo Booz', href: '/dashboard' },
                { title: 'Usuarios & Roles', href: '/admin/users' },
            ]}
        >
            <Head title="Control de Usuarios y Roles | Booz Laboratorio" />

            <div className="mx-auto max-w-7xl space-y-6 p-3 sm:p-6 lg:p-8 2xl:max-w-[1600px] 3xl:max-w-[1880px]">
                {/* Cabecera */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-2xl bg-blue-50 p-2.5 text-[#002072] dark:bg-blue-900/30 dark:text-cyan-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Control de Usuarios & Roles de Equipo
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de operadores, delegación de
                                responsabilidades clínicas y comerciales.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#002072] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Crear Nuevo Usuario</span>
                    </button>
                </div>

                {/* Tabla de Usuarios */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
                        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                            <span>
                                Usuarios Administrativos Activos ({users.length}
                                )
                            </span>
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Usuario</th>
                                    <th className="px-4 py-3">
                                        Correo Institucional
                                    </th>
                                    <th className="px-4 py-3">Rol Asignado</th>
                                    <th className="px-4 py-3">
                                        Fecha Creación
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.map((u) => {
                                    const isCurrent = u.id === currentUserId;
                                    return (
                                        <tr
                                            key={u.id}
                                            className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#002072] dark:bg-blue-900/50 dark:text-cyan-300">
                                                        {u.name
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span>{u.name}</span>
                                                        {isCurrent && (
                                                            <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950 dark:text-cyan-400">
                                                                Tú
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                                                {u.email}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${getRoleBadge(u.role)}`}
                                                >
                                                    {getRoleName(u.role)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-400">
                                                {u.created_at || 'Preexistente'}
                                            </td>
                                            <td className="space-x-2 px-4 py-3.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditOpen(u)
                                                    }
                                                    className="cursor-pointer rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
                                                    title="Editar usuario o rol"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>

                                                {!isCurrent && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeletingUser(u)
                                                        }
                                                        className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
                                                        title="Eliminar usuario"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Matriz de Roles y Responsabilidades (Guía Informativa) */}
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-700 uppercase dark:text-slate-300">
                        <Shield className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                        <span>
                            Matriz Oficial de Roles y Responsabilidades en Booz
                            Laboratorio
                        </span>
                    </h3>

                    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2 lg:grid-cols-4">
                        {roles.map((r) => (
                            <div
                                key={r.id}
                                className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700/70 dark:bg-slate-800/80"
                            >
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                                    <span>{r.name}</span>
                                    <code className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                        {r.slug}
                                    </code>
                                </div>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                    {r.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================
                    MODAL: CREAR NUEVO USUARIO
                ======================================================== */}
                <Modal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    title="Registrar Nuevo Colaborador Administrativo"
                >
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                Nombre Completo y Cargo
                            </label>
                            <input
                                type="text"
                                required
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                placeholder="Ej. Dra. Carmen Velásquez (Farmacovigilancia)"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            {createForm.errors.name && (
                                <p className="mt-1 text-xs font-semibold text-red-600">
                                    {createForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                Correo Electrónico Institucional
                            </label>
                            <input
                                type="email"
                                required
                                value={createForm.data.email}
                                onChange={(e) =>
                                    createForm.setData('email', e.target.value)
                                }
                                placeholder="carmen@boozlaboratorio.com"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            {createForm.errors.email && (
                                <p className="mt-1 text-xs font-semibold text-red-600">
                                    {createForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Rol y Responsabilidad
                                </label>
                                <select
                                    value={createForm.data.role}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'role',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {roles.map((r) => (
                                        <option key={r.slug} value={r.slug}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Contraseña Inicial
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={createForm.data.password}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Mínimo 8 caracteres"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {createForm.errors.password && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                        {createForm.errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="cursor-pointer rounded-xl bg-[#002072] px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                {createForm.processing
                                    ? 'Creando Usuario...'
                                    : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* ========================================================
                    MODAL: EDITAR USUARIO
                ======================================================== */}
                {editingUser && (
                    <Modal
                        isOpen={!!editingUser}
                        onClose={() => setEditingUser(null)}
                        title={`Editar Usuario: ${editingUser.name}`}
                    >
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {editForm.errors.name && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.data.email}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {editForm.errors.email && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                        {editForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Rol Asignado
                                    </label>
                                    <select
                                        value={editForm.data.role}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'role',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.slug} value={r.slug}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editForm.errors.role && (
                                        <p className="mt-1 text-xs font-semibold text-red-600">
                                            {editForm.errors.role}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Nueva Contraseña{' '}
                                        <span className="font-normal text-slate-400">
                                            (dejar vacío para mantener)
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Solo si deseas cambiarla"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 transition-colors outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    {editForm.errors.password && (
                                        <p className="mt-1 text-xs font-semibold text-red-600">
                                            {editForm.errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="cursor-pointer rounded-xl bg-[#002072] px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    {editForm.processing
                                        ? 'Guardando...'
                                        : 'Actualizar Usuario'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* ========================================================
                    MODAL: CONFIRMAR ELIMINACIÓN
                ======================================================== */}
                {deletingUser && (
                    <Modal
                        isOpen={!!deletingUser}
                        onClose={() => setDeletingUser(null)}
                        title="Confirmar Eliminación de Usuario"
                    >
                        <div className="space-y-4">
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar la cuenta
                                de <strong>{deletingUser.name}</strong> (
                                {deletingUser.email})? Esta acción revocará
                                todos sus accesos al panel administrativo.
                            </p>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setDeletingUser(null)}
                                    className="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteConfirm}
                                    className="cursor-pointer rounded-xl bg-red-600 px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-red-700"
                                >
                                    Eliminar Usuario
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </AppLayout>
    );
}
