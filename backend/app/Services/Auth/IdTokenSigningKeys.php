<?php

namespace App\Services\Auth;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Throwable;

final class IdTokenSigningKeys
{
    private const REFRESH_COOLDOWN_SECONDS = 60;

    private const DEFAULT_CACHE_SECONDS = 21600;

    /** @return array<string, Key> */
    public function forToken(string $token, string $url, string $cacheKey, string $provider, string $field): array
    {
        $jwks = Cache::get($cacheKey);
        $cached = is_array($jwks);
        $keys = $cached
            ? $this->parse($jwks, $provider, $field)
            : $this->refresh($url, $cacheKey, $provider, $field);

        $keyId = $this->keyId($token);

        if ($cached && $keyId !== null && ! array_key_exists($keyId, $keys)) {
            // A provider-wide atomic cooldown also bounds requests for attacker-supplied key IDs.
            if (Cache::add($cacheKey.':refresh-cooldown', true, self::REFRESH_COOLDOWN_SECONDS)) {
                return $this->fetch($url, $cacheKey, $provider, $field);
            }

            // Another request may already have completed the rotation refresh.
            $jwks = Cache::get($cacheKey);

            if (is_array($jwks)) {
                return $this->parse($jwks, $provider, $field);
            }
        }

        return $keys;
    }

    private function keyId(string $token): ?string
    {
        try {
            $segments = explode('.', $token);

            if (count($segments) !== 3) {
                return null;
            }

            $header = JWT::jsonDecode(JWT::urlsafeB64Decode($segments[0]));

            if (! is_object($header) || ($header->alg ?? null) !== 'RS256') {
                return null;
            }

            $keyId = $header->kid ?? null;

            return is_string($keyId) && $keyId !== '' ? $keyId : null;
        } catch (Throwable) {
            return null;
        }
    }

    /** @return array<string, Key> */
    private function refresh(string $url, string $cacheKey, string $provider, string $field): array
    {
        if (! Cache::add($cacheKey.':refresh-cooldown', true, self::REFRESH_COOLDOWN_SECONDS)) {
            throw ValidationException::withMessages([
                $field => __("mobile_auth.{$provider}.temporarily_unavailable"),
            ]);
        }

        return $this->fetch($url, $cacheKey, $provider, $field);
    }

    /** @return array<string, Key> */
    private function fetch(string $url, string $cacheKey, string $provider, string $field): array
    {
        try {
            $response = Http::connectTimeout(3)
                ->timeout(5)
                ->retry(2, 200, throw: false)
                ->acceptJson()
                ->get($url);
        } catch (Throwable) {
            throw ValidationException::withMessages([
                $field => __("mobile_auth.{$provider}.temporarily_unavailable"),
            ]);
        }

        if (! $response->successful()) {
            throw ValidationException::withMessages([
                $field => __("mobile_auth.{$provider}.temporarily_unavailable"),
            ]);
        }

        $jwks = $response->json();

        if (! is_array($jwks)) {
            throw ValidationException::withMessages([
                $field => __("mobile_auth.{$provider}.key_response_invalid"),
            ]);
        }

        $keys = $this->parse($jwks, $provider, $field);
        Cache::put($cacheKey, $jwks, $this->cacheSeconds($response));

        return $keys;
    }

    /**
     * @param  array<mixed>  $jwks
     * @return array<string, Key>
     */
    private function parse(array $jwks, string $provider, string $field): array
    {
        try {
            return JWK::parseKeySet($jwks, 'RS256');
        } catch (Throwable) {
            throw ValidationException::withMessages([
                $field => __("mobile_auth.{$provider}.key_set_invalid"),
            ]);
        }
    }

    private function cacheSeconds(Response $response): int
    {
        $cacheControl = $response->header('Cache-Control');

        if (preg_match('/(?:^|,)\s*(?:no-cache|no-store)\b/i', $cacheControl)) {
            return 0;
        }

        if (preg_match('/(?:^|,)\s*max-age\s*=\s*"?(\d+)"?/i', $cacheControl, $matches)) {
            $age = max(0, (int) $response->header('Age'));

            return max(0, min(self::DEFAULT_CACHE_SECONDS, (int) $matches[1] - $age));
        }

        return self::DEFAULT_CACHE_SECONDS;
    }
}
