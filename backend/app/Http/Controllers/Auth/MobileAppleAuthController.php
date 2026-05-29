<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MobileAppleLoginRequest;
use App\Models\User;
use App\Services\Auth\AppleIdTokenVerifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class MobileAppleAuthController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function __invoke(MobileAppleLoginRequest $request, AppleIdTokenVerifier $appleIdTokenVerifier): JsonResponse
    {
        $claims = $appleIdTokenVerifier->verify((string) $request->input('identity_token'));

        $appleId = (string) Arr::get($claims, 'sub');
        $appleUser = $request->string('apple_user')->trim()->value();

        if ($appleUser !== '' && $appleUser !== $appleId) {
            throw ValidationException::withMessages([
                'apple_user' => 'Apple user identifier does not match identity token subject.',
            ]);
        }

        $email = $this->resolveEmail(Arr::get($claims, 'email'));
        $name = $this->resolveName(
            $request->input('given_name'),
            $request->input('family_name'),
            Arr::get($claims, 'email'),
            $email,
        );
        $emailVerified = filter_var(Arr::get($claims, 'email_verified', false), FILTER_VALIDATE_BOOL);

        $user = User::query()->where('apple_id', $appleId)->first();

        if (! $user && $email !== null) {
            if (! $emailVerified) {
                throw ValidationException::withMessages([
                    'identity_token' => 'Apple account email is not verified.',
                ]);
            }

            $user = User::query()->where('email', $email)->first();
        }

        if (! $user && $email === null) {
            throw ValidationException::withMessages([
                'email' => 'Apple account email is missing. Remove the app access in Apple ID settings and try again.',
            ]);
        }

        if ($user) {
            $user->update([
                'apple_id' => $appleId,
                'email' => $email !== null && $emailVerified ? $email : $user->email,
                'name' => $name ?? $user->name,
                'email_verified_at' => $emailVerified && $user->email_verified_at === null ? now() : $user->email_verified_at,
            ]);
        } else {
            $user = User::query()->create([
                'apple_id' => $appleId,
                'email' => $email,
                'name' => $name ?? explode('@', $email)[0],
                'email_verified_at' => $emailVerified ? now() : null,
            ]);
        }

        $deviceName = trim((string) $request->input('device_name', 'mobile'));
        if ($deviceName === '') {
            $deviceName = 'mobile';
        }

        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->mobileUser($user),
        ]);
    }

    private function resolveEmail(mixed $emailFromClaims): ?string
    {
        $rawEmail = is_string($emailFromClaims) && $emailFromClaims !== '' ? $emailFromClaims : null;

        return $rawEmail ? strtolower(trim($rawEmail)) : null;
    }

    /**
     * @return array{id: string, name: string, email: string, avatar_url: ?string}
     */
    private function mobileUser(User $user): array
    {
        return $user->only([
            'id',
            'name',
            'email',
            'avatar_url',
        ]);
    }

    private function resolveName(mixed $givenName, mixed $familyName, mixed $emailFromClaims, ?string $resolvedEmail): ?string
    {
        $parts = [];

        if (is_string($givenName) && trim($givenName) !== '') {
            $parts[] = trim($givenName);
        }

        if (is_string($familyName) && trim($familyName) !== '') {
            $parts[] = trim($familyName);
        }

        if ($parts !== []) {
            return implode(' ', $parts);
        }

        if (is_string($emailFromClaims) && $emailFromClaims !== '') {
            return explode('@', $emailFromClaims)[0];
        }

        if ($resolvedEmail !== null) {
            return explode('@', $resolvedEmail)[0];
        }

        return null;
    }
}
