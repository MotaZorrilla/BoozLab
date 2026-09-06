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

        // 0. Selector de Periodo Temporal Dinámico
        $period = $request->input('period', '7d');

        switch ($period) {
            case '15d':
                $startDate = Carbon::today()->subDays(14);
                $daysCount = 15;
                $groupBy = 'day';
                break;
            case '30d':
                $startDate = Carbon::today()->subDays(29);
                $daysCount = 30;
                $groupBy = 'day';
                break;
            case '6m':
                $startDate = Carbon::today()->subMonths(6)->startOfDay();
                $daysCount = 180;
                $groupBy = 'month'; // o quincenal/mensual
                break;
            case '1y':
                $startDate = Carbon::today()->subYear()->startOfDay();
                $daysCount = 365;
                $groupBy = 'month';
                break;
            case 'all':
                $oldestVisit = \App\Models\DailyVisitor::oldest('date')->value('date');
                $startDate = $oldestVisit ? Carbon::parse($oldestVisit)->startOfDay() : Carbon::today()->subYear();
                $daysCount = Carbon::today()->diffInDays($startDate) + 1;
                $groupBy = 'month';
                break;
            case '7d':
            default:
                $period = '7d';
                $startDate = Carbon::today()->subDays(6);
                $daysCount = 7;
                $groupBy = 'day';
                break;
        }

        // 1. KPIs Globales
        $totalSessions = ChatSession::count();
        $todaySessions = ChatSession::whereDate('started_at', $today)->count();
        $periodSessions = ChatSession::where('started_at', '>=', $startDate)->count();

        $totalMessages = ChatMessage::count();
        $avgLatency = (int) round(ChatMessage::where('role', 'assistant')->avg('latency_ms') ?: 0);

        $geminiCalls = ChatMessage::where('source', 'gemini_api')->count();
        $deterministicCalls = ChatMessage::where('source', 'like', 'deterministic_%')->count();
        $guardrailsTriggered = ChatMessage::whereNotNull('guardrail_triggered')->count();

        $convertedSessions = ChatSession::where('converted_to_order', true)->count();
        $conversionRate = $totalSessions > 0 ? round(($convertedSessions / $totalSessions) * 100, 1) : 0.0;

        // Métricas multi-canal e intenciones WhatsApp
        $whatsappClicksTotal = \App\Models\InteractionEvent::where('event_type', 'whatsapp_click')->count();
        $whatsappClicksToday = \App\Models\InteractionEvent::where('event_type', 'whatsapp_click')->whereDate('created_at', $today)->count();
        $whatsappClicksPeriod = \App\Models\InteractionEvent::where('event_type', 'whatsapp_click')->where('created_at', '>=', $startDate)->count();

        $liraBounces = ChatSession::where('turn_count', 1)->count();
        $liraDeep = ChatSession::where('turn_count', '>=', 2)->count();
        $totalWebMessages = \App\Models\Message::count();
        $totalQuotes = \App\Models\Quote::count();

        // Métricas de Tráfico del Servidor (Páginas Vistas y Visitantes Únicos)
        $totalPageViews = (int) (\App\Models\PageView::sum('views_count') ?: 0);
        $todayPageViews = (int) (\App\Models\PageView::where('date', $today)->sum('views_count') ?: 0);
        $periodPageViews = (int) (\App\Models\PageView::where('date', '>=', $startDate->toDateString())->sum('views_count') ?: 0);

        $totalUniqueVisitors = (int) (\App\Models\DailyVisitor::count() ?: 0);
        $todayUniqueVisitors = (int) (\App\Models\DailyVisitor::where('date', $today)->count() ?: 0);
        $periodUniqueVisitors = (int) (\App\Models\DailyVisitor::where('date', '>=', $startDate->toDateString())->count() ?: 0);

        $catalogViews = (int) (\App\Models\PageView::whereIn('section', ['product', 'vademecum'])->sum('views_count') ?: 0);
        $periodCatalogViews = (int) (\App\Models\PageView::whereIn('section', ['product', 'vademecum'])->where('date', '>=', $startDate->toDateString())->sum('views_count') ?: 0);

        // Desglose por Secciones del Sitio (Home, Catálogo, Vademécum, Farmacovigilancia, etc.)
        $sectionsBreakdown = \App\Models\PageView::selectRaw('section, sum(views_count) as views, sum(unique_visitors_count) as uniques')
            ->groupBy('section')
            ->orderByDesc('views')
            ->get()
            ->toArray();

        // Top Páginas de Entrada / Aterrizaje (Landing Pages)
        $topEntryPaths = \App\Models\DailyVisitor::selectRaw('COALESCE(NULLIF(entry_path, ""), "/") as path, count(*) as count')
            ->groupBy('path')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->toArray();

        // Desglose Técnico de Dispositivos y Navegadores
        $devicesBreakdown = \App\Models\DailyVisitor::selectRaw('device_type, count(*) as count')
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get()
            ->toArray();

        $browsersBreakdown = \App\Models\DailyVisitor::selectRaw('browser, count(*) as count')
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->toArray();

        $osBreakdown = \App\Models\DailyVisitor::selectRaw('os, count(*) as count')
            ->whereNotNull('os')
            ->groupBy('os')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->toArray();

        $topPages = \App\Models\PageView::selectRaw('url_path, section, sum(views_count) as total_views, sum(unique_visitors_count) as total_uniques')
            ->groupBy('url_path', 'section')
            ->orderByDesc('total_views')
            ->limit(7)
            ->get()
            ->toArray();

        // 2. Gráfico Cronológico Adaptativo según Periodo Seleccionado
        $chartData = [];

        if ($groupBy === 'day') {
            for ($i = $daysCount - 1; $i >= 0; $i--) {
                $day = Carbon::today()->subDays($i);
                $dateStr = $day->toDateString();
                $label = $period === '7d'
                    ? ucfirst($day->locale('es')->isoFormat('ddd D'))
                    : $day->locale('es')->isoFormat('D MMM');

                $daySessions = ChatSession::whereDate('started_at', $dateStr)->count();
                $dayGemini = ChatMessage::where('source', 'gemini_api')->whereDate('created_at', $dateStr)->count();
                $dayDet = ChatMessage::where('source', 'like', 'deterministic_%')->whereDate('created_at', $dateStr)->count();
                $dayWa = \App\Models\InteractionEvent::where('event_type', 'whatsapp_click')->whereDate('created_at', $dateStr)->count();
                $dayViews = (int) (\App\Models\PageView::where('date', $dateStr)->sum('views_count') ?: 0);
                $dayUniques = (int) (\App\Models\DailyVisitor::where('date', $dateStr)->count() ?: 0);

                $chartData[] = [
                    'date' => $dateStr,
                    'label' => $label,
                    'sessions' => $daySessions,
                    'gemini' => $dayGemini,
                    'deterministic' => $dayDet,
                    'whatsapp' => $dayWa,
                    'views' => $dayViews,
                    'uniques' => $dayUniques,
                ];
            }
        } else {
            // Agrupación mensual para periodos largos (6m, 1y, all)
            $monthsCount = $period === '6m' ? 6 : ($period === '1y' ? 12 : max(12, Carbon::today()->diffInMonths($startDate) + 1));
            for ($m = $monthsCount - 1; $m >= 0; $m--) {
                $monthDate = Carbon::today()->subMonths($m);
                $mStart = $monthDate->copy()->startOfMonth()->toDateString();
                $mEnd = $monthDate->copy()->endOfMonth()->toDateString();
                $label = ucfirst($monthDate->locale('es')->isoFormat('MMM YY'));

                $mSessions = ChatSession::whereBetween('started_at', [$mStart.' 00:00:00', $mEnd.' 23:59:59'])->count();
                $mGemini = ChatMessage::where('source', 'gemini_api')->whereBetween('created_at', [$mStart.' 00:00:00', $mEnd.' 23:59:59'])->count();
                $mDet = ChatMessage::where('source', 'like', 'deterministic_%')->whereBetween('created_at', [$mStart.' 00:00:00', $mEnd.' 23:59:59'])->count();
                $mWa = \App\Models\InteractionEvent::where('event_type', 'whatsapp_click')->whereBetween('created_at', [$mStart.' 00:00:00', $mEnd.' 23:59:59'])->count();
                $mViews = (int) (\App\Models\PageView::whereBetween('date', [$mStart, $mEnd])->sum('views_count') ?: 0);
                $mUniques = (int) (\App\Models\DailyVisitor::whereBetween('date', [$mStart, $mEnd])->count() ?: 0);

                $chartData[] = [
                    'date' => $mStart,
                    'label' => $label,
                    'sessions' => $mSessions,
                    'gemini' => $mGemini,
                    'deterministic' => $mDet,
                    'whatsapp' => $mWa,
                    'views' => $mViews,
                    'uniques' => $mUniques,
                ];
            }
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
                'period_sessions' => $periodSessions,
                'total_messages' => $totalMessages,
                'avg_latency_ms' => $avgLatency,
                'gemini_calls_count' => $geminiCalls,
                'deterministic_calls_count' => $deterministicCalls,
                'guardrails_triggered_count' => $guardrailsTriggered,
                'conversion_rate' => $conversionRate,
                'converted_sessions' => $convertedSessions,
                'whatsapp_clicks_total' => $whatsappClicksTotal,
                'whatsapp_clicks_today' => $whatsappClicksToday,
                'whatsapp_clicks_period' => $whatsappClicksPeriod,
                'lira_bounces_count' => $liraBounces,
                'lira_deep_count' => $liraDeep,
                'total_web_messages' => $totalWebMessages,
                'total_quotes' => $totalQuotes,
                'total_page_views' => $totalPageViews,
                'today_page_views' => $todayPageViews,
                'period_page_views' => $periodPageViews,
                'total_unique_visitors' => $totalUniqueVisitors,
                'today_unique_visitors' => $todayUniqueVisitors,
                'period_unique_visitors' => $periodUniqueVisitors,
                'catalog_views' => $catalogViews,
                'period_catalog_views' => $periodCatalogViews,
            ],
            'channels' => [
                'whatsapp_clicks' => $whatsappClicksTotal,
                'lira_sessions' => $totalSessions,
                'web_messages' => $totalWebMessages,
                'quotes' => $totalQuotes,
            ],
            'chartData' => $chartData,
            'topPages' => $topPages,
            'topProducts' => $topProducts,
            'guardrailStats' => $guardrailStats,
            'sectionsBreakdown' => $sectionsBreakdown,
            'topEntryPaths' => $topEntryPaths,
            'devicesBreakdown' => $devicesBreakdown,
            'browsersBreakdown' => $browsersBreakdown,
            'osBreakdown' => $osBreakdown,
            'sessions' => $sessions,
            'currentPeriod' => $period,
            'filters' => [
                'period' => $period,
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
            fwrite($handle, "\xEF\xBB\xBF"); // UTF-8 BOM

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
