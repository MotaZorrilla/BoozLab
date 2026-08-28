<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductLine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    /**
     * Handle query sent to Lira Assistant.
     */
    public function query(Request $request): JsonResponse
    {
        $query = trim($request->input('message', ''));

        if (empty($query)) {
            return response()->json([
                'reply' => '¡Hola! 🐾 Soy Lira, tu asistente virtual de Booz Laboratorio. ¿En qué puedo orientarte hoy sobre nuestras 4 líneas terapéuticas o catálogo de productos?',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        $q = mb_strtolower($query, 'UTF-8');
        $disclaimer = '⚠️ Aviso Ético y Sanitario: Booz Laboratorio no promueve la automedicación. Esta respuesta tiene fines estrictamente informativos. Consulta siempre a tu médico o farmacéutico tratante antes de iniciar cualquier tratamiento farmacológico.';

        // 1. Direct Greetings
        if (preg_match('/^(hola|buenos d[ií]as|buenas tardes|buenas noches|saludos|quien eres)/i', $q)) {
            return response()->json([
                'reply' => '¡Hola! Soy Lira, la mascota y asistente digital de Booz Laboratorio 🐾. Estoy aquí para orientarte sobre las características, principios activos y líneas terapéuticas de nuestros medicamentos y productos dermocosméticos. ¿Qué producto o área de salud deseas consultar?',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        // 2. Specific Product Searches in Database
        $matchedProducts = Product::with('productLine')
            ->where('is_active', true)
            ->where(function ($builder) use ($q) {
                $builder->whereRaw('LOWER(name) LIKE ?', ["%{$q}%"])
                    ->orWhereRaw('LOWER(active_ingredients) LIKE ?', ["%{$q}%"])
                    ->orWhereRaw('LOWER(description) LIKE ?', ["%{$q}%"])
                    ->orWhereRaw('LOWER(indications) LIKE ?', ["%{$q}%"]);
            })
            ->limit(3)
            ->get();

        if ($matchedProducts->isNotEmpty()) {
            $first = $matchedProducts->first();
            $reply = "En nuestro catálogo contamos con <strong>{$first->name}</strong> ({$first->presentation}). ".
                     "Formulado en base a <strong>{$first->active_ingredients}</strong> para la línea de <em>{$first->productLine->name}</em>. ".
                     "<strong>Indicaciones principales:</strong> {$first->indications}.";

            if ($first->is_prescription_required) {
                $reply .= " <br><span class='text-amber-600 font-semibold'>Nota: Este producto requiere récipe médico para su dispensación.</span>";
            }

            return response()->json([
                'reply' => $reply,
                'suggestedProducts' => $matchedProducts,
                'disclaimer' => $disclaimer,
            ]);
        }

        // 3. Product Lines Inquiries
        if (str_contains($q, 'linea') || str_contains($q, 'línea') || str_contains($q, 'lineas') || str_contains($q, 'líneas')) {
            $lines = ProductLine::all();
            $reply = 'En Booz Laboratorio contamos con <strong>4 Líneas Terapéuticas Oficiales</strong>:<br>'.
                     '1. <strong>Cuidado de la Piel:</strong> Calamicis, Beducis, Hidramer, Centellacis.<br>'.
                     '2. <strong>Tratamiento Tópico:</strong> Bacumer, Amikacis, Gentamicis, Betamer, Betasalicis, Betagemer, Quadrimer, Micosmer.<br>'.
                     '3. <strong>Salud y Bienestar:</strong> Albemer suspensión, Cevitmer Vitamina C, Booz Sport.<br>'.
                     '4. <strong>Cuidado Especializado:</strong> Bactrocis (Moxifloxacina para Pie Diabético) y Salicis antiacné.';

            return response()->json([
                'reply' => $reply,
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        // 4. Pie Diabético / Heridas complejas
        if (str_contains($q, 'pie diabetico') || str_contains($q, 'pie diabético') || str_contains($q, 'moxifloxacina') || str_contains($q, 'amputacion') || str_contains($q, 'amputación')) {
            $bactrocis = Product::where('slug', 'like', '%bactrocis%')->first();

            return response()->json([
                'reply' => 'Para el manejo especializado de heridas en Pie Diabético, Booz Laboratorio ha desarrollado <strong>Bactrocis Crema (Moxifloxacina 0.5%)</strong>. Es una innovación médica que genera una barrera bioprotectora (biofilm) que previene sobreinfecciones bacterianas y estimula la cicatrización tisular.',
                'suggestedProducts' => $bactrocis ? [$bactrocis] : [],
                'disclaimer' => $disclaimer,
            ]);
        }

        // 5. Farmacovigilancia / Reporte
        if (str_contains($q, 'reporte') || str_contains($q, 'queja') || str_contains($q, 'reclamo') || str_contains($q, 'farmacovigilancia') || str_contains($q, 'reaccion') || str_contains($q, 'reacción')) {
            return response()->json([
                'reply' => "Puedes registrar cualquier reporte de farmacovigilancia, sospecha de reacción adversa o notificación de lote directamente en nuestro canal oficial del Instituto Nacional de Higiene disponible en el enlace <a href='/farmacovigilancia' class='text-blue-600 underline font-bold'>Farmacovigilancia y Quejas</a>.",
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        // 6. Contacto / Sede / Ubicación
        if (str_contains($q, 'donde') || str_contains($q, 'dónde') || str_contains($q, 'contacto') || str_contains($q, 'telefono') || str_contains($q, 'teléfono') || str_contains($q, 'valle de guanape') || str_contains($q, 'puerto ordaz')) {
            return response()->json([
                'reply' => '<strong>BOOZ LABORATORIO VGME, C.A.</strong> (RIF J-40906185-0)<br>Planta y Sede Principal: Av. Hospital cruce con Troncal 11, Valle de Guanape, Edo. Anzoátegui.<br>Oficinas Comerciales: Puerto Ordaz, Edo. Bolívar.<br>Instagram: <strong>@booz.laboratorio</strong>.<br>¿Deseas que te comuniquemos por WhatsApp con un asesor?',
                'suggestedProducts' => [],
                'disclaimer' => null,
            ]);
        }

        // Default Friendly Response with Anti-Automedicación Reminder
        return response()->json([
            'reply' => 'Como asistente farmacéutica de Booz Laboratorio, puedo brindarte información detallada de nuestros 18 productos registrados (como <strong>Bactrocis, Bacumer, Albemer, Amikacis, Betamer, Calamicis</strong>) o sobre nuestras 4 líneas terapéuticas. Si experimentas síntomas de dolor, infección o alergia, por favor acude a una evaluación médica profesional.',
            'suggestedProducts' => [],
            'disclaimer' => $disclaimer,
        ]);
    }
}
