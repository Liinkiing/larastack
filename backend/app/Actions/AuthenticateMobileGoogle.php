<?php

declare(strict_types=1);

namespace App\Actions;

use App\Data\MobileAuthentication;
use App\Models\User;
use App\Services\Auth\GoogleIdTokenVerifier;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class AuthenticateMobileGoogle
{
    public function __construct(
        private GoogleIdTokenVerifier $googleIdTokenVerifier,
        private IssueMobileToken $issueMobileToken,
    )
    {
    }

    /**
     * @throws ValidationException
     */
    public function handle(string $idToken, ?string $deviceName): MobileAuthentication
    {
        $claims = $this->googleIdTokenVerifier->verify($idToken);
        $googleId = (string) Arr::get($claims, 'sub');
        $email = Arr::get($claims, 'email');

        if (! is_string($email) || $email === '') {
            throw ValidationException::withMessages([
                'id_token' => 'Google account email is missing.',
            ]);
        }

        $normalizedEmail = strtolower(trim($email));
        $nameFromClaims = Arr::get($claims, 'name');
        $name = is_string($nameFromClaims) && $nameFromClaims !== ''
            ? $nameFromClaims
            : explode('@', $normalizedEmail)[0];

        $avatarUrl = Arr::get($claims, 'picture');
        $emailVerified = filter_var(Arr::get($claims, 'email_verified', false), FILTER_VALIDATE_BOOL);

        return DB::transaction(function () use (
            $googleId,
            $normalizedEmail,
            $name,
            $avatarUrl,
            $emailVerified,
            $deviceName,
        ): MobileAuthentication {
            $user = User::query()->where('google_id', $googleId)->first();

            if (! $user) {
                if (! $emailVerified) {
                    throw ValidationException::withMessages([
                        'id_token' => 'Google account email is not verified.',
                    ]);
                }

                $user = User::query()->where('email', $normalizedEmail)->first();
            }

            if ($user) {
                $user->update([
                    'name' => $name,
                    'email' => $emailVerified ? $normalizedEmail : $user->email,
                    'google_id' => $googleId,
                    'avatar_url' => is_string($avatarUrl) && $avatarUrl !== '' ? $avatarUrl : $user->avatar_url,
                    'email_verified_at' => $emailVerified && $user->email_verified_at === null ? now() : $user->email_verified_at,
                ]);
            } else {
                $user = User::query()->create([
                    'name' => $name,
                    'email' => $normalizedEmail,
                    'google_id' => $googleId,
                    'avatar_url' => is_string($avatarUrl) && $avatarUrl !== '' ? $avatarUrl : null,
                    'email_verified_at' => $emailVerified ? now() : null,
                ]);
            }

            return new MobileAuthentication(
                user: $user,
                plainTextToken: $this->issueMobileToken->handle($user, $deviceName),
            );
        });
    }
}
