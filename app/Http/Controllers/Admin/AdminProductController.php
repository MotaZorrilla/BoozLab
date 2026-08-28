<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_line_id' => 'required|exists:product_lines,id',
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:products,slug',
            'active_ingredients' => 'required|string|max:255',
            'presentation' => 'required|string|max:150',
            'description' => 'required|string',
            'indications' => 'required|string',
            'posology' => 'nullable|string',
            'contraindications' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_prescription_required' => 'boolean',
            'is_active' => 'boolean',
            'image_path' => 'nullable|string|max:255',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if (empty($validated['image_path'])) {
            $validated['image_path'] = '/assets/img/product_1.png';
        }

        Product::create($validated);

        return redirect()->back()->with('success', 'Producto creado exitosamente.');
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'product_line_id' => 'required|exists:product_lines,id',
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:products,slug,'.$product->id,
            'active_ingredients' => 'required|string|max:255',
            'presentation' => 'required|string|max:150',
            'description' => 'required|string',
            'indications' => 'required|string',
            'posology' => 'nullable|string',
            'contraindications' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_prescription_required' => 'boolean',
            'is_active' => 'boolean',
            'image_path' => 'nullable|string|max:255',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Toggle active state of a product.
     */
    public function toggleActive(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => ! $product->is_active,
        ]);

        $statusText = $product->is_active ? 'activado' : 'desactivado';

        return redirect()->back()->with('success', "Producto {$statusText} correctamente.");
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->back()->with('success', 'Producto eliminado del catálogo.');
    }
}
