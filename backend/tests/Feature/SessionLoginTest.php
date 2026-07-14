<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('authenticates ULID users with database sessions', function () {
    config()->set('session.driver', 'database');

    $primaryIndex = collect(Schema::getIndexes('users'))
        ->first(fn (array $index): bool => ($index['primary'] ?? false) === true);

    expect($primaryIndex['columns'] ?? [])->toBe(['id']);

    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertNoContent()
        ->assertCookie('larastack_logged_in', 'true', false);

    $this->assertAuthenticatedAs($user);

    $this->post('/logout')
        ->assertNoContent()
        ->assertCookie('larastack_logged_in', 'false', false);

    $this->assertGuest();
});
