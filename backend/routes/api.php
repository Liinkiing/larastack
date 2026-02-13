<?php

use App\Http\Controllers\Auth\MobileGoogleAuthController;
use App\Http\Controllers\Auth\MobileTokenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/google/mobile', MobileGoogleAuthController::class)
    ->middleware('throttle:30,1');

Route::post('/auth/mobile/logout', [MobileTokenController::class, 'destroy'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
