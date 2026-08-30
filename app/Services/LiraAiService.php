<?php

namespace App\Services;

use App\Models\AiGuardrail;
use App\Models\AiKnowledgeDocument;
use App\Models\Product;
use App\Models\ProductLine;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LiraAiService
{
    /**
     * Regex pattern to detect clinical or pharmacological intent requiring a medical disclaimer.
     */
    public const CLINICAL_INTENT_PATTERN = '/(dosis|dolor|infecci|herida|tomar|aplicar|tratamiento|receta|r[eé]cipe|s[ií]ntoma|medicamento|pie diab[eé]tico|indicaci[oó]n|posolog[ií]a)/iu';

    protected ?array $lastCallMetadata = null;

    public function getLastCallMetadata(): ?array
    {
        return $this->lastCallMetadata;
    }

    /**
     * Process query through Gemini AI with fallback to deterministic knowledge engine.
     *
     * @return array{reply: string, suggestedProducts: Collection|array, disclaimer: ?string, source: string, action?: string, latency_ms?: int, model?: string, prompt_tokens?: ?int, completion_tokens?: ?int, guardrail_triggered?: ?string}
     */
    public function answer(string $query): array
    {
        $startTime = microtime(true);
        $q = trim($query);

        if (empty($q)) {
            $linesCount = ProductLine::count();
            $productsCount = Product::active()->count();

            return [
                'reply' => "¡Hola! 🐾 Soy Lira, la asistente virtual oficial de Booz Laboratorio. ¿En qué puedo orientarte hoy sobre nuestras {$linesCount} líneas terapéuticas o nuestro catálogo de {$productsCount} fármacos?",
                'suggestedProducts' => [],
                'disclaimer' => null,
                'source' => 'welcome_prompt',
                'model' => 'system_prompt',
                'latency_ms' => 0,
                'prompt_tokens' => null,
                'completion_tokens' => null,
                'guardrail_triggered' => null,
            ];
        }

        $matchedProducts = $this->matchProducts($q);

        // 1. Intentar responder mediante Gemini AI si la clave está configurada
        $geminiApiKey = SettingService::geminiKey();
        if (! empty($geminiApiKey)) {
            try {
                $aiResponse = $this->callGemini($q, $geminiApiKey);
                if (! empty($aiResponse)) {
                    $isClinical = (bool) preg_match(self::CLINICAL_INTENT_PATTERN, $q);
                    $meta = $this->lastCallMetadata ?? [];

                    return [
                        'reply' => $aiResponse,
                        'suggestedProducts' => $matchedProducts,
                        'disclaimer' => $isClinical ? SettingService::legalDisclaimer() : null,
                        'source' => 'gemini_api',
                        'model' => $meta['model'] ?? SettingService::geminiModel(),
                        'latency_ms' => $meta['latency_ms'] ?? (int) round((microtime(true) - $startTime) * 1000),
                        'prompt_tokens' => $meta['prompt_tokens'] ?? null,
                        'completion_tokens' => $meta['completion_tokens'] ?? null,
                        'guardrail_triggered' => $this->detectTriggeredGuardrail($q),
                    ];
                }
            } catch (\Throwable $e) {
                Log::warning('LiraAiService: Fallback por error en Gemini: '.$e->getMessage());
            }
        }

        // 2. Motor Determinístico Dinámico y Deshardcodeado
        $result = $this->queryDeterministic($q, $matchedProducts);
        $result['latency_ms'] = (int) round((microtime(true) - $startTime) * 1000);
        $result['model'] = 'deterministic-engine';
        $result['prompt_tokens'] = null;
        $result['completion_tokens'] = null;
        $result['guardrail_triggered'] = $this->detectTriggeredGuardrail($q);

        return $result;
    }

    /**
     * Match products by brand, full name, or active ingredients.
     */
    public function matchProducts(string $query): Collection
    {
        $normalizedQuery = mb_strtolower($query, 'UTF-8');

        return Product::with('productLine')
            ->active()
            ->get()
            ->filter(function (Product $product) use ($normalizedQuery) {
                $name = mb_strtolower($product->name, 'UTF-8');
                $brand = mb_strtolower(explode(' ', $product->name)[0], 'UTF-8');
                $act = mb_strtolower($product->active_ingredients, 'UTF-8');

                if (str_contains($normalizedQuery, $brand) || str_contains($normalizedQuery, $name) || str_contains($name, $normalizedQuery)) {
                    return true;
                }

                $actWords = preg_split('/[\s\+\,\-]+/', $act, -1, PREG_SPLIT_NO_EMPTY);
                foreach ($actWords as $w) {
                    if (mb_strlen($w) > 4 && str_contains($normalizedQuery, $w)) {
                        return true;
                    }
                }

                return false;
            })->take(3)->values();
    }

    /**
     * Call Google Gemini API using dynamic RAG context.
     */
    public function callGemini(string $userPrompt, string $apiKey, ?string $model = null): ?string
    {
        $model = $model ?: SettingService::geminiModel();
        $systemInstruction = $this->buildSystemInstruction();

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $systemInstruction]],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $userPrompt]],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.3,
                'maxOutputTokens' => 600,
            ],
        ];

        $startTime = microtime(true);
        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
        ])->withOptions([
            'verify' => false,
        ])->timeout(15)->post($endpoint, $payload);

        $elapsedMs = (int) round((microtime(true) - $startTime) * 1000);

        if ($response->successful()) {
            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
            $usage = $data['usageMetadata'] ?? [];

            $this->lastCallMetadata = [
                'latency_ms' => $elapsedMs,
                'model' => $model,
                'prompt_tokens' => $usage['promptTokenCount'] ?? null,
                'completion_tokens' => $usage['candidatesTokenCount'] ?? null,
            ];

            if (! empty($text)) {
                $formatted = nl2br(e($text));
                $formatted = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $formatted);

                return preg_replace('/\* (.*?)(<br \/>|\n|$)/', '• $1$2', $formatted);
            }
        }

        return null;
    }

    /**
     * Detect if a user query triggers any active health guardrail or clinical safety boundary.
     */
    public function detectTriggeredGuardrail(string $query): ?string
    {
        $q = mb_strtolower($query, 'UTF-8');

        if (preg_match('/(cu[aá]ntas pastillas|cuantas pastillas|sobredosis|me quiero morir|intoxicaci[oó]n|veneno)/iu', $q)) {
            return 'Prevención de Intoxicación y Emergencia';
        }

        if (preg_match('/(puedo tomar antibi[oó]tico sin receta|rec[eé]tame|qu[eé] me tomo para la neumon[ií]a)/iu', $q)) {
            return 'Prohibición Estricta de Prescripción Médica';
        }

        return null;
    }

    /**
     * Assemble full system instruction with dynamic RAG context.
     */
    public function buildSystemInstruction(): string
    {
        $productsContext = Cache::remember('chatbot:products_context', 1800, function () {
            $lines = ProductLine::with(['products' => function ($q) {
                $q->active()->orderBy('name');
            }])->get();

            $output = [];
            foreach ($lines as $line) {
                $output[] = "LÍNEA {$line->code}: {$line->name}";
                foreach ($line->products as $p) {
                    $rec = $p->is_prescription_required ? 'Requiere Récipe Médico' : 'Venta Libre';
                    $pos = ! empty($p->posology) ? " Posología: {$p->posology}." : '';
                    $output[] = "  - {$p->name} ({$p->presentation}): Principios: {$p->active_ingredients}. Indicaciones: {$p->indications}.{$pos} [{$rec}]";
                }
            }

            return implode("\n", $output);
        });

        $knowledgeContext = Cache::remember('chatbot:ai_knowledge_context', 1800, function () {
            $docs = AiKnowledgeDocument::active()->orderBy('order')->get();
            if ($docs->isEmpty()) {
                return '';
            }

            $blocks = [];
            foreach ($docs as $doc) {
                $blocks[] = "=== DOCUMENTO ENTRENADO: {$doc->title} [Categoría: {$doc->category}] ===\n{$doc->content}";
            }

            return implode("\n\n", $blocks);
        });

        $guardrailsContext = Cache::remember('chatbot:ai_guardrails_context', 1800, function () {
            $guardrails = AiGuardrail::active()->orderBy('order')->get();
            if ($guardrails->isEmpty()) {
                return '';
            }

            $rules = [];
            $i = 1;
            foreach ($guardrails as $g) {
                $typeTag = strtoupper(str_replace('_', ' ', $g->type));
                $rules[] = "{$i}. [{$typeTag}] {$g->name}: {$g->rule_instruction}";
                $i++;
            }

            return implode("\n", $rules);
        });

        $basePrompt = SettingService::liraSystemPrompt() ?? sprintf(
            'Eres Lira, la perrita mascota y asistente virtual científica oficial de %s (RIF %s, ubicada en %s, Venezuela). Tu personalidad es profesional, empática, cálida y con rigor científico. Llevas bata de laboratorio.',
            SettingService::companyName(),
            SettingService::companyRif(),
            SettingService::plantLocation()
        );

        $totalProducts = Product::active()->count();

        return "{$basePrompt}

================================================================================
BASE DE CONOCIMIENTO Y ENTRENAMIENTO DOCUMENTAL DEL LABORATORIO:
{$knowledgeContext}
================================================================================

VADEMÉCUM CLÍNICO ACTIVO ({$totalProducts} FÁRMACOS):
{$productsContext}

GUARDRAILS SANITARIOS Y REGLAS DE CONTENCIÓN OBLIGATORIAS:
{$guardrailsContext}
- NUNCA diagnostiques ni recetes tratamientos para patologías personales. Booz Laboratorio NO promueve la automedicación.
- Si el usuario pregunta qué tomar para un dolor, infección o herida, oriéntale sobre qué productos de nuestro catálogo existen para esa área, pero indícale claramente que debe acudir a su médico tratante o dermatólogo para recibir la prescripción adecuada.
- Si mencionas medicamentos con antibióticos o esteroides, advierte obligatoriamente que son de venta bajo estricto récipe médico.
- Responde en español con formato enriquecido (usa <strong> y listas con viñetas). Mantén respuestas breves (máximo 2 a 3 párrafos concisos).
- Si el usuario desea comunicarse con el administrador, directiva, cotizar al mayor o hacer consultas comerciales, invítalo con entusiasmo a enviar sus datos de contacto para que el equipo administrativo lo contacte de inmediato.";
    }

    /**
     * Deterministic knowledge engine dynamically resolving settings, products, and lines.
     */
    public function queryDeterministic(string $query, ?Collection $matchedProducts = null): array
    {
        $q = mb_strtolower($query, 'UTF-8');
        $matchedProducts = $matchedProducts ?: $this->matchProducts($query);

        $phone = SettingService::whatsappPhone();
        $rif = SettingService::companyRif();
        $company = SettingService::companyName();
        $plant = SettingService::plantLocation();
        $office = SettingService::officeLocation();
        $instagram = SettingService::companyInstagram();
        $disclaimer = SettingService::legalDisclaimer();
        $totalProducts = Product::active()->count();

        // Intención 1: Saludos
        if (preg_match('/^(hola|buenos d[ií]as|buenas tardes|buenas noches|saludos|quien eres)/iu', $q)) {
            return [
                'reply' => '¡Hola! Soy Lira, la asistente virtual y mascota científica de Booz Laboratorio 🐾. Estoy aquí para orientarte sobre nuestros medicamentos, fórmulas activas, líneas terapéuticas y posología oficial. También puedo comunicarte directamente con nuestro equipo administrativo si lo deseas. ¿Qué te gustaría consultar hoy?',
                'suggestedProducts' => [],
                'disclaimer' => null,
                'source' => 'deterministic_greeting',
            ];
        }

        // Intención 2: Farmacovigilancia y RAM
        if (preg_match('/(farmacovigilancia|reacci[oó]n adversa|reaccion adversa|ram|efecto secundario|lote)/iu', $q)) {
            return [
                'reply' => "En Booz Laboratorio contamos con un <strong>Protocolo Operativo de Farmacovigilancia</strong> conforme a las normativas del INH Rafael Rangel. Si sospechas de una reacción adversa a alguno de nuestros {$totalProducts} medicamentos, por favor indícanos el nombre del fármaco, número de lote, fecha de vencimiento y sintomatología en nuestro <a href=\"/farmacovigilancia\" class=\"text-blue-600 font-bold underline\">formulario oficial de Farmacovigilancia</a>. Si los síntomas son severos, busca atención médica de emergencia inmediatamente.",
                'suggestedProducts' => [],
                'disclaimer' => $disclaimer,
                'source' => 'deterministic_pharmacovigilance',
            ];
        }

        // Intención 3: Cotización y Pedidos
        if (preg_match('/(como cotizar|c[oó]mo pedir|hacer pedido|cotizaci[oó]n|cu[aá]nto cuesta|precios|despacho)/iu', $q)) {
            return [
                'reply' => "Puedes cotizar cualquiera de nuestros {$totalProducts} fármacos de dos maneras muy sencillas:<br>1. <strong>Bolsa de Pedidos Web:</strong> Agrega los productos a tu carrito en nuestra tienda virtual, selecciona tu tipo de cliente (Paciente, Farmacia o Clínica) y presiona \"Solicitar Pedido por WhatsApp\".<br>2. <strong>Contacto Directo por WhatsApp:</strong> Comunícate al <strong>+{$phone}</strong>. Despachamos a toda Venezuela directamente desde nuestra planta en {$plant}.",
                'suggestedProducts' => [],
                'disclaimer' => null,
                'source' => 'deterministic_quote',
            ];
        }

        // Intención 4: Contacto con Administración
        if (preg_match('/(contactar|administra|hablar con|dejar mensaje|comprar al mayor|distribui|representante|due[ñn]o|gerente|comunicar)/iu', $q)) {
            return [
                'reply' => '¡Con mucho gusto! 🐾 En Booz Laboratorio nuestra directiva y equipo administrativo están siempre atentos para atenderte. Puedes <strong>dejar tus datos en el formulario de contacto</strong> aquí mismo y nuestro equipo te contactará de inmediato.',
                'suggestedProducts' => [],
                'action' => 'show_contact_form',
                'disclaimer' => null,
                'source' => 'deterministic_contact',
            ];
        }

        // Intención 5: Ubicación, RIF y Redes
        if (str_contains($q, 'donde') || str_contains($q, 'dónde') || str_contains($q, 'contacto') || str_contains($q, 'valle de guanape') || str_contains($q, 'ubicad') || str_contains($q, 'puerto ordaz')) {
            return [
                'reply' => "<strong>{$company}</strong> (RIF {$rif})<br>Planta Principal: {$plant}.<br>Oficinas Comerciales: {$office}.<br>Instagram: <strong>{$instagram}</strong> • WhatsApp: +{$phone}.",
                'suggestedProducts' => [],
                'disclaimer' => null,
                'source' => 'deterministic_location',
            ];
        }

        // Intención 6: Coincidencia directa de Fármaco en catálogo
        if ($matchedProducts->isNotEmpty()) {
            foreach ($matchedProducts as $mp) {
                $mp->increment('chatbot_inquiries_count');
            }

            $first = $matchedProducts->first();
            $safeName = e($first->name);
            $safePres = e($first->presentation);
            $safeAct = e($first->active_ingredients);
            $safeLine = e($first->productLine?->name ?? 'Línea Booz');
            $safeInd = e($first->indications);

            $reply = "En nuestro catálogo oficial contamos con <strong>{$safeName}</strong> ({$safePres}). ".
                     "Formulado con <strong>{$safeAct}</strong> para la línea de <em>{$safeLine}</em>.<br>".
                     "<strong>Indicaciones principales:</strong> {$safeInd}.";

            if ($first->is_prescription_required) {
                $reply .= "<br><span class='text-amber-500 font-bold'>Nota médica: Este producto requiere récipe médico para su dispensación formal.</span>";
            }

            return [
                'reply' => $reply,
                'suggestedProducts' => $matchedProducts,
                'disclaimer' => $disclaimer,
                'source' => 'deterministic_product_match',
            ];
        }

        // Intención 7: Consulta de Líneas Terapéuticas (Dinámica)
        if (str_contains($q, 'linea') || str_contains($q, 'línea')) {
            $lines = ProductLine::with(['products' => fn ($p) => $p->active()->orderBy('name')])->get();
            $linesReply = "En Booz Laboratorio contamos con <strong>{$lines->count()} Líneas Terapéuticas Oficiales</strong>:<br>";
            $i = 1;
            foreach ($lines as $l) {
                $prods = $l->products->pluck('name')->map(fn ($n) => explode(' ', $n)[0])->unique()->implode(', ');
                $linesReply .= "{$i}. <strong>{$l->name}:</strong> {$prods}.<br>";
                $i++;
            }

            return [
                'reply' => rtrim($linesReply, '<br>'),
                'suggestedProducts' => [],
                'disclaimer' => null,
                'source' => 'deterministic_lines',
            ];
        }

        // Intención 8: Bactrocis & Pie Diabético (Dinámico desde BD)
        if (str_contains($q, 'pie') || str_contains($q, 'diabetico') || str_contains($q, 'diabético') || str_contains($q, 'bactrocis') || str_contains($q, 'moxifloxacina')) {
            $bactrocis = Product::active()->where('slug', 'like', '%bactrocis%')->first();
            if ($bactrocis) {
                $bactrocis->increment('chatbot_inquiries_count');
                $indications = e($bactrocis->indications);
                $prescriptionNote = $bactrocis->is_prescription_required
                    ? '<br><span class="text-amber-500 font-bold">Nota médica: Requiere récipe médico para su adquisición.</span>'
                    : '';

                return [
                    'reply' => "Para el manejo especializado de heridas complejas en Pie Diabético, Booz Laboratorio ha desarrollado <strong>{$bactrocis->name} ({$bactrocis->active_ingredients})</strong>. {$indications} {$prescriptionNote}",
                    'suggestedProducts' => [$bactrocis],
                    'disclaimer' => $disclaimer,
                    'source' => 'deterministic_bactrocis',
                ];
            }
        }

        // Intención 9: Consulta genérica con síntomas
        $isClinical = (bool) preg_match(self::CLINICAL_INTENT_PATTERN, $q);

        return [
            'reply' => "Como asistente farmacéutica de Booz Laboratorio, puedo orientarte sobre las características y presentaciones de nuestros {$totalProducts} productos registrados o sobre nuestras líneas terapéuticas. Si presentas malestar o infección, por favor acude a una evaluación médica profesional.",
            'suggestedProducts' => [],
            'disclaimer' => $isClinical ? $disclaimer : null,
            'source' => 'deterministic_fallback',
        ];
    }
}
