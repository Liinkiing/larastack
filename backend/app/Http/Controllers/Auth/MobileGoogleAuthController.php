<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MobileGoogleLoginRequest;
use App\Models\User;
use App\Services\Auth\GoogleIdTokenVerifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class MobileGoogleAuthController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function __invoke(MobileGoogleLoginRequest $request, GoogleIdTokenVerifier $googleIdTokenVerifier): JsonResponse
    {
        $claims = $googleIdTokenVerifier->verify((string) $request->input('id_token'));

        $googleId = (string) Arr::get($claims, 'sub');
        $email = Arr::get($claims, 'email');

        if (! is_string($email) || $email === '') {
            throw ValidationException::withMessages([
                'id_token' => 'Google account email is missing.',
            ]);
        }

        $normalizedEmail = strtolower(trim($email));
        $nameFromClaims = Arr::get($claims, 'name');
        $name = is_string($nameFromClaims) && $nameFromClaims !== ''
            ? $nameFromClaims
            : explode('@', $normalizedEmail)[0];

        $avatarUrl = Arr::get($claims, 'picture');
        $emailVerified = filter_var(Arr::get($claims, 'email_verified', false), FILTER_VALIDATE_BOOL);

        $user = User::where('google_id', $googleId)
            ->orWhere('email', $normalizedEmail)
            ->first();

        if ($user) {
            $user->update([
                'name' => $name,
                'email' => $normalizedEmail,
                'google_id' => $googleId,
                'avatar_url' => is_string($avatarUrl) && $avatarUrl !== '' ? $avatarUrl : $user->avatar_url,
                'email_verified_at' => $emailVerified && $user->email_verified_at === null ? now() : $user->email_verified_at,
            ]);
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $normalizedEmail,
                'google_id' => $googleId,
                'avatar_url' => is_string($avatarUrl) && $avatarUrl !== '' ? $avatarUrl : null,
                'email_verified_at' => $emailVerified ? now() : null,
            ]);
        }

        $deviceName = trim((string) $request->input('device_name', 'mobile'));
        if ($deviceName === '') {
            $deviceName = 'mobile';
        }

        $token = $user->createToken($deviceName, ['*'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
}
