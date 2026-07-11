<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class ConnectGoogleAccount
{
    public function handle(
        string $googleId,
        string $name,
        string $email,
        ?string $avatarUrl,
        string $accessToken,
        ?string $refreshToken,
    ): User {
        return DB::transaction(function () use (
            $googleId,
            $name,
            $email,
            $avatarUrl,
            $accessToken,
            $refreshToken,
        ): User {
            $user = User::query()->where('google_id', $googleId)->first()
                ?? User::query()->where('email', $email)->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleId,
                    'avatar_url' => $avatarUrl,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'google_token' => $accessToken,
                    'google_refresh_token' => $refreshToken,
                ]);

                return $user;
            }

            return User::query()->create([
                'name' => $name,
                'email' => $email,
                'avatar_url' => $avatarUrl,
                'email_verified_at' => now(),
                'google_id' => $googleId,
                'google_token' => $accessToken,
                'google_refresh_token' => $refreshToken,
            ]);
        });
    }
}
