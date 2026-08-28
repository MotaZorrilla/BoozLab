<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Roles associated with the user.
     */
    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Check if user has one or more roles.
     */
    public function hasRole(string|array $roles): bool
    {
        $slugs = is_array($roles) ? $roles : func_get_args();
        $hasSlug = $this->roles->pluck('slug')->intersect($slugs)->isNotEmpty();
        if ($hasSlug) {
            return true;
        }

        // Legacy fallback: if user has is_admin = true and NO roles assigned yet, consider super_admin
        if ($this->is_admin && $this->roles->isEmpty() && in_array('super_admin', (array) $slugs, true)) {
            return true;
        }

        return false;
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->hasRole('super_admin')) {
            return true;
        }

        foreach ($this->roles as $role) {
            $permissions = is_array($role->permissions) ? $role->permissions : json_decode($role->permissions ?? '[]', true);
            if (in_array('*', $permissions, true) || in_array($permission, $permissions, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Assign a role by slug or model.
     */
    public function assignRole(string|Role $role): void
    {
        $roleModel = is_string($role) ? Role::where('slug', $role)->first() : $role;
        if ($roleModel && ! $this->roles()->where('role_id', $roleModel->id)->exists()) {
            $this->roles()->attach($roleModel->id);
            if ($roleModel->slug === 'super_admin') {
                $this->is_admin = true;
                $this->save();
            }
        }
    }

    /**
     * Sync roles by array of slugs or IDs.
     */
    public function syncRoles(array $roleSlugsOrIds): void
    {
        $roleIds = Role::whereIn('slug', $roleSlugsOrIds)
            ->orWhereIn('id', $roleSlugsOrIds)
            ->pluck('id')
            ->toArray();

        $this->roles()->sync($roleIds);

        // Synchronize is_admin
        $hasAdminRole = $this->roles()->whereIn('slug', ['super_admin', 'director_tecnico', 'gestor_comercial', 'oficial_farmacovigilancia'])->exists();
        $this->is_admin = $hasAdminRole;
        $this->save();
    }

    /**
     * Get the primary role slug of the user.
     */
    public function getPrimaryRoleAttribute(): string
    {
        $role = $this->roles->first();
        if ($role) {
            return $role->slug;
        }

        return $this->is_admin ? 'super_admin' : 'user';
    }

    /**
     * Get all unique permissions granted to this user.
     */
    public function getAllPermissions(): array
    {
        if ($this->hasRole('super_admin') || $this->is_admin) {
            return ['*'];
        }

        return $this->roles->flatMap(function ($role) {
            return is_array($role->permissions) ? $role->permissions : json_decode($role->permissions ?? '[]', true);
        })->unique()->values()->toArray();
    }
}
