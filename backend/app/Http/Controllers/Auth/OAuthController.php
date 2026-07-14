<?php

namespace App\Http\Controllers\Auth;

use App\Actions\ConnectGoogleAccount;
use App\Http\Controllers\Controller;
use Auth;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Session;

class OAuthController extends Controller
{
    private const DEFAULT_RETURN_PATH = '/dashboard';

    public function redirect(): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse
    {
        Session::put('return_to', $this->safeReturnPath(request()->query('return_to')));

        return Socialite::driver('google')->redirect();
    }

    public function callback(ConnectGoogleAccount $connectGoogleAccount): RedirectResponse
    {
        $returnTo = $this->safeReturnPath(Session::pull('return_to'));

        try {
            /** @var SocialiteUser $oauthUser */
            $oauthUser = Socialite::driver('google')->user();
            $avatarUrl = $oauthUser->avatar;
            if (! $oauthUser->email) {
                logger()->alert('User has no email', [
                    'provider' => 'google',
                    'provider_id' => $oauthUser->id,
                ]);

                return redirect(frontend_url('/auth/login'));
            }

            if (! $this->emailIsVerified($oauthUser)) {
                logger()->warning('User has an unverified provider email', [
                    'provider' => 'google',
                    'provider_id' => $oauthUser->id,
                ]);

                return redirect(frontend_url('/auth/login'));
            }

            $name = trim((string) $oauthUser->getName());

            $user = $connectGoogleAccount->handle(
                googleId: $oauthUser->id,
                name: $name !== '' ? $name : Str::before($oauthUser->email, '@'),
                email: $oauthUser->email,
                avatarUrl: $avatarUrl,
                accessToken: $oauthUser->token,
                refreshToken: $oauthUser->refreshToken,
            );

            Auth::login($user);
            request()->session()->regenerate();

            return redirect(frontend_url($returnTo));
        } catch (ClientException $e) {
            if (request('error') === 'access_denied') {
                logger()->warning('User denied access', [
                    'provider' => 'google',
                ]);

                return redirect(frontend_url('/auth/login'));
            }
            logger()->error('An error occurred while trying to login via Google', [
                'exception' => $e,
            ]);

            return redirect(frontend_url('/auth/login'));
        } catch (\Exception $e) {
            logger()->error('An error occurred while trying to login via Google', [
                'exception' => $e,
            ]);

            return redirect(frontend_url('/auth/login'));
        }
    }

    private function emailIsVerified(SocialiteUser $oauthUser): bool
    {
        return filter_var($oauthUser->getRaw()['email_verified'] ?? false, FILTER_VALIDATE_BOOL);
    }

    private function safeReturnPath(mixed $path): string
    {
        if (
            ! is_string($path)
            || strlen($path) > 2048
            || ! str_starts_with($path, '/')
            || str_starts_with($path, '//')
            || str_contains($path, '\\')
            || preg_match('/[\x00-\x1F\x7F]/', $path) === 1
        ) {
            return self::DEFAULT_RETURN_PATH;
        }

        return $path;
    }
}
