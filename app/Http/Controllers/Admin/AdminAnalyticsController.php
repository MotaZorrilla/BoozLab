<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminAnalyticsController extends Controller
{
    /**
     * Display Lira AI telemetry and conversation monitoring dashboard.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today();

        // 1. KPIs Globales
        $totalSessions = ChatSession::count();
        $todaySessions = ChatSession::whereDate('started_at', $today)->count();
        $totalMessages = ChatMessage::count();
        $avgLatency = (int) round(ChatMessage::where('role', 'assistant')->avg('latency_ms') ?: 0);

        $geminiCalls = ChatMessage::where('source', 'gemini_api')->count();
        $deterministicCalls = ChatMessage::where('source', 'like', 'deterministic_%')->count();
        $guardrailsTriggered = ChatMessage::whereNotNull('guardrail_triggered')->count();

        $convertedSessions = ChatSession::where('converted_to_order', true)->count();
        $conversionRate = $totalSessions > 0 ? round(($convertedSessions / $totalSessions) * 100, 1) : 0.0;

        // 2. Gráfico Cronológico (Últimos 7 días)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::today()->subDays($i);
            $dateStr = $day->toDateString();
            $label = $day->locale('es')->isoFormat('ddd D');

            $daySessions = ChatSession::whereDate('started_at', $dateStr)->count();
            $dayGemini = ChatMessage::where('source', 'gemini_api')->whereDate('created_at', $dateStr)->count();
            $dayDet = ChatMessage::where('source', 'like', 'deterministic_%')->whereDate('created_at', $dateStr)->count();

            $chartData[] = [
                'date' => $dateStr,
                'label' => ucfirst($label),
                'sessions' => $daySessions,
                'gemini' => $dayGemini,
                'deterministic' => $dayDet,
            ];
        }

        // 3. Medicamentos más consultados / recomendados
        $productMentions = [];
        $sessionsWithProducts = ChatSession::whereNotNull('suggested_product_ids')->get();
        foreach ($sessionsWithProducts as $s) {
            $ids = is_array($s->suggested_product_ids) ? $s->suggested_product_ids : [];
            foreach ($ids as $id) {
                $productMentions[$id] = ($productMentions[$id] ?? 0) + 1;
            }
        }
        arsort($productMentions);
        $topProductIds = array_slice(array_keys($productMentions), 0, 5);
        $productsById = Product::whereIn('id', $topProductIds)->get()->keyBy('id');

        $topProducts = [];
        foreach ($productMentions as $pid => $count) {
            if (isset($productsById[$pid])) {
                $topProducts[] = [
                    'id' => $pid,
                    'name' => $productsById[$pid]->name,
                    'presentation' => $productsById[$pid]->presentation,
                    'count' => $count,
                ];
                if (count($topProducts) >= 5) {
                    break;
                }
            }
        }

        // 4. Estadísticas de Guardrails Sanitarios
        $guardrailStats = ChatMessage::whereNotNull('guardrail_triggered')
            ->selectRaw('guardrail_triggered as name, count(*) as count')
            ->groupBy('guardrail_triggered')
            ->orderByDesc('count')
            ->take(5)
            ->get()
            ->toArray();

        // 5. Sesiones Paginadas con Filtros
        $query = ChatSession::withCount('messages')->latest('started_at');

        if ($search = $request->input('search')) {
            $query->search($search);
        }

        if ($source = $request->input('source')) {
            $query->bySource($source);
        }

        if ($request->filled('from') || $request->filled('to')) {
            $query->byDateRange($request->input('from'), $request->input('to'));
        }

        $sessions = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/analytics', [
            'kpis' => [
                'total_sessions' => $totalSessions,
                'today_sessions' => $todaySessions,
                'total_messages' => $totalMessages,
                'avg_latency_ms' => $avgLatency,
                'gemini_calls_count' => $geminiCalls,
                'deterministic_calls_count' => $deterministicCalls,
                'guardrails_triggered_count' => $guardrailsTriggered,
                'conversion_rate' => $conversionRate,
                'converted_sessions' => $convertedSessions,
            ],
            'chartData' => $chartData,
            'topProducts' => $topProducts,
            'guardrailStats' => $guardrailStats,
            'sessions' => $sessions,
            'filters' => [
                'search' => $request->input('search', ''),
                'source' => $request->input('source', 'all'),
                'from' => $request->input('from', ''),
                'to' => $request->input('to', ''),
            ],
        ]);
    }

    /**
     * Get details and messages of a single session for transcript review.
     */
    public function conversation(ChatSession $session): JsonResponse
    {
        $session->load('messages');

        return response()->json([
            'success' => true,
            'session' => $session,
        ]);
    }

    /**
     * Export all or filtered chat sessions to a CSV file for Excel audit.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $query = ChatSession::withCount('messages')->latest('started_at');

        if ($search = $request->input('search')) {
            $query->search($search);
        }

        if ($source = $request->input('source')) {
            $query->bySource($source);
        }

        if ($request->filled('from') || $request->filled('to')) {
            $query->byDateRange($request->input('from'), $request->input('to'));
        }

        $sessions = $query->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="boozlab_telemetria_lira_'.now()->format('Ymd_His').'.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($sessions) {
            $handle = fopen('php://output', 'w');
            fputs($handle, "\xEF\xBB\xBF"); // UTF-8 BOM

            fputcsv($handle, [
                'ID Sesión',
                'Fecha Inicio',
                'Fecha Fin',
                'Turnos',
                'Latencia Total (ms)',
                'Última Fuente',
                'Primera Pregunta',
                'Acción',
                'URL Origen',
                'Convertido a Pedido',
            ], ';');

            foreach ($sessions as $s) {
                fputcsv($handle, [
                    $s->session_uid,
                    $s->started_at ? $s->started_at->format('Y-m-d H:i:s') : 'N/A',
                    $s->ended_at ? $s->ended_at->format('Y-m-d H:i:s') : 'N/A',
                    $s->turn_count,
                    $s->total_latency_ms,
                    $s->last_source ?? 'N/A',
                    $s->first_query ?? 'N/A',
                    $s->action ?? 'Ninguna',
                    $s->url_ref ?? '/',
                    $s->converted_to_order ? 'SÍ' : 'NO',
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }
}
