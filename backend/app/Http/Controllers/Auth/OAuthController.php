<?php

namespace App\Http\Controllers\Auth;

use App\Actions\ConnectGoogleAccount;
use App\Http\Controllers\Controller;
use Auth;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Session;

class OAuthController extends Controller
{
    public function redirect(): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse
    {
        if (request()->has('return_to')) {
            Session::put('return_to', request()->get('return_to'));
        }

        return Socialite::driver('google')->redirect();
    }

    public function callback(ConnectGoogleAccount $connectGoogleAccount): RedirectResponse
    {
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

            $user = $connectGoogleAccount->handle(
                googleId: $oauthUser->id,
                name: $oauthUser->name,
                email: $oauthUser->email,
                avatarUrl: $avatarUrl,
                accessToken: $oauthUser->token,
                refreshToken: $oauthUser->refreshToken,
            );

            $returnTo = Session::get('return_to', '/dashboard');
            Auth::login($user);
            request()->session()->regenerate();
            Session::forget('return_to');

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
}
