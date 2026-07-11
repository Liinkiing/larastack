<?php

use App\Models\User;
use App\Services\Auth\AppleIdTokenVerifier;
use App\Services\Auth\GoogleIdTokenVerifier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

it('does not link Apple accounts using client supplied email', function () {
    $user = User::factory()->create([
        'email' => 'victim@example.com',
    ]);

    $this->mock(AppleIdTokenVerifier::class, function (MockInterface $mock): void {
        $mock->shouldReceive('verify')
            ->once()
            ->with('valid-token')
            ->andReturn([
                'sub' => 'apple-user-123',
            ]);
    });

    $this->postJson('/api/mobile/auth/apple', [
        'identity_token' => 'valid-token',
        'apple_user' => 'apple-user-123',
        'email' => $user->email,
    ])->assertInvalid(['email']);

    expect($user->fresh()->apple_id)->toBeNull();
});

it('authenticates a verified Apple account and issues a named mobile token', function () {
    $this->mock(AppleIdTokenVerifier::class, function (MockInterface $mock): void {
        $mock->shouldReceive('verify')
            ->once()
            ->with('valid-token')
            ->andReturn([
                'sub' => 'apple-user-123',
                'email' => 'verified@example.com',
                'email_verified' => true,
            ]);
    });

    $response = $this->postJson('/api/mobile/auth/apple', [
        'identity_token' => 'valid-token',
        'apple_user' => 'apple-user-123',
        'given_name' => 'Verified',
        'family_name' => 'User',
        'device_name' => 'Omar iPhone',
    ])->assertSuccessful();

    $user = User::query()->where('apple_id', 'apple-user-123')->firstOrFail();

    expect($response->json('token'))->toBeString()->not->toBeEmpty()
        ->and($response->json('user.email'))->toBe('verified@example.com')
        ->and($user->name)->toBe('Verified User')
        ->and($user->tokens()->sole()->name)->toBe('Omar iPhone');
});

it('does not link Google accounts using unverified email', function () {
    $user = User::factory()->create([
        'email' => 'victim@example.com',
    ]);

    $this->mock(GoogleIdTokenVerifier::class, function (MockInterface $mock): void {
        $mock->shouldReceive('verify')
            ->once()
            ->with('valid-token')
            ->andReturn([
                'sub' => 'google-user-123',
                'email' => 'victim@example.com',
                'email_verified' => false,
                'name' => 'Google User',
            ]);
    });

    $this->postJson('/api/mobile/auth/google', [
        'id_token' => 'valid-token',
    ])->assertInvalid(['id_token']);

    expect($user->fresh()->google_id)->toBeNull();
});

it('returns an explicit mobile user payload after Google login', function () {
    $this->mock(GoogleIdTokenVerifier::class, function (MockInterface $mock): void {
        $mock->shouldReceive('verify')
            ->once()
            ->with('valid-token')
            ->andReturn([
                'sub' => 'google-user-123',
                'email' => 'verified@example.com',
                'email_verified' => true,
                'name' => 'Verified User',
                'picture' => 'https://example.com/avatar.png',
            ]);
    });

    $response = $this->postJson('/api/mobile/auth/google', [
        'id_token' => 'valid-token',
    ])->assertSuccessful();

    expect(array_keys($response->json('user')))->toBe([
        'id',
        'name',
        'email',
        'avatar_url',
    ]);
});
