<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Message;
use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\Quote;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the Admin Dashboard with KPIs, Products, Pharmacovigilance reports, Messages, and Analytics.
     */
    public function index(): Response
    {
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'pending_reports' => PharmacovigilanceReport::where('status', 'Pendiente')->count(),
            'total_reports' => PharmacovigilanceReport::count(),
            'pending_messages' => Message::where('status', 'Pendiente')->count(),
            'total_messages' => Message::count(),
            'total_lines' => ProductLine::count(),
            'total_quotes' => Quote::count(),
        ];

        $analytics = [
            'total_views' => (int) Product::sum('views_count'),
            'total_chatbot_inquiries' => (int) Product::sum('chatbot_inquiries_count'),
            'total_quote_inquiries' => (int) Product::sum('quote_inquiries_count'),
            'top_chatbot_products' => Product::with('productLine')
                ->where('chatbot_inquiries_count', '>', 0)
                ->orderByDesc('chatbot_inquiries_count')
                ->take(5)
                ->get(['id', 'name', 'product_line_id', 'presentation', 'chatbot_inquiries_count']),
            'top_quote_products' => Product::with('productLine')
                ->where('quote_inquiries_count', '>', 0)
                ->orderByDesc('quote_inquiries_count')
                ->take(5)
                ->get(['id', 'name', 'product_line_id', 'presentation', 'quote_inquiries_count']),
            'top_viewed_products' => Product::with('productLine')
                ->where('views_count', '>', 0)
                ->orderByDesc('views_count')
                ->take(5)
                ->get(['id', 'name', 'product_line_id', 'presentation', 'views_count']),
            'line_demand' => ProductLine::all()->map(function ($line) {
                $lineProducts = Product::where('product_line_id', $line->id)->get();

                return [
                    'id' => $line->id,
                    'name' => $line->name,
                    'products_count' => $lineProducts->count(),
                    'total_views' => $lineProducts->sum('views_count'),
                    'total_chatbot' => $lineProducts->sum('chatbot_inquiries_count'),
                    'total_quotes' => $lineProducts->sum('quote_inquiries_count'),
                ];
            }),
        ];

        $products = Product::with('productLine')->orderBy('name')->get();
        $productLines = ProductLine::all();
        $reports = PharmacovigilanceReport::orderByDesc('created_at')->get();
        $messages = Message::orderByDesc('created_at')->get();
        $faqs = Faq::orderBy('order')->get();
        $testimonials = Testimonial::all();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'analytics' => $analytics,
            'products' => $products,
            'productLines' => $productLines,
            'reports' => $reports,
            'messages' => $messages,
            'faqs' => $faqs,
            'testimonials' => $testimonials,
        ]);
    }
}
