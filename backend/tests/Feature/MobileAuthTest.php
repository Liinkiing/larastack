<?php

use App\Models\User;
use App\Services\Auth\AppleIdTokenVerifier;
use App\Services\Auth\GoogleIdTokenVerifier;
use GraphQL\Validator\Rules\DisableIntrospection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
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

it('does not link web Google accounts using unverified email', function () {
    $user = User::factory()->create([
        'email' => 'victim@example.com',
    ]);

    Socialite::fake('google', (new SocialiteUser)
        ->setRaw([
            'email_verified' => false,
        ])
        ->map([
            'id' => 'google-user-123',
            'name' => 'Google User',
            'email' => 'victim@example.com',
        ])
        ->setToken('fake-token'));

    $this->get('/auth/google/callback')->assertRedirect(frontend_url('/auth/login'));

    expect($user->fresh()->google_id)->toBeNull();
});

it('marks web Google accounts as email verified when the provider email is verified', function () {
    $user = User::factory()->unverified()->create([
        'email' => 'verified@example.com',
    ]);

    Socialite::fake('google', (new SocialiteUser)
        ->setRaw([
            'email_verified' => true,
        ])
        ->map([
            'id' => 'google-user-123',
            'name' => 'Google User',
            'email' => 'verified@example.com',
        ])
        ->setToken('fake-token'));

    $this->get('/auth/google/callback')->assertRedirect(frontend_url('/dashboard'));

    $user->refresh();

    expect($user->google_id)->toBe('google-user-123')
        ->and($user->email_verified_at)->not->toBeNull();
});

it('creates and authenticates a new user from a verified web Google account', function () {
    Socialite::fake('google', (new SocialiteUser)
        ->setRaw([
            'email_verified' => true,
        ])
        ->map([
            'id' => 'new-google-user-123',
            'name' => 'New Google User',
            'email' => 'new@example.com',
            'avatar' => 'https://example.com/avatar.png',
        ])
        ->setToken('fake-token')
        ->setRefreshToken('fake-refresh-token'));

    $this->get('/auth/google/callback')->assertRedirect(frontend_url('/dashboard'));

    $user = User::query()->where('email', 'new@example.com')->firstOrFail();

    $this->assertAuthenticatedAs($user);

    expect($user->google_id)->toBe('new-google-user-123')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->google_token)->toBe('fake-token')
        ->and($user->google_refresh_token)->toBe('fake-refresh-token');
});

it('disables GraphiQL and introspection outside local by default', function () {
    expect(config('graphiql.enabled'))->toBeFalse()
        ->and(config('lighthouse.security.disable_introspection'))->toBe(DisableIntrospection::ENABLED);
});
