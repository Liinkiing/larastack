<?php

namespace App\GraphQL\Directives;

use App\Models\User;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Exceptions\AuthorizationException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class PrivateDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Limit field access to only the current user.
"""
directive @private on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue): void
    {
        $fieldValue->wrapResolver(
            fn (callable $resolver) => function (mixed $root, array $args, GraphQLContext $context, ResolveInfo $info) use ($resolver) {

                if (! $root instanceof User) {
                    return $resolver($root, $args, $context, $info);
                }

                /** @var User $user */
                $user = $context->user();
                if (! $user || $root->id !== $user->id) {
                    throw new AuthorizationException('You are not authorized to access this field.');
                }

                return $resolver($root, $args, $context, $info);
            }
        );
    }
}
