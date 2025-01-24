<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{
    public function run(): void
    {
        $env = config('app.env');

        if ($env === 'local') {
            $this->loadLocalSeeds();
        } elseif ($env === 'preview') {
            $this->loadPreviewSeeds();
        } elseif ($env === 'production') {
            $this->loadProductionSeeds();
        }
    }

    protected function loadLocalSeeds(): void
    {
    }

    protected function loadPreviewSeeds(): void
    {
    }

    protected function loadProductionSeeds(): void
    {
    }
}
