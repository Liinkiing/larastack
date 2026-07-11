<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;

final readonly class IssueMobileToken
{
    public function handle(User $user, ?string $deviceName): string
    {
        $name = trim($deviceName ?? '');

        return $user->createToken($name !== '' ? $name : 'mobile')->plainTextToken;
    }
}
