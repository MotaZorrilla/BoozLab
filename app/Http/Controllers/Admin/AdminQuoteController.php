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
        $quotes = Quote::with('items.product')
            ->latest()
            ->paginate(15);

        $totalQuotes = Quote::count();
        $totalUnits = Product::sum('quote_inquiries_count');

        $topQuotedProducts = Product::orderByDesc('quote_inquiries_count')
            ->take(10)
            ->get(['id', 'name', 'slug', 'quote_inquiries_count', 'price']);

        return Inertia::render('admin/quotes', [
            'quotes' => $quotes,
            'stats' => [
                'total_quotes' => $totalQuotes,
                'total_units_demanded' => (int) $totalUnits,
            ],
            'topProducts' => $topQuotedProducts,
        ]);
    }
}
