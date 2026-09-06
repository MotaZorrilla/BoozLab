import { Head, useForm, router } from '@inertiajs/react';
import { Users, UserPlus, Shield, ShieldCheck, Key, Trash2, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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

export default function AdminUsers({ users, roles, currentUserId }: UsersProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('create') === '1') {
                setIsCreateOpen(true);
            }
        }
    }, []);

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
        <AppLayout breadcrumbs={[{ title: 'Panel Administrativo Booz', href: '/dashboard' }, { title: 'Usuarios & Roles', href: '/admin/users' }]}>
            <Head title="Control de Usuarios y Roles | Booz Laboratorio" />

            <div className="p-3 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1880px] mx-auto space-y-6">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#002072] dark:text-cyan-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Control de Usuarios & Roles de Equipo
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Gestión de operadores, delegación de responsabilidades clínicas y comerciales.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/20 cursor-pointer transition-all"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Crear Nuevo Usuario</span>
                    </button>
                </div>

                {/* Tabla de Usuarios */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                            <span>Usuarios Administrativos Activos ({users.length})</span>
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">Usuario</th>
                                    <th className="py-3 px-4">Correo Institucional</th>
                                    <th className="py-3 px-4">Rol Asignado</th>
                                    <th className="py-3 px-4">Fecha Creación</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.map((u) => {
                                    const isCurrent = u.id === currentUserId;
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#002072] dark:text-cyan-300 font-bold flex items-center justify-center text-xs">
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span>{u.name}</span>
                                                        {isCurrent && (
                                                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 font-bold">
                                                                Tú
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">{u.email}</td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getRoleBadge(u.role)}`}>
                                                    {getRoleName(u.role)}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-400">{u.created_at || 'Preexistente'}</td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditOpen(u)}
                                                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                                    title="Editar usuario o rol"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>

                                                {!isCurrent && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingUser(u)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-slate-800 cursor-pointer transition-colors"
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
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#002072] dark:text-cyan-400" />
                        <span>Matriz Oficial de Roles y Responsabilidades en Booz Laboratorio</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        {roles.map((r) => (
                            <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>{r.name}</span>
                                    <code className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{r.slug}</code>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{r.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================
                    MODAL: CREAR NUEVO USUARIO
                ======================================================== */}
                <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Registrar Nuevo Colaborador Administrativo">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre Completo y Cargo</label>
                            <input
                                type="text"
                                required
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Ej. Dra. Carmen Velásquez (Farmacovigilancia)"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                            />
                            {createForm.errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{createForm.errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Correo Electrónico Institucional</label>
                            <input
                                type="email"
                                required
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                placeholder="carmen@boozlaboratorio.com"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                            />
                            {createForm.errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{createForm.errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Rol y Responsabilidad</label>
                                <select
                                    value={createForm.data.role}
                                    onChange={(e) => createForm.setData('role', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                >
                                    {roles.map((r) => (
                                        <option key={r.slug} value={r.slug}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Contraseña Inicial</label>
                                <input
                                    type="password"
                                    required
                                    value={createForm.data.password}
                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                {createForm.errors.password && (
                                    <p className="text-red-600 text-xs mt-1 font-semibold">{createForm.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-6 py-2 rounded-xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
                            >
                                {createForm.processing ? 'Creando Usuario...' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* ========================================================
                    MODAL: EDITAR USUARIO
                ======================================================== */}
                {editingUser && (
                    <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Editar Usuario: ${editingUser.name}`}>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                {editForm.errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{editForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                />
                                {editForm.errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{editForm.errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Rol Asignado</label>
                                    <select
                                        value={editForm.data.role}
                                        onChange={(e) => editForm.setData('role', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.slug} value={r.slug}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editForm.errors.role && <p className="text-red-600 text-xs mt-1 font-semibold">{editForm.errors.role}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                        Nueva Contraseña <span className="font-normal text-slate-400">(dejar vacío para mantener)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        placeholder="Solo si deseas cambiarla"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
                                    />
                                    {editForm.errors.password && (
                                        <p className="text-red-600 text-xs mt-1 font-semibold">{editForm.errors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-6 py-2 rounded-xl bg-[#002072] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Guardando...' : 'Actualizar Usuario'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* ========================================================
                    MODAL: CONFIRMAR ELIMINACIÓN
                ======================================================== */}
                {deletingUser && (
                    <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title="Confirmar Eliminación de Usuario">
                        <div className="space-y-4">
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar la cuenta de <strong>{deletingUser.name}</strong> ({deletingUser.email})?
                                Esta acción revocará todos sus accesos al panel administrativo.
                            </p>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setDeletingUser(null)}
                                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteConfirm}
                                    className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
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
