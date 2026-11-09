<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Schema\Source\SchemaSourceProvider;
use Nuwave\Lighthouse\Testing\TestSchemaProvider;

uses(RefreshDatabase::class);

beforeEach(function () {
    $schema = app(SchemaSourceProvider::class)->getSchemaString().<<<'GRAPHQL'

        extend type Query {
            subject(id: ID! @eq): User @find(model: "App\\Models\\User")
        }
        GRAPHQL;
    app()->instance(SchemaSourceProvider::class, new TestSchemaProvider($schema));
});

it('allows owners to read their private fields', function () {
    $subject = User::factory()->create();

    $this->actingAs($subject, 'web')->postJson('/graphql', [
        'query' => 'query($id: ID!) { subject(id: $id) { email abilities { viewApp } } }',
        'variables' => ['id' => $subject->id],
    ])->assertSuccessful()
        ->assertJsonMissingPath('errors')
        ->assertJsonPath('data.subject.email', $subject->email)
        ->assertJsonPath('data.subject.abilities.viewApp', true);
});

it('denies private fields to other users and guests', function (string $selection, string $field, bool $authenticated) {
    $subject = User::factory()->create();
    if ($authenticated) {
        $this->actingAs(User::factory()->create(), 'web');
    }

    $this->postJson('/graphql', [
        'query' => 'query($id: ID!) { subject(id: $id) { '.$selection.' } }',
        'variables' => ['id' => $subject->id],
    ])->assertSuccessful()
        ->assertJsonPath('data.subject', null)
        ->assertJsonPath('errors.0.path', ['subject', $field]);
})->with([
    'email' => ['email', 'email'],
    'abilities' => ['abilities { viewApp }', 'abilities'],
])->with([
    'other user' => true,
    'guest' => false,
]);
