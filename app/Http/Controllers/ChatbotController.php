<?php

namespace App\Http\Controllers;

use App\Http\Requests\AskChatbotRequest;
use App\Services\ChatTelemetryService;
use App\Services\LiraAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    public function __construct(
        protected LiraAiService $liraAi,
        protected ChatTelemetryService $telemetry
    ) {}

    /**
     * Handle query sent to Lira Assistant using real Gemini AI + Booz Catalog context.
     */
    public function query(AskChatbotRequest $request): JsonResponse
    {
        $message = (string) $request->input('message', '');
        $sessionUid = (string) ($request->input('session_uid') ?: Str::uuid()->toString());
        $urlRef = (string) ($request->input('url_ref') ?: '/');

        $result = $this->liraAi->answer($message);

        // Persistencia fail-safe aislada de telemetría médica
        try {
            $this->telemetry->recordTurn($sessionUid, $message, $result, $urlRef, $request);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('ChatbotController: Telemetry failed: '.$e->getMessage());
        }

        $result['session_uid'] = $sessionUid;

        return response()->json($result);
    }
}
