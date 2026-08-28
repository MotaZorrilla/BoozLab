<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the Admin Dashboard with KPIs, Products, and Pharmacovigilance reports.
     */
    public function index(): Response
    {
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'pending_reports' => PharmacovigilanceReport::where('status', 'Pendiente')->count(),
            'total_reports' => PharmacovigilanceReport::count(),
            'total_lines' => ProductLine::count(),
        ];

        $products = Product::with('productLine')->orderBy('name')->get();
        $productLines = ProductLine::all();
        $reports = PharmacovigilanceReport::orderByDesc('created_at')->get();
        $faqs = Faq::orderBy('order')->get();
        $testimonials = Testimonial::all();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'products' => $products,
            'productLines' => $productLines,
            'reports' => $reports,
            'faqs' => $faqs,
            'testimonials' => $testimonials,
        ]);
    }
}
