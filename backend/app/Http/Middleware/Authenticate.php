<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Auth\Middleware\Authenticate as BaseAuthenticate;

class Authenticate extends BaseAuthenticate
{
    protected function redirectTo(Request $request)
    {
        if ($request->is('api/*') || $request->expectsJson()) {
            abort(401, 'Unauthenticated');
        }

        return route('login');
    }
}