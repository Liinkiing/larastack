<?php

namespace App\Services\Auth;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Throwable;

class GoogleIdTokenVerifier
{
    private const JWKS_CACHE_KEY = 'google-id-token-jwks';

    private const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

    /** @var list<string> */
    private const ISSUERS = [
        'accounts.google.com',
        'https://accounts.google.com',
    ];

    /**
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function verify(string $idToken): array
    {
        $keys = $this->googleKeys();

        try {
            $payload = (array) JWT::decode($idToken, $keys);
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'id_token' => 'Invalid Google ID token.',
            ]);
        }

        $issuer = Arr::get($payload, 'iss');
        if (! is_string($issuer) || ! in_array($issuer, self::ISSUERS, true)) {
            throw ValidationException::withMessages([
                'id_token' => 'Invalid Google token issuer.',
            ]);
        }

        if (! $this->audienceIsAllowed(Arr::get($payload, 'aud'))) {
            throw ValidationException::withMessages([
                'id_token' => 'Google token audience is not allowed.',
            ]);
        }

        $subject = Arr::get($payload, 'sub');
        if (! is_string($subject) || $subject === '') {
            throw ValidationException::withMessages([
                'id_token' => 'Google token subject is missing.',
            ]);
        }

        return $payload;
    }

    /**
     * @return array<string, \Firebase\JWT\Key>
     *
     * @throws ValidationException
     */
    private function googleKeys(): array
    {
        return Cache::remember(self::JWKS_CACHE_KEY, now()->addHours(6), function (): array {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::retry(2, 200)->acceptJson()->get(self::JWKS_URL);

            if (! $response->successful()) {
                throw ValidationException::withMessages([
                    'id_token' => 'Unable to verify Google ID token right now. Try again.',
                ]);
            }

            $jwks = $response->json();
            if (! is_array($jwks)) {
                throw ValidationException::withMessages([
                    'id_token' => 'Invalid Google key response.',
                ]);
            }

            try {
                return JWK::parseKeySet($jwks, 'RS256');
            } catch (Throwable) {
                throw ValidationException::withMessages([
                    'id_token' => 'Invalid Google key set.',
                ]);
            }
        });
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
        $configured = config('services.google.allowed_client_ids', []);

        if (! is_array($configured)) {
            return [];
        }

        return array_values(array_filter($configured, static fn (mixed $value): bool => is_string($value) && $value !== ''));
    }
}
