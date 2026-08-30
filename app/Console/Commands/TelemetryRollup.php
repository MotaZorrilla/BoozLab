<?php

namespace App\Console\Commands;

use App\Models\ChatSession;
use App\Models\Product;
use App\Models\ProductDailyStat;
use App\Models\Quote;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TelemetryRollup extends Command
{
    protected $signature = 'telemetry:rollup {--date= : Specific date to aggregate (YYYY-MM-DD), defaults to today}';

    protected $description = 'Aggregate daily telemetry statistics for products and chatbot inquiries';

    public function handle(): int
    {
        $dateStr = $this->option('date') ?: Carbon::today()->toDateString();
        $date = Carbon::parse($dateStr)->toDateString();

        $this->info("Procesando consolidación de telemetría para fecha: {$date}...");

        $products = Product::all();
        $processed = 0;

        // Obtener todas las sesiones de esa fecha
        $sessions = ChatSession::whereDate('started_at', $date)->get();

        // Mapear conteo de menciones por producto
        $mentionsByProduct = [];
        foreach ($sessions as $session) {
            $ids = is_array($session->suggested_product_ids) ? $session->suggested_product_ids : [];
            foreach ($ids as $id) {
                $mentionsByProduct[$id] = ($mentionsByProduct[$id] ?? 0) + 1;
            }
        }

        // Obtener conteo de cotizaciones por producto en esa fecha
        $quotesByProduct = [];
        $quotes = Quote::whereDate('created_at', $date)->get();

        foreach ($quotes as $quote) {
            $items = is_array($quote->items_payload) ? $quote->items_payload : [];
            foreach ($items as $item) {
                $pid = $item['product_id'] ?? $item['id'] ?? null;
                $qty = (int) ($item['quantity'] ?? 1);
                if ($pid) {
                    $quotesByProduct[$pid] = ($quotesByProduct[$pid] ?? 0) + $qty;
                }
            }
        }

        foreach ($products as $product) {
            $mentions = $mentionsByProduct[$product->id] ?? 0;
            $quotes = $quotesByProduct[$product->id] ?? 0;
            $views = $product->views_count ?: 0;

            ProductDailyStat::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'date' => $date,
                ],
                [
                    'views_count' => $views,
                    'chatbot_mentions_count' => $mentions,
                    'quote_requests_count' => $quotes,
                ]
            );

            $processed++;
        }

        $this->info("✅ Consolidación completada exitosamente: {$processed} productos procesados.");

        return Command::SUCCESS;
    }
}
