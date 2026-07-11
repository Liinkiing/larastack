<?php

declare(strict_types=1);

namespace App\Actions;

use App\Data\MobileAuthentication;
use App\Models\User;
use App\Services\Auth\AppleIdTokenVerifier;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class AuthenticateMobileApple
{
    public function __construct(
        private AppleIdTokenVerifier $appleIdTokenVerifier,
        private IssueMobileToken $issueMobileToken,
    )
    {
    }

    /**
     * @throws ValidationException
     */
    public function handle(
        string $identityToken,
        ?string $appleUser,
        ?string $givenName,
        ?string $familyName,
        ?string $deviceName,
    ): MobileAuthentication {
        $claims = $this->appleIdTokenVerifier->verify($identityToken);
        $appleId = (string) Arr::get($claims, 'sub');

        if ($appleUser !== null && trim($appleUser) !== '' && trim($appleUser) !== $appleId) {
            throw ValidationException::withMessages([
                'apple_user' => 'Apple user identifier does not match identity token subject.',
            ]);
        }

        $email = $this->resolveEmail(Arr::get($claims, 'email'));
        $name = $this->resolveName($givenName, $familyName, Arr::get($claims, 'email'), $email);
        $emailVerified = filter_var(Arr::get($claims, 'email_verified', false), FILTER_VALIDATE_BOOL);

        return DB::transaction(function () use (
            $appleId,
            $email,
            $name,
            $emailVerified,
            $deviceName,
        ): MobileAuthentication {
            $user = User::query()->where('apple_id', $appleId)->first();

            if (! $user && $email !== null) {
                if (! $emailVerified) {
                    throw ValidationException::withMessages([
                        'identity_token' => 'Apple account email is not verified.',
                    ]);
                }

                $user = User::query()->where('email', $email)->first();
            }

            if (! $user && $email === null) {
                throw ValidationException::withMessages([
                    'email' => 'Apple account email is missing. Remove the app access in Apple ID settings and try again.',
                ]);
            }

            if ($user) {
                $user->update([
                    'apple_id' => $appleId,
                    'email' => $email !== null && $emailVerified ? $email : $user->email,
                    'name' => $name ?? $user->name,
                    'email_verified_at' => $emailVerified && $user->email_verified_at === null ? now() : $user->email_verified_at,
                ]);
            } else {
                $user = User::query()->create([
                    'apple_id' => $appleId,
                    'email' => $email,
                    'name' => $name ?? explode('@', $email)[0],
                    'email_verified_at' => $emailVerified ? now() : null,
                ]);
            }

            return new MobileAuthentication(
                user: $user,
                plainTextToken: $this->issueMobileToken->handle($user, $deviceName),
            );
        });
    }

    private function resolveEmail(mixed $emailFromClaims): ?string
    {
        $rawEmail = is_string($emailFromClaims) && $emailFromClaims !== '' ? $emailFromClaims : null;

        return $rawEmail ? strtolower(trim($rawEmail)) : null;
    }

    private function resolveName(
        ?string $givenName,
        ?string $familyName,
        mixed $emailFromClaims,
        ?string $resolvedEmail,
    ): ?string {
        $parts = array_values(array_filter(
            [trim($givenName ?? ''), trim($familyName ?? '')],
            static fn (string $part): bool => $part !== '',
        ));

        if ($parts !== []) {
            return implode(' ', $parts);
        }

        if (is_string($emailFromClaims) && $emailFromClaims !== '') {
            return explode('@', $emailFromClaims)[0];
        }

        if ($resolvedEmail !== null) {
            return explode('@', $resolvedEmail)[0];
        }

        return null;
    }
}
