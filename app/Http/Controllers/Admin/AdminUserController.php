<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->orderBy('id')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => (bool) $user->is_admin,
                    'role' => $user->primary_role,
                    'roles' => $user->roles->pluck('name', 'slug')->toArray(),
                    'created_at' => $user->created_at?->format('d/m/Y H:i'),
                ];
            });

        $roles = Role::all(['id', 'name', 'slug', 'description', 'permissions']);

        return Inertia::render('admin/users', [
            'users' => $users,
            'roles' => $roles,
            'currentUserId' => Auth::id(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'role' => ['required', 'string', 'exists:roles,slug'],
            'password' => ['required', 'string', Password::default()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
            'is_admin' => in_array($validated['role'], ['super_admin', 'director_tecnico', 'gestor_comercial', 'oficial_farmacovigilancia'], true),
        ]);

        $user->assignRole($validated['role']);

        return back()->with('success', "Usuario [{$user->name}] creado exitosamente.");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'role' => ['required', 'string', 'exists:roles,slug'],
            'password' => ['nullable', 'string', Password::default()],
        ]);

        // Safety: If this user is the only super_admin, prevent demoting them
        if ($user->hasRole('super_admin') && $validated['role'] !== 'super_admin') {
            $superAdminCount = User::whereHas('roles', fn ($q) => $q->where('slug', 'super_admin'))->count();
            if ($superAdminCount <= 1) {
                return back()->withErrors(['role' => 'No puedes degradar al único Super Administrador del sistema.']);
            }
        }

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);
        $user->syncRoles([$validated['role']]);

        return back()->with('success', "Usuario [{$user->name}] actualizado correctamente.");
    }

    public function destroy(User $user): RedirectResponse
    {
        // 1. Prevent self-deletion
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'No puedes eliminar tu propia cuenta mientras estás en sesión.']);
        }

        // 2. Prevent deleting the last super_admin
        if ($user->hasRole('super_admin')) {
            $superAdminCount = User::whereHas('roles', fn ($q) => $q->where('slug', 'super_admin'))->count();
            if ($superAdminCount <= 1) {
                return back()->withErrors(['error' => 'No es posible eliminar al único Super Administrador activo de la plataforma.']);
            }
        }

        $userName = $user->name;
        $user->delete();

        return back()->with('success', "Usuario [{$userName}] eliminado del sistema.");
    }
}
