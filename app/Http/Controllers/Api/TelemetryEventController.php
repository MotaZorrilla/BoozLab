<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatTelemetryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TelemetryEventController extends Controller
{
    public function __construct(
        protected ChatTelemetryService $telemetry
    ) {}

    /**
     * Record a client-side interaction event (WhatsApp click, Lira action, etc.) in a fail-safe way.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_type' => ['required', 'string', 'max:64'],
            'channel' => ['nullable', 'string', 'max:32'],
            'source' => ['nullable', 'string', 'max:64'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'session_uid' => ['nullable', 'string', 'max:100'],
            'metadata' => ['nullable', 'array'],
        ]);

        $this->telemetry->recordInteraction(
            $validated['event_type'],
            $validated['channel'] ?? 'whatsapp',
            $validated['source'] ?? 'web',
            $validated['product_id'] ?? null,
            $validated['session_uid'] ?? null,
            $validated['metadata'] ?? []
        );

        return response()->json([
            'success' => true,
            'message' => 'Event recorded successfully',
        ], 200);
    }
}
