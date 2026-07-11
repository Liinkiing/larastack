<?php

namespace App\Http\Controllers\Auth;

use App\Actions\AuthenticateMobileGoogle;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MobileGoogleLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class MobileGoogleAuthController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function __invoke(
        MobileGoogleLoginRequest $request,
        AuthenticateMobileGoogle $authenticateMobileGoogle,
    ): JsonResponse
    {
        $authentication = $authenticateMobileGoogle->handle(
            idToken: $request->string('id_token')->value(),
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
