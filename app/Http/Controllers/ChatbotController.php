<?php

namespace App\Http\Controllers;

use App\Http\Requests\AskChatbotRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    private const DISCLAIMER = '⚠️ Aviso Ético y Sanitario: Booz Laboratorio no promueve la automedicación. Esta respuesta tiene fines estrictamente informativos y educativos. Consulta siempre a tu médico o farmacéutico tratante antes de iniciar cualquier tratamiento farmacológico.';

    /**
     * Handle query sent to Lira Assistant using real Gemini AI + Booz Catalog context.
     */
    public function query(AskChatbotRequest $request): JsonResponse
    {
        $query = trim((string) $request->input('message', ''));

        if (empty($query)) {
            return response()->json([
                'reply' => '¡Hola! 🐾 Soy Lira, la asistente virtual oficial de Booz Laboratorio. ¿En qué puedo orientarte hoy sobre nuestras 4 líneas terapéuticas o vademécum de productos?',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        $q = mb_strtolower($query, 'UTF-8');

        // 1. Encontrar productos que coincidan por marca (primer término), nombre completo o principios activos
        $matchedProducts = Product::with('productLine')
            ->active()
            ->get()
            ->filter(function ($product) use ($q) {
                $name = mb_strtolower($product->name, 'UTF-8');
                $brandName = mb_strtolower(explode(' ', $product->name)[0], 'UTF-8');
                $act = mb_strtolower($product->active_ingredients, 'UTF-8');

                if (str_contains($q, $brandName) || str_contains($q, $name) || str_contains($name, $q)) {
                    return true;
                }

                $actWords = preg_split('/[\s\+\,\-]+/', $act, -1, PREG_SPLIT_NO_EMPTY);
                foreach ($actWords as $w) {
                    if (mb_strlen($w) > 4 && str_contains($q, $w)) {
                        return true;
                    }
                }

                return false;
            })->take(3)->values();

        // 2. Try calling Real Gemini AI if GEMINI_API_KEY is configured
        $geminiApiKey = config('services.gemini.key');
        if (! empty($geminiApiKey)) {
            try {
                $aiResponse = $this->callGemini($query, $geminiApiKey);
                if (! empty($aiResponse)) {
                    $isClinical = preg_match('/(dosis|dolor|infecci|herida|tomar|aplicar|tratamiento|receta|récipe|s[ií]ntoma|medicamento|pie diab[eé]tico)/i', $query);

                    return response()->json([
                        'reply' => $aiResponse,
                        'suggestedProducts' => $matchedProducts,
                        'disclaimer' => $isClinical ? self::DISCLAIMER : null,
                    ]);
                }
            } catch (\Throwable $e) {
                Log::warning('Gemini AI fallback en BoozLab: '.$e->getMessage());
            }
        }

        // 3. Fallback Deterministic Knowledge Engine con sanitización XSS
        if (preg_match('/^(hola|buenos d[ií]as|buenas tardes|buenas noches|saludos|quien eres)/i', $q)) {
            return response()->json([
                'reply' => '¡Hola! Soy Lira, la asistente virtual y mascota científica de Booz Laboratorio 🐾. Estoy aquí para orientarte sobre nuestros medicamentos, fórmulas activas, líneas terapéuticas y posología oficial. También puedo comunicarte directamente con nuestro equipo administrativo si lo deseas. ¿Qué te gustaría consultar hoy?',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        if (preg_match('/(contactar|administra|hablar con|dejar mensaje|comprar al mayor|distribui|representante|due[ñn]o|gerente|comunicar)/i', $q)) {
            return response()->json([
                'reply' => '¡Con mucho gusto! 🐾 En Booz Laboratorio nuestra directiva y equipo administrativo están siempre atentos para atenderte. Puedes <strong>dejar tus datos en el formulario de contacto</strong> aquí mismo y nuestro equipo te contactará de inmediato.',
                'suggestedProducts' => [],
                'action' => 'show_contact_form',
                'disclaimer' => null,
            ]);
        }

        if (str_contains($q, 'donde') || str_contains($q, 'dónde') || str_contains($q, 'contacto') || str_contains($q, 'valle de guanape') || str_contains($q, 'ubicad') || str_contains($q, 'puerto ordaz')) {
            return response()->json([
                'reply' => '<strong>BOOZ LABORATORIO VGME, C.A.</strong> (RIF J-40906185-0)<br>Planta Principal: Av. Hospital cruce con Troncal 11, Valle de Guanape, Edo. Anzoátegui.<br>Oficinas Comerciales: Puerto Ordaz, Edo. Bolívar.<br>Instagram: <strong>@booz.laboratorio</strong> • WhatsApp: +58 414 8873615.',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

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

            return response()->json([
                'reply' => $reply,
                'suggestedProducts' => $matchedProducts,
                'disclaimer' => self::DISCLAIMER,
            ]);
        }

        if (str_contains($q, 'linea') || str_contains($q, 'línea')) {
            return response()->json([
                'reply' => 'En Booz Laboratorio contamos con <strong>4 Líneas Terapéuticas Oficiales</strong>:<br>'.
                    '1. <strong>Cuidado de la Piel:</strong> Calamicis, Beducis, Hidramer, Centellacis.<br>'.
                    '2. <strong>Tratamiento Tópico:</strong> Bacumer, Amikacis, Gentamicis, Betamer, Betasalicis, Betagemer, Quadrimer, Micosmer.<br>'.
                    '3. <strong>Salud y Bienestar:</strong> Albemer suspensión oral, Cevitmer Vitamina C, Booz Sport.<br>'.
                    '4. <strong>Cuidado Especializado:</strong> Bactrocis (Moxifloxacina con Biofilm para Pie Diabético) y Salicis antiacné.',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        if (str_contains($q, 'pie') || str_contains($q, 'diabetico') || str_contains($q, 'diabético') || str_contains($q, 'bactrocis') || str_contains($q, 'moxifloxacina')) {
            $bactrocis = Product::active()->where('slug', 'like', '%bactrocis%')->first();
            if ($bactrocis) {
                $bactrocis->increment('chatbot_inquiries_count');
            }

            return response()->json([
                'reply' => 'Para el manejo especializado de heridas complejas en Pie Diabético, Booz Laboratorio ha desarrollado <strong>Bactrocis Crema (Moxifloxacina 0.5%)</strong>. Es una innovación médica que genera un biofilm bioprotector que acelera la granulación dérmica y previene el riesgo de amputación. <br><span class="text-amber-500 font-bold">Nota médica: Requiere récipe médico para su adquisición.</span>',
                'suggestedProducts' => $bactrocis ? [$bactrocis] : [],
                'disclaimer' => self::DISCLAIMER,
            ]);
        }

        return response()->json([
            'reply' => 'Como asistente farmacéutica de Booz Laboratorio, puedo orientarte sobre las características y presentaciones de nuestros 18 productos registrados o sobre nuestras 4 líneas terapéuticas. Si presentas malestar o infección, por favor acude a una evaluación médica profesional.',
            'suggestedProducts' => [],
            'disclaimer' => self::DISCLAIMER,
        ]);
    }

    /**
     * Invoke Gemini API with structured prompt and safe headers.
     */
    private function callGemini(string $userPrompt, string $apiKey): ?string
    {
        $productsContext = Cache::remember('chatbot:products_context', 3600, function () {
            return Product::with('productLine')
                ->active()
                ->get(['name', 'product_line_id', 'active_ingredients', 'presentation', 'indications', 'is_prescription_required'])
                ->map(function ($p) {
                    $rec = $p->is_prescription_required ? 'Requiere Récipe' : 'Venta Libre';
                    return "- {$p->name} ({$p->presentation}): Principios: {$p->active_ingredients}. Indicaciones: {$p->indications}. ({$rec})";
                })
                ->implode("\n");
        });

        $systemInstruction = "Eres Lira, la perrita mascota y asistente virtual científica oficial de BOOZ LABORATORIO VGME, C.A. (RIF J-40906185-0, ubicada en Valle de Guanape, Anzoátegui, Venezuela).
Tu personalidad es profesional, empática, cálida y con rigor científico. Llevas una bata de laboratorio y estetoscopio.
Tu misión es explicar claramente las propiedades, principios activos, presentaciones y líneas terapéuticas del catálogo de Booz Laboratorio.

CATÁLOGO OFICIAL DISPONIBLE EN EL LABORATORIO:
{$productsContext}

REGLAS OBLIGATORIAS:
1. NUNCA diagnostiques ni recetes tratamientos para patologías personales. Booz Laboratorio NO promueve la automedicación.
2. Si el usuario pregunta qué tomar para un dolor, infección o herida, oriéntale sobre qué productos de nuestro catálogo existen para esa área, pero indícale claramente que debe acudir a su médico tratante o dermatólogo para recibir la prescripción adecuada.
3. Si mencionas medicamentos con antibióticos (Moxifloxacina, Amikacina, Gentamicina) o esteroides (Betametasona, Dexametasona), advierte obligatoriamente que son de venta bajo estricto récipe médico.
4. Responde en español con formato enriquecido (usa <strong> y listas cortas). Mantén respuestas breves (máximo 2 a 3 párrafos concisos).
5. Si el usuario desea comunicarse con el administrador, directiva, cotizar al mayor o hacer consultas comerciales, invítalo con entusiasmo a enviar sus datos de contacto para que el equipo administrativo lo contacte de inmediato.";

        $model = config('services.gemini.model', 'gemini-2.5-flash');
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
                'maxOutputTokens' => 500,
            ],
        ];

        // API Key transmitida en header x-goog-api-key en vez de URL pública
        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
        ])->timeout(8)->post($endpoint, $payload);

        if ($response->successful()) {
            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if (! empty($text)) {
                $formatted = nl2br(e($text));
                $formatted = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $formatted);
                return preg_replace('/\* (.*?)(<br \/>|\n|$)/', '• $1$2', $formatted);
            }
        }

        return null;
    }
}
