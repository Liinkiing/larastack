<?php

use App\Services\Auth\AppleIdTokenVerifier;
use App\Services\Auth\GoogleIdTokenVerifier;
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
