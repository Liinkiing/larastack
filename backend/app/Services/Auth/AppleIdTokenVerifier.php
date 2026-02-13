<?php

namespace App\Services\Auth;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Throwable;

class AppleIdTokenVerifier
{
    private const JWKS_CACHE_KEY = 'apple-id-token-jwks';

    private const JWKS_URL = 'https://appleid.apple.com/auth/keys';

    private const ISSUER = 'https://appleid.apple.com';

    /**
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function verify(string $identityToken): array
    {
        $keys = $this->appleKeys();

        try {
            $payload = (array) JWT::decode($identityToken, $keys);
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'identity_token' => 'Invalid Apple identity token.',
            ]);
        }

        $issuer = Arr::get($payload, 'iss');
        if (! is_string($issuer) || $issuer !== self::ISSUER) {
            throw ValidationException::withMessages([
                'identity_token' => 'Invalid Apple token issuer.',
            ]);
        }

        if (! $this->audienceIsAllowed(Arr::get($payload, 'aud'))) {
            throw ValidationException::withMessages([
                'identity_token' => 'Apple token audience is not allowed.',
            ]);
        }

        $subject = Arr::get($payload, 'sub');
        if (! is_string($subject) || $subject === '') {
            throw ValidationException::withMessages([
                'identity_token' => 'Apple token subject is missing.',
            ]);
        }

        return $payload;
    }

    /**
     * @return array<string, \Firebase\JWT\Key>
     *
     * @throws ValidationException
     */
    private function appleKeys(): array
    {
        $jwks = Cache::remember(self::JWKS_CACHE_KEY, now()->addHours(6), function (): array {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::retry(2, 200)->acceptJson()->get(self::JWKS_URL);

            if (! $response->successful()) {
                throw ValidationException::withMessages([
                    'identity_token' => 'Unable to verify Apple identity token right now. Try again.',
                ]);
            }

            $jwks = $response->json();
            if (! is_array($jwks)) {
                throw ValidationException::withMessages([
                    'identity_token' => 'Invalid Apple key response.',
                ]);
            }

            return $jwks;
        });

        try {
            return JWK::parseKeySet($jwks, 'RS256');
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'identity_token' => 'Invalid Apple key set.',
            ]);
        }
    }

    private function audienceIsAllowed(mixed $audience): bool
    {
        $allowedClientIds = $this->allowedClientIds();

        if ($allowedClientIds === []) {
            return false;
        }

        if (is_string($audience)) {
            return in_array($audience, $allowedClientIds, true);
        }

        if (! is_array($audience)) {
            return false;
        }

        foreach ($audience as $value) {
            if (is_string($value) && in_array($value, $allowedClientIds, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return list<string>
     */
    private function allowedClientIds(): array
    {
        $configured = config('services.apple.allowed_client_ids', []);

        if (! is_array($configured)) {
            return [];
        }

        return array_values(array_filter($configured, static fn (mixed $value): bool => is_string($value) && $value !== ''));
    }
}
