<?php

namespace App\Http\Middleware;

use App\Services\TrafficTelemetryService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageViews
{
    public function __construct(
        protected TrafficTelemetryService $trafficTelemetry
    ) {}

    /**
     * Handle an incoming request without adding any delay.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Perform telemetry work after the response has already been sent to the browser.
     * Guarantees 0.00ms latency overhead for the visitor.
     */
    public function terminate(Request $request, Response $response): void
    {
        if (in_array($response->getStatusCode(), [200, 304])) {
            $this->trafficTelemetry->recordPageView($request);
        }
    }
}
