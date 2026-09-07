<?php

use App\Services\Auth\AppleIdTokenVerifier;
use App\Services\Auth\GoogleIdTokenVerifier;
use Firebase\JWT\JWT;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    Cache::flush();
    Http::preventStrayRequests();
});

it('maps key provider server errors to retryable validation errors', function (string $verifier, string $message) {
    Http::fake(fn () => Http::response([], 503));

    expect(fn () => app($verifier)->verify('invalid-token'))
        ->toThrow(ValidationException::class, $message);
})->with([
    'Google' => [GoogleIdTokenVerifier::class, 'Unable to verify Google ID token right now. Try again.'],
    'Apple' => [AppleIdTokenVerifier::class, 'Unable to verify Apple identity token right now. Try again.'],
]);

it('maps key provider connection errors to retryable validation errors', function (string $verifier, string $message) {
    Http::fake(fn () => throw new ConnectionException('Connection failed.'));

    expect(fn () => app($verifier)->verify('invalid-token'))
        ->toThrow(ValidationException::class, $message);
})->with([
    'Google' => [GoogleIdTokenVerifier::class, 'Unable to verify Google ID token right now. Try again.'],
    'Apple' => [AppleIdTokenVerifier::class, 'Unable to verify Apple identity token right now. Try again.'],
]);

/** @return array{private: string, jwks: array{keys: list<array<string, string>>}} */
function idTokenSigningFixture(string $keyId): array
{
    $key = openssl_pkey_new(['private_key_type' => OPENSSL_KEYTYPE_RSA, 'private_key_bits' => 2048]);
    $privateKey = '';

    if ($key === false || ! openssl_pkey_export($key, $privateKey)) {
        throw new RuntimeException('Unable to generate a signing key.');
    }

    $details = openssl_pkey_get_details($key);

    if ($details === false) {
        throw new RuntimeException('Unable to read the signing key.');
    }

    return [
        'private' => $privateKey,
        'jwks' => ['keys' => [[
            'kty' => 'RSA',
            'alg' => 'RS256',
            'kid' => $keyId,
            'n' => JWT::urlsafeB64Encode($details['rsa']['n']),
            'e' => JWT::urlsafeB64Encode($details['rsa']['e']),
        ]]],
    ];
}

/** @param array<string, mixed> $claims */
function signedIdToken(string $privateKey, string $keyId, string $issuer, array $claims = []): string
{
    return JWT::encode([
        'iss' => $issuer,
        'aud' => 'larastack-test-client',
        'sub' => 'provider-user',
        'iat' => time() - 60,
        'exp' => time() + 3600,
        ...$claims,
    ], $privateKey, 'RS256', $keyId);
}

dataset('id token providers', [
    'Google' => [GoogleIdTokenVerifier::class, 'google', 'https://accounts.google.com'],
    'Apple' => [AppleIdTokenVerifier::class, 'apple', 'https://appleid.apple.com'],
]);

it('refreshes rotated signing keys once and caches the verified key set', function (string $verifier, string $provider, string $issuer) {
    config()->set("services.{$provider}.allowed_client_ids", ['larastack-test-client']);
    $old = idTokenSigningFixture('old-key');
    $new = idTokenSigningFixture('new-key');
    Cache::put("{$provider}-id-token-jwks", $old['jwks'], 21600);
    Http::fake(fn () => Http::response($new['jwks'], 200, ['Cache-Control' => 'public, max-age=3600']));
    $token = signedIdToken($new['private'], 'new-key', $issuer);

    expect(app($verifier)->verify($token)['sub'])->toBe('provider-user')
        ->and(app($verifier)->verify($token)['sub'])->toBe('provider-user');

    Http::assertSentCount(1);
})->with('id token providers');

it('bounds unknown key refreshes across different key IDs and permits a later rotation', function (string $verifier, string $provider, string $issuer) {
    config()->set("services.{$provider}.allowed_client_ids", ['larastack-test-client']);
    $old = idTokenSigningFixture('old-key');
    $new = idTokenSigningFixture('new-key');
    Cache::put("{$provider}-id-token-jwks", $old['jwks'], 21600);
    Http::fakeSequence()->push($old['jwks'])->push($new['jwks']);

    foreach (['unknown-1', 'unknown-2', 'new-key'] as $keyId) {
        expect(fn () => app($verifier)->verify(signedIdToken($new['private'], $keyId, $issuer)))
            ->toThrow(ValidationException::class);
    }

    Http::assertSentCount(1);
    $this->travel(61)->seconds();

    expect(app($verifier)->verify(signedIdToken($new['private'], 'new-key', $issuer))['sub'])->toBe('provider-user');
    Http::assertSentCount(2);
})->with('id token providers');

it('keeps known keys usable when a rotation refresh fails and bounds retries', function (string $verifier, string $provider, string $issuer) {
    config()->set("services.{$provider}.allowed_client_ids", ['larastack-test-client']);
    $old = idTokenSigningFixture('old-key');
    Cache::put("{$provider}-id-token-jwks", $old['jwks'], 21600);
    Http::fake(fn () => Http::response([], 503));

    foreach (['unknown-1', 'unknown-2'] as $keyId) {
        expect(fn () => app($verifier)->verify(signedIdToken($old['private'], $keyId, $issuer)))
            ->toThrow(ValidationException::class);
    }

    expect(app($verifier)->verify(signedIdToken($old['private'], 'old-key', $issuer))['sub'])->toBe('provider-user');
    Http::assertSentCount(2);
})->with('id token providers');

it('continues validating claims and signatures without refreshing known key IDs', function (string $verifier, string $provider, string $issuer) {
    config()->set("services.{$provider}.allowed_client_ids", ['larastack-test-client']);
    $key = idTokenSigningFixture('known-key');
    $other = idTokenSigningFixture('other-key');
    Cache::put("{$provider}-id-token-jwks", $key['jwks'], 21600);

    foreach ([['iss' => 'https://attacker.example'], ['aud' => 'wrong-client'], ['exp' => time() - 1], ['sub' => '']] as $claims) {
        expect(fn () => app($verifier)->verify(signedIdToken($key['private'], 'known-key', $issuer, $claims)))
            ->toThrow(ValidationException::class);
    }

    expect(fn () => app($verifier)->verify(signedIdToken($other['private'], 'known-key', $issuer)))
        ->toThrow(ValidationException::class);
    expect(fn () => app($verifier)->verify('invalid-token'))->toThrow(ValidationException::class);
    Http::assertNothingSent();
})->with('id token providers');

it('expires cached keys according to the provider max age and response age', function (string $verifier, string $provider, string $issuer) {
    config()->set("services.{$provider}.allowed_client_ids", ['larastack-test-client']);
    $key = idTokenSigningFixture('known-key');
    Http::fake(fn () => Http::response($key['jwks'], 200, ['Cache-Control' => 'public, max-age=300', 'Age' => '120']));
    $token = signedIdToken($key['private'], 'known-key', $issuer);

    app($verifier)->verify($token);
    $this->travel(179)->seconds();
    app($verifier)->verify($token);
    Http::assertSentCount(1);
    $this->travel(2)->seconds();
    app($verifier)->verify($token);
    Http::assertSentCount(2);
})->with('id token providers');
