<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    /**
     * Restrict access to users possessing the required permission.
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Super Admin has unrestricted access
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        if ($user->hasPermission($permission)) {
            return $next($request);
        }

        abort(403, 'Acceso restringido. No posees los permisos necesarios para realizar esta acción.');
    }
}
