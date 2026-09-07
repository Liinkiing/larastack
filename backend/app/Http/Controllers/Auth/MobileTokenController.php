<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Sanctum\PersonalAccessToken;

class MobileTokenController extends Controller
{
    public function destroy(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);

        $bearerToken = $request->bearerToken();
        abort_unless(is_string($bearerToken) && $bearerToken !== '', 401);

        $currentAccessToken = PersonalAccessToken::findToken($bearerToken);
        abort_unless($currentAccessToken instanceof PersonalAccessToken, 401);

        $accessToken = $user->tokens()
            ->whereKey($currentAccessToken->getKey())
            ->first();
        abort_unless($accessToken !== null, 401);

        $accessToken->delete();

        return response()->noContent();
    }
}
