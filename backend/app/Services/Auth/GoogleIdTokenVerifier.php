<?php

namespace App\Services\Auth;

use Firebase\JWT\JWT;
use Illuminate\Support\Arr;
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

    public function __construct(private readonly IdTokenSigningKeys $signingKeys) {}

    /**
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function verify(string $idToken): array
    {
        $keys = $this->signingKeys->forToken($idToken, self::JWKS_URL, self::JWKS_CACHE_KEY, 'google', 'id_token');

        try {
            $payload = (array) JWT::decode($idToken, $keys);
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'id_token' => __('mobile_auth.google.token_invalid'),
            ]);
        }

        $issuer = Arr::get($payload, 'iss');
        if (! is_string($issuer) || ! in_array($issuer, self::ISSUERS, true)) {
            throw ValidationException::withMessages([
                'id_token' => __('mobile_auth.google.issuer_invalid'),
            ]);
        }

        if (! $this->audienceIsAllowed(Arr::get($payload, 'aud'))) {
            throw ValidationException::withMessages([
                'id_token' => __('mobile_auth.google.audience_invalid'),
            ]);
        }

        $subject = Arr::get($payload, 'sub');
        if (! is_string($subject) || $subject === '') {
            throw ValidationException::withMessages([
                'id_token' => __('mobile_auth.google.subject_missing'),
            ]);
        }

        return $payload;
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
