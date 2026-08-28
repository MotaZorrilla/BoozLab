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
            $q->where('is_active', true);
        }])->get();

        $products = Product::with('productLine')
            ->where('is_active', true)
            ->get();

        $testimonials = Testimonial::where('is_active', true)->get();
        $faqs = Faq::where('is_active', true)->orderBy('order')->get();

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
        $product = Product::with('productLine')
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Product::with('productLine')
            ->where('product_line_id', $product->product_line_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
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
        $query = $request->input('q', '');

        if (empty($query)) {
            $products = Product::with('productLine')->where('is_active', true)->limit(10)->get();

            return response()->json($products);
        }

        $products = Product::with('productLine')
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('active_ingredients', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('indications', 'like', "%{$query}%");
            })
            ->limit(15)
            ->get();

        return response()->json($products);
    }
}
