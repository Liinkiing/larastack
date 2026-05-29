<?php

it('handles repeated GraphQL requests without cached AST serialization errors', function () {
    config()->set('lighthouse.query_cache.enable', true);
    config()->set('lighthouse.query_cache.mode', 'opcache');

    $request = fn () => $this
        ->withHeader('X-Requested-With', 'XMLHttpRequest')
        ->postJson('/graphql', [
            'query' => 'query { __typename }',
        ]);

    $request()->assertSuccessful()->assertJsonPath('data.__typename', 'Query');
    $request()->assertSuccessful()->assertJsonPath('data.__typename', 'Query');
});
