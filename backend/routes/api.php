<?php

use App\Http\Controllers\Auth\MobileAppleAuthController;
use App\Http\Controllers\Auth\MobileGoogleAuthController;
use App\Http\Controllers\Auth\MobileTokenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'mobile'], static function () {
    Route::post('/auth/apple', MobileAppleAuthController::class)
        ->middleware('throttle:30,1');

    Route::post('/auth/google', MobileGoogleAuthController::class)
        ->middleware('throttle:30,1');

    Route::post('/auth/logout', [MobileTokenController::class, 'destroy'])
        ->middleware('auth:sanctum');

    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user()->only([
            'id',
        ]);
    });
});
