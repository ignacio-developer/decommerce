<?php

namespace App\Providers;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('APP_ENV') === 'production') {
            URL::forceScheme('https');

        }

        // Define a custom method to check for the correct signature.
        URL::macro('alternateHasCorrectSignature', function (Request $request, $absolute = true, array $ignoreQuery = []) {
            $ignoreQuery[] = 'signature';  // Ignore the 'signature' query parameter

            // Build the URL without the signature parameter.
            $absoluteUrl = url($request->path());
            $url = $absolute ? $absoluteUrl : '/'.$request->path();

            // Collect and join query string parameters, excluding the signature.
            $queryString = collect(explode('&', (string) $request->server->get('QUERY_STRING')))
                ->reject(fn ($parameter) => in_array(Str::before($parameter, '='), $ignoreQuery))
                ->join('&');

            // Build the original URL and calculate the expected signature.
            $original = rtrim($url.'?'.$queryString, '?');
            $signature = hash_hmac('sha256', $original, config('app.key'));  // Use the app's key for hashing

            // Compare the calculated signature with the one provided in the request.
            return hash_equals($signature, (string) $request->query('signature', ''));
        });

        // Define a method to validate both the signature and expiration.
        URL::macro('alternateHasValidSignature', function (Request $request, $absolute = true, array $ignoreQuery = []) {
            return URL::alternateHasCorrectSignature($request, $absolute, $ignoreQuery)
                && URL::signatureHasNotExpired($request);
        });

        // Add a helper method to use the custom signature validation in requests.
        Request::macro('hasValidSignature', function ($absolute = true, array $ignoreQuery = []) {
            return URL::alternateHasValidSignature($this, $absolute, $ignoreQuery);
        });
    }
    
}
