<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SystemSetting;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class AdminAiController extends Controller
{
    public function index(): Response
    {
        $realKey = SettingService::geminiKey();
        $isKeySet = ! empty($realKey);
        $maskedKey = '';

        if ($isKeySet) {
            $len = strlen($realKey);
            $prefix = substr($realKey, 0, 6);
            $suffix = substr($realKey, -4);
            $maskedKey = $len > 10 ? "{$prefix}..." . str_repeat('*', min(16, $len - 10)) . "...{$suffix}" : '••••••••••••••••';
        }

        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $prescriptionProducts = Product::where('is_active', true)->where('is_prescription_required', true)->count();

        return Inertia::render('admin/ai', [
            'aiConfig' => [
                'hasKey' => $isKeySet,
                'maskedKey' => $maskedKey,
                'model' => SettingService::geminiModel(),
                'systemPrompt' => SettingService::liraSystemPrompt() ?? SystemSetting::get('lira_system_prompt'),
            ],
            'corpusStats' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'prescription_products' => $prescriptionProducts,
                'lines_count' => 4,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gemini_api_key' => ['nullable', 'string', 'max:255'],
            'gemini_model' => ['required', 'string', 'in:gemini-2.5-flash,gemini-1.5-flash,gemini-1.5-pro'],
            'lira_system_prompt' => ['required', 'string', 'max:5000'],
        ]);

        if (! empty($validated['gemini_api_key']) && ! str_contains($validated['gemini_api_key'], '*')) {
            SystemSetting::set('gemini_api_key', $validated['gemini_api_key'], 'encrypted', 'ai', 'Clave de API Google Gemini');
        }

        SystemSetting::set('gemini_model', $validated['gemini_model'], 'string', 'ai', 'Modelo LLM activo');
        SystemSetting::set('lira_system_prompt', $validated['lira_system_prompt'], 'text', 'ai', 'Directriz y personalidad de Lira');

        return back()->with('success', 'Configuración de Inteligencia Artificial guardada con éxito.');
    }

    public function test(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        $apiKey = SettingService::geminiKey();
        $model = SettingService::geminiModel();
        $startTime = microtime(true);

        if (empty($apiKey)) {
            return response()->json([
                'success' => true,
                'source' => 'deterministic_engine',
                'latency_ms' => round((microtime(true) - $startTime) * 1000),
                'response' => 'Modo local activo (sin API Key configurada). Lira responde mediante el motor clínico determinístico de Booz Laboratorio.',
            ]);
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
            $response = Http::timeout(10)
                ->withOptions(['verify' => false]) // Resiliencia SSL local
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => "Prueba de conectividad técnica para Booz Laboratorio. Responde en una oración confirmando la conexión activa. Consulta: {$validated['message']}"],
                            ],
                        ],
                    ],
                ]);

            $latency = round((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Conexión exitosa pero sin texto devuelto.';
                return response()->json([
                    'success' => true,
                    'source' => 'gemini_api',
                    'latency_ms' => $latency,
                    'response' => trim($reply),
                ]);
            }

            return response()->json([
                'success' => false,
                'source' => 'gemini_api_error',
                'latency_ms' => $latency,
                'error' => "Error HTTP {$response->status()}: " . substr($response->body(), 0, 150),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'source' => 'exception',
                'latency_ms' => round((microtime(true) - $startTime) * 1000),
                'error' => 'Fallo de conexión con Google Gemini: ' . $e->getMessage(),
            ], 500);
        }
    }
}
