<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\OAuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::prefix('/auth/{provider}')
    ->where(['provider' => 'google'])
    ->group(function () {
        Route::get('/redirect', [OAuthController::class, 'redirect']);
        Route::get('/callback', [OAuthController::class, 'callback']);
    });
