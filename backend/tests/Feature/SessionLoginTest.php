<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Cookie;

uses(RefreshDatabase::class);

it('authenticates ULID users with database sessions', function () {
    config()->set('session.driver', 'database');
    config()->set('session.lifetime', 120);
    config()->set('session.secure', true);

    $primaryIndex = collect(Schema::getIndexes('users'))
        ->first(fn (array $index): bool => ($index['primary'] ?? false) === true);

    expect($primaryIndex['columns'] ?? [])->toBe(['id']);

    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertNoContent()
        ->assertCookie('larastack_logged_in', 'true', false);

    $loggedInCookie = collect($response->headers->getCookies())
        ->first(fn (Cookie $cookie): bool => $cookie->getName() === 'larastack_logged_in');

    expect($loggedInCookie)
        ->not->toBeNull()
        ->and($loggedInCookie->isSecure())->toBeTrue()
        ->and($loggedInCookie->isHttpOnly())->toBeFalse()
        ->and($loggedInCookie->getExpiresTime() - time())->toBeBetween(119 * 60, 120 * 60);

    $this->assertAuthenticatedAs($user);

    $this->post('/logout')
        ->assertNoContent()
        ->assertCookie('larastack_logged_in', 'false', false);

    $this->assertGuest();
});
