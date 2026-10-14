<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        if (file_exists($manifest = public_path('build/manifest.json'))) {
            return hash_file('xxh128', $manifest);
        }

        return parent::version($request);
    }

    /**
     * Handle version changes ensuring the /booz subpath is never lost.
     */
    public function onVersionChange(Request $request, \Symfony\Component\HttpFoundation\Response $response): \Symfony\Component\HttpFoundation\Response
    {
        if ($request->hasSession()) {
            $request->session()->reflash();
        }

        $url = $request->fullUrl();
        $appUrl = config('app.url');
        if ($appUrl && str_contains($appUrl, '/booz') && !str_contains($url, '/booz')) {
            $url = rtrim($appUrl, '/') . '/' . ltrim($request->getRequestUri(), '/');
        }

        return \Inertia\Inertia::location($url);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userData = null;

        if ($user) {
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool) $user->is_admin,
                'role' => $user->primary_role,
                'permissions' => $user->getAllPermissions(),
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $userData ?? $user,
            ],
            'settings' => \App\Services\SettingService::publicSettings(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
