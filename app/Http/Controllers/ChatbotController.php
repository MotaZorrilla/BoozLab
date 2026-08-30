<?php

namespace App\Http\Controllers;

use App\Http\Requests\AskChatbotRequest;
use App\Services\LiraAiService;
use Illuminate\Http\JsonResponse;

class ChatbotController extends Controller
{
    public function __construct(
        protected LiraAiService $liraAi
    ) {}

    /**
     * Handle query sent to Lira Assistant using real Gemini AI + Booz Catalog context.
     */
    public function query(AskChatbotRequest $request): JsonResponse
    {
        $message = (string) $request->input('message', '');
        $result = $this->liraAi->answer($message);

        return response()->json($result);
    }
}
