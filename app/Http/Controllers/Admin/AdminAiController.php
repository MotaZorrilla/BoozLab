<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiGuardrail;
use App\Models\AiKnowledgeDocument;
use App\Models\Product;
use App\Models\SystemSetting;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
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

        $knowledgeDocuments = AiKnowledgeDocument::orderBy('order')->orderBy('id')->get();
        $guardrails = AiGuardrail::orderBy('order')->orderBy('id')->get();

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
                'documents_count' => $knowledgeDocuments->count(),
                'active_documents_count' => $knowledgeDocuments->where('is_active', true)->count(),
                'guardrails_count' => $guardrails->count(),
                'active_guardrails_count' => $guardrails->where('is_active', true)->count(),
            ],
            'knowledgeDocuments' => $knowledgeDocuments,
            'guardrails' => $guardrails,
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

    // ==========================================
    // GESTIÓN DE DOCUMENTOS DE ENTRENAMIENTO RAG
    // ==========================================

    public function storeDocument(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'category' => ['required', 'string', 'in:vademecum,farmacovigilancia,comercial,protocolo,general'],
            'content' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'mimes:txt,md,json,csv', 'max:10240'],
        ]);

        $content = $validated['content'] ?? '';
        $fileName = null;
        $filePath = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileContent = file_get_contents($file->getRealPath());
            if (empty($content)) {
                $content = $fileContent;
            }
            $targetDir = public_path('assets/docs');
            if (! file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }
            $savedName = 'doc_' . time() . '_' . Str::slug(pathinfo($fileName, PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($targetDir, $savedName);
            $filePath = '/assets/docs/' . $savedName;
        }

        if (empty(trim((string) $content))) {
            return back()->withErrors(['content' => 'Debes ingresar texto o subir un archivo con contenido textual válido.']);
        }

        AiKnowledgeDocument::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'content' => $content,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_size_bytes' => strlen($content),
            'is_active' => true,
            'order' => AiKnowledgeDocument::count() + 1,
        ]);

        Cache::forget('chatbot:ai_knowledge_context');

        return back()->with('success', 'Documento de conocimiento añadido al entrenamiento de Lira AI exitosamente.');
    }

    public function updateDocument(Request $request, AiKnowledgeDocument $document): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'category' => ['required', 'string', 'in:vademecum,farmacovigilancia,comercial,protocolo,general'],
            'content' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        $validated['file_size_bytes'] = strlen($validated['content']);
        $document->update($validated);

        Cache::forget('chatbot:ai_knowledge_context');

        return back()->with('success', "Documento \"{$document->title}\" actualizado exitosamente.");
    }

    public function toggleDocument(AiKnowledgeDocument $document): RedirectResponse
    {
        $document->update(['is_active' => ! $document->is_active]);
        Cache::forget('chatbot:ai_knowledge_context');

        $status = $document->is_active ? 'activado' : 'desactivado';
        return back()->with('success', "Documento \"{$document->title}\" {$status} en el corpus de Lira AI.");
    }

    public function destroyDocument(AiKnowledgeDocument $document): RedirectResponse
    {
        $title = $document->title;
        $document->delete();
        Cache::forget('chatbot:ai_knowledge_context');

        return back()->with('success', "Documento \"{$title}\" eliminado de la base de conocimiento.");
    }

    // ==========================================
    // GESTIÓN DE GUARDRAILS SANITARIOS
    // ==========================================

    public function storeGuardrail(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string', 'in:bloqueo_estricto,advertencia_sanitaria,derivacion_humana'],
            'rule_instruction' => ['required', 'string', 'max:1000'],
        ]);

        AiGuardrail::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'rule_instruction' => $validated['rule_instruction'],
            'is_active' => true,
            'is_system' => false,
            'order' => AiGuardrail::count() + 1,
        ]);

        Cache::forget('chatbot:ai_guardrails_context');

        return back()->with('success', 'Nuevo guardrail sanitario agregado exitosamente a Lira AI.');
    }

    public function updateGuardrail(Request $request, AiGuardrail $guardrail): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string', 'in:bloqueo_estricto,advertencia_sanitaria,derivacion_humana'],
            'rule_instruction' => ['required', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ]);

        $guardrail->update($validated);
        Cache::forget('chatbot:ai_guardrails_context');

        return back()->with('success', "Guardrail \"{$guardrail->name}\" actualizado con éxito.");
    }

    public function toggleGuardrail(AiGuardrail $guardrail): RedirectResponse
    {
        $guardrail->update(['is_active' => ! $guardrail->is_active]);
        Cache::forget('chatbot:ai_guardrails_context');

        $status = $guardrail->is_active ? 'activado' : 'desactivado';
        return back()->with('success', "Guardrail \"{$guardrail->name}\" {$status} correctamente.");
    }

    public function destroyGuardrail(AiGuardrail $guardrail): RedirectResponse
    {
        if ($guardrail->is_system) {
            return back()->withErrors(['error' => 'No es posible eliminar un guardrail sanitario estructural de sistema. Puedes desactivarlo si lo requieres.']);
        }

        $name = $guardrail->name;
        $guardrail->delete();
        Cache::forget('chatbot:ai_guardrails_context');

        return back()->with('success', "Guardrail \"{$name}\" eliminado.");
    }

    // ==========================================
    // PLAYGROUND INTERACTIVO DE SIMULACIÓN
    // ==========================================

    public function test(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        $apiKey = SettingService::geminiKey();
        $model = SettingService::geminiModel();
        $startTime = microtime(true);

        if (empty($apiKey)) {
            // Simulamos la respuesta con el motor determinístico local enriquecido
            $controller = app(\App\Http\Controllers\ChatbotController::class);
            $fakeRequest = \App\Http\Requests\AskChatbotRequest::create('/api/chatbot', 'POST', ['message' => $validated['message']]);
            $response = $controller->query($fakeRequest);
            $data = $response->getData(true);

            return response()->json([
                'success' => true,
                'source' => 'deterministic_engine',
                'latency_ms' => round((microtime(true) - $startTime) * 1000),
                'response' => strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $data['reply'] ?? '')),
            ]);
        }

        try {
            // Ensamble de todo el contexto RAG activo para la simulación
            $knowledgeContext = Cache::remember('chatbot:ai_knowledge_context', 1800, function () {
                $docs = AiKnowledgeDocument::active()->orderBy('order')->get();
                return $docs->map(fn ($d) => "=== DOCUMENTO ENTRENADO: {$d->title} ===\n{$d->content}")->implode("\n\n");
            });

            $guardrailsContext = Cache::remember('chatbot:ai_guardrails_context', 1800, function () {
                $rules = AiGuardrail::active()->orderBy('order')->get();
                return $rules->map(fn ($g) => "- [{$g->type}] {$g->name}: {$g->rule_instruction}")->implode("\n");
            });

            $basePrompt = SettingService::liraSystemPrompt() ?? 'Eres Lira, la asistente virtual científica de Booz Laboratorio.';
            $systemInstruction = "{$basePrompt}\n\nDOCUMENTOS DE ENTRENAMIENTO:\n{$knowledgeContext}\n\nGUARDRAILS:\n{$guardrailsContext}";

            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
            $response = Http::timeout(10)
                ->withOptions(['verify' => false])
                ->post($url, [
                    'system_instruction' => [
                        'parts' => [['text' => $systemInstruction]],
                    ],
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $validated['message']],
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
