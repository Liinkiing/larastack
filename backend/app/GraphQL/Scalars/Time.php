<?php declare(strict_types=1);

namespace App\GraphQL\Scalars;

use Illuminate\Support\Carbon;
use Nuwave\Lighthouse\Schema\Types\Scalars\DateScalar;

class Time extends DateScalar
{
    protected function format(Carbon $carbon): string
    {
        return $carbon->toTimeString('minute');
    }

    protected function parse(mixed $value): Carbon
    {
        return Carbon::createFromFormat('H:i', $value);
    }
}
