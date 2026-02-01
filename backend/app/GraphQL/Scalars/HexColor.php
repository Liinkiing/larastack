<?php

declare(strict_types=1);

namespace App\GraphQL\Scalars;

use GraphQL\Language\AST\Node;
use GraphQL\Type\Definition\ScalarType;

class HexColor extends ScalarType
{
    public string $name = 'HexColor';

    public ?string $description = 'Hexadecimal color (e.g: #FF0000)';

    public function serialize($value)
    {
        return $this->validate($value);
    }

    public function parseValue($value)
    {
        return $this->validate($value);
    }

    public function parseLiteral(Node $valueNode, ?array $variables = null)
    {
        return $this->validate($valueNode->value);
    }

    private function validate(string $value): string
    {
        if (! preg_match('/^#[0-9A-Fa-f]{6}$/', $value)) {
            throw new \Exception('Invalid hexadecimal color');
        }

        return $value;
    }
}
