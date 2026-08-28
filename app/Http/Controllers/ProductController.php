<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the Home / Welcome page with all catalog data.
     */
    public function home(): Response
    {
        $productLines = ProductLine::with(['products' => function ($q) {
            $q->active();
        }])->get();

        $products = Product::with('productLine')
            ->active()
            ->orderBy('name')
            ->get();

        $testimonials = Testimonial::active()->get();
        $faqs = Faq::active()->orderBy('order')->get();

        return Inertia::render('home', [
            'productLines' => $productLines,
            'products' => $products,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
        ]);
    }

    /**
     * Display a dedicated Product Detail Page (PDP).
     */
    public function show(string $slug): Response
    {
        // SEGURIDAD SANITARIA: Solo productos activos son accesibles públicamente
        $product = Product::with('productLine')
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        $product->increment('views_count');

        $relatedProducts = Product::with('productLine')
            ->where('product_line_id', $product->product_line_id)
            ->where('id', '!=', $product->id)
            ->active()
            ->limit(3)
            ->get();

        return Inertia::render('product-detail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Search products for command palette / modal quick search.
     */
    public function search(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('q', ''));

        if (empty($query)) {
            $products = Product::with('productLine')->active()->limit(10)->get();

            return response()->json($products);
        }

        $safeTerm = addcslashes($query, '%_');

        $products = Product::with('productLine')
            ->active()
            ->where(function ($q) use ($safeTerm) {
                $q->where('name', 'like', "%{$safeTerm}%")
                    ->orWhere('active_ingredients', 'like', "%{$safeTerm}%")
                    ->orWhere('description', 'like', "%{$safeTerm}%")
                    ->orWhere('indications', 'like', "%{$safeTerm}%");
            })
            ->limit(15)
            ->get();

        return response()->json($products);
    }
}
