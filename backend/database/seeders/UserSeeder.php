<?php

namespace Database\Seeders;

use App\Models\User;

class UserSeeder extends AppSeeder
{
    protected function loadLocalSeeds(): void
    {
        $this->loadPreviewSeeds();
    }

    protected function loadPreviewSeeds(): void
    {
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john.doe@gmail.com',
            'is_admin' => true,
        ]);
    }
}
