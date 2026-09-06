<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductLine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    /**
     * Display the catalog management view.
     */
    public function index(): Response
    {
        $products = Product::with('productLine')->orderBy('product_line_id')->orderBy('name')->get();
        $productLines = ProductLine::all();

        $stockImages = [
            ['label' => 'Línea 01 - Calamicis / Dermo', 'url' => '/assets/img/product_1.png'],
            ['label' => 'Línea 02 - Fórmulas Tópicas', 'url' => '/assets/img/product_2.png'],
            ['label' => 'Línea 03 - Soluciones Orales', 'url' => '/assets/img/product_3.png'],
            ['label' => 'Línea 04 - Regenerativo Dérmico', 'url' => '/assets/img/product_4.png'],
            ['label' => 'Muestra Betamer Crema 20g', 'url' => '/assets/img/Foto_Muestra_Tubo_Betamer_Crema_20g.jpeg'],
            ['label' => 'Muestra Albemer Suspensión 10ml', 'url' => '/assets/img/Foto_Muestra_Frasco_Albemer_Suspension_10ml.jpeg'],
            ['label' => 'Estuches Dermatológicos Booz', 'url' => '/assets/img/Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg'],
            ['label' => 'Portafolio Fármacos Booz', 'url' => '/assets/img/hero_products.png'],
        ];

        return Inertia::render('admin/products', [
            'products' => $products,
            'productLines' => $productLines,
            'stockImages' => $stockImages,
        ]);
    }

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
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $uploadDir = public_path('assets/img/uploads');
            if (! file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $filename = 'prod_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();
            $file->move($uploadDir, $filename);
            $validated['image_path'] = '/assets/img/uploads/'.$filename;
        }

        if (empty($validated['image_path'])) {
            $validated['image_path'] = '/assets/img/product_1.png';
        }

        unset($validated['image_file']);
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
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $uploadDir = public_path('assets/img/uploads');
            if (! file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $filename = 'prod_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();
            $file->move($uploadDir, $filename);
            $validated['image_path'] = '/assets/img/uploads/'.$filename;
        }

        if (empty($validated['image_path'])) {
            $validated['image_path'] = $product->image_path ?: '/assets/img/product_1.png';
        }

        unset($validated['image_file']);
        $product->update($validated);

        return redirect()->back()->with('success', 'Ficha médica y datos del producto actualizados correctamente.');
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

    /**
     * Upload an image file for a product.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $file = $request->file('image');
        $filename = 'prod_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

        // 1. Directorio público primario (detectado por Laravel)
        $primaryDir = public_path('assets/img/uploads');
        if (! file_exists($primaryDir)) {
            mkdir($primaryDir, 0755, true);
        }
        $file->move($primaryDir, $filename);

        // 2. Si existe public_html como carpeta hermana en cPanel, copiar también allí por seguridad
        $cpanelDir = base_path('../public_html/assets/img/uploads');
        if (is_dir(base_path('../public_html')) && $primaryDir !== $cpanelDir) {
            if (! file_exists($cpanelDir)) {
                mkdir($cpanelDir, 0755, true);
            }
            copy($primaryDir.'/'.$filename, $cpanelDir.'/'.$filename);
        }

        return response()->json([
            'success' => true,
            'url' => '/assets/img/uploads/'.$filename,
        ]);
    }
}
