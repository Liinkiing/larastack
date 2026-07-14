<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Cookie;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class SetLoggedInCookieMiddleware
{
    /** @param Closure(Request): Response $next */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        Cookie::queue(
            Cookie::forever(
                config('session.logged_in_cookie_key'),
                Auth::check() ? 'true' : 'false',
                secure: config('session.secure'),
                httpOnly: false,
                sameSite: config('session.same_site')
            )
        );

        return $response;
    }
}
