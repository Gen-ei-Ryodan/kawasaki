<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

Route::get('/', function () {
    return response()->json(['message' => 'Kawasaki Dealer API', 'version' => '1.0']);
});

// Named login route for Sanctum redirect fallback
Route::get('/login', function (Request $request): JsonResponse {
    return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
})->name('login');