<?php

namespace App\Http\Controllers\Auth;

use App\Actions\AuthenticateMobileApple;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MobileAppleLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class MobileAppleAuthController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function __invoke(
        MobileAppleLoginRequest $request,
        AuthenticateMobileApple $authenticateMobileApple,
    ): JsonResponse
    {
        $authentication = $authenticateMobileApple->handle(
            identityToken: $request->string('identity_token')->value(),
            appleUser: $request->string('apple_user')->value(),
            givenName: $request->string('given_name')->value(),
            familyName: $request->string('family_name')->value(),
            deviceName: $request->string('device_name')->value(),
        );

        return response()->json([
            'token' => $authentication->plainTextToken,
            'token_type' => 'Bearer',
            'user' => $this->mobileUser($authentication->user),
        ]);
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
}
