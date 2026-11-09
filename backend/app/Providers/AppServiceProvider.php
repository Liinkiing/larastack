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
     * Sail runs the HTTP server and the workers profile owns queues and scheduling.
     * Run Vite from the host workspace and use "artisan dev" to stream Pail logs.
     */
    private function configureDevCommands(): void
    {
        DevCommands::only('logs');
    }
}
