<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

uses(RefreshDatabase::class);

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
