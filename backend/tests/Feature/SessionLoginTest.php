<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('stores database sessions for ULID users', function () {
    config()->set('session.driver', 'database');

    $primaryIndex = collect(Schema::getIndexes('users'))
        ->first(fn (array $index): bool => ($index['primary'] ?? false) === true);

    expect($primaryIndex['columns'] ?? [])->toBe(['id']);

    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertNoContent();

    $this->assertAuthenticatedAs($user);
});
