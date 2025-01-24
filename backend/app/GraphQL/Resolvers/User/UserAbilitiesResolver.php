<?php

namespace App\GraphQL\Resolvers\User;

use App\Models\User;

final class UserAbilitiesResolver
{
    /**
     * @return array{viewApp: bool}
     */
    public function __invoke(User $root): array
    {

        return [
            'viewApp' => \Gate::check('view-app', $root),
        ];
    }
}
