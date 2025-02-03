<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Content Security Policy (CSP)
        $response->headers->set('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none';");

        // Strict Transport Security (HSTS) - ensures HTTPS connections
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // X-Frame-Options - prevents clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');

        // X-XSS-Protection - mitigates certain types of XSS attacks
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // X-Content-Type-Options - prevents MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Referrer-Policy - controls when and how referrer information is sent
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');

        // Permissions-Policy - controls which features the browser can use
        $response->headers->set('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');

        // Cache-Control - prevents caching of sensitive information
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

        // Feature-Policy - controls which browser features can be used
        $response->headers->set('Feature-Policy', 'geolocation "self"; microphone "none"; camera "none"');

        return $response;
    }
}
