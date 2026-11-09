<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('keeps application and PostgreSQL sessions in UTC with timezone-aware account timestamps', function () {
    expect(config('app.timezone'))->toBe('UTC')
        ->and(DB::scalar('SHOW TIME ZONE'))->toBe('UTC');

    $tables = [
        'users' => ['email_verified_at', 'created_at', 'updated_at'],
        'password_reset_tokens' => ['created_at'],
    ];
    if (Schema::hasTable('personal_access_tokens')) {
        $tables['personal_access_tokens'] = ['last_used_at', 'expires_at', 'created_at', 'updated_at'];
    }

    foreach ($tables as $table => $names) {
        $columnTypes = array_column(Schema::getColumns($table), 'type_name', 'name');

        foreach ($names as $name) {
            expect($columnTypes[$name] ?? null)->toBe('timestamptz', "{$table}.{$name}");
        }
    }
})->skip(fn (): bool => DB::connection()->getDriverName() !== 'pgsql');

it('exposes stored instants as explicit UTC timestamps through GraphQL', function () {
    $user = User::factory()->create();
    DB::table('users')->where('id', $user->id)->update([
        'created_at' => '2025-07-01 14:15:16+02:00',
        'updated_at' => '2025-07-01 09:10:11-05:00',
    ]);

    $this->actingAs($user->refresh(), 'web')->postJson('/graphql', [
        'query' => '{ viewer { createdAt updatedAt } }',
    ])->assertSuccessful()
        ->assertJsonMissingPath('errors')
        ->assertJsonPath('data.viewer.createdAt', '2025-07-01T12:15:16.000000Z')
        ->assertJsonPath('data.viewer.updatedAt', '2025-07-01T14:10:11.000000Z');
})->skip(fn (): bool => DB::connection()->getDriverName() !== 'pgsql');
