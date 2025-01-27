<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Cookie;
use Illuminate\Http\Request;

class SetLoggedInCookieMiddleware
{
    /** @phpstan-ignore missingType.return */
    public function handle(Request $request, Closure $next)
    {
        Cookie::queue(
            Cookie::forever(
                config('session.logged_in_cookie_key'),
                Auth::check() ? base64_encode('User:'.Auth::user()->id) : 'false',
                httpOnly: false
            )
        );

        return $next($request);
    }
}
