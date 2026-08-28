<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Quote;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuoteController extends Controller
{
    public function index(): Response
    {
        $quotesPaginated = Quote::latest()->paginate(15);

        // Extraer todos los IDs de productos del payload para pre-cargarlos en una sola consulta
        $productIds = collect($quotesPaginated->items())
            ->flatMap(function ($quote) {
                return collect($quote->items_payload)->pluck('product_id');
            })
            ->unique()
            ->filter();

        $productsById = Product::whereIn('id', $productIds)
            ->get(['id', 'name', 'presentation', 'price'])
            ->keyBy('id');

        $quotesPaginated->through(function ($quote) use ($productsById) {
            $formattedItems = collect($quote->items_payload ?? [])->map(function ($item, $idx) use ($quote, $productsById) {
                $p = $productsById->get($item['product_id'] ?? null);
                return [
                    'id' => $idx + 1,
                    'quote_id' => $quote->id,
                    'product_id' => $item['product_id'] ?? 0,
                    'quantity' => $item['quantity'] ?? 1,
                    'product' => $p ? [
                        'name' => $p->name,
                        'presentation' => $p->presentation,
                        'price' => (float) $p->price,
                    ] : null,
                ];
            })->values()->toArray();

            return [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'customer_name' => $quote->customer_name,
                'customer_contact' => $quote->customer_contact,
                'customer_type' => $quote->customer_type,
                'total_items' => $quote->total_items,
                'status' => $quote->status,
                'created_at' => $quote->created_at?->format('d/m/Y H:i') ?? '',
                'items' => $formattedItems,
            ];
        });

        $totalQuotes = Quote::count();
        $totalUnits = Product::sum('quote_inquiries_count');

        $topQuotedProducts = Product::orderByDesc('quote_inquiries_count')
            ->take(10)
            ->get(['id', 'name', 'slug', 'quote_inquiries_count', 'price']);

        return Inertia::render('admin/quotes', [
            'quotes' => $quotesPaginated,
            'stats' => [
                'total_quotes' => $totalQuotes,
                'total_units_demanded' => (int) $totalUnits,
            ],
            'topProducts' => $topQuotedProducts,
        ]);
    }
}
