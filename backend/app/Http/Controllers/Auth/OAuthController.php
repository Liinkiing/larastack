<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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

    public function callback(): RedirectResponse
    {
        try {
            /** @var \Laravel\Socialite\Two\User $oauthUser */
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

            $user = User::query()->where('google_id', $oauthUser->id)->first();

            if (! $user) {
                $user = User::query()->where('email', $oauthUser->email)->first();
            }

            if ($user) {
                $user->update([
                    'google_id' => $oauthUser->id,
                    'avatar_url' => $avatarUrl,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'google_token' => $oauthUser->token,
                    'google_refresh_token' => $oauthUser->refreshToken,
                ]);
            } else {
                $user = User::create([
                    'name' => $oauthUser->name,
                    'email' => $oauthUser->email,
                    'avatar_url' => $avatarUrl,
                    'email_verified_at' => now(),
                    'google_id' => $oauthUser->id,
                    'google_token' => $oauthUser->token,
                    'google_refresh_token' => $oauthUser->refreshToken,
                ]);
            }

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
