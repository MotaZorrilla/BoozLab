<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // En cPanel la carpeta pública suele ser public_html en vez de public
        $cpanelPublic = base_path('../public_html');
        if (is_dir($cpanelPublic)) {
            $this->app->usePublicPath(realpath($cpanelPublic));
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthorization();
    }

    /**
     * Configure RBAC gates and abilities.
     */
    protected function configureAuthorization(): void
    {
        \Illuminate\Support\Facades\Gate::before(function ($user, string $ability) {
            if ($user->hasRole('super_admin') || $user->is_admin) {
                return true;
            }
        });

        \Illuminate\Support\Facades\Gate::define('manage-catalog', fn ($user) => $user->hasPermission('products.view') || $user->hasPermission('products.manage'));
        \Illuminate\Support\Facades\Gate::define('manage-reports', fn ($user) => $user->hasPermission('reports.view') || $user->hasPermission('reports.manage'));
        \Illuminate\Support\Facades\Gate::define('manage-quotes', fn ($user) => $user->hasPermission('quotes.view') || $user->hasPermission('quotes.manage'));
        \Illuminate\Support\Facades\Gate::define('manage-messages', fn ($user) => $user->hasPermission('messages.view') || $user->hasPermission('messages.manage'));
        \Illuminate\Support\Facades\Gate::define('manage-ai', fn ($user) => $user->hasRole('super_admin'));
        \Illuminate\Support\Facades\Gate::define('manage-settings', fn ($user) => $user->hasRole('super_admin'));
        \Illuminate\Support\Facades\Gate::define('manage-users', fn ($user) => $user->hasRole('super_admin'));
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
