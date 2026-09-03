<?php

namespace App\Providers;

use Illuminate\Foundation\DevCommands;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDevCommands();
    }

    /**
     * Tailor the processes started by "artisan dev" to this repository's layout.
     *
     * The Sail container already supervises "artisan serve" on port 80, and Vite is
     * driven from the host through the pnpm workspace (backend/node_modules only
     * contains symlinks into the repository root, which is not mounted into the
     * container), so both processes are dropped here.
     */
    private function configureDevCommands(): void
    {
        DevCommands::except('server', 'vite');
    }
}
