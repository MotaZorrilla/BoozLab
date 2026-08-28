<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductLine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogIntegrityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_inactive_products_are_not_displayed_in_home_catalog(): void
    {
        $line = ProductLine::first();
        $inactiveProduct = Product::create([
            'product_line_id' => $line->id,
            'name' => 'Fármaco Retirado Desactivado',
            'slug' => 'farmaco-retirado-desactivado',
            'active_ingredients' => 'Ninguno',
            'presentation' => 'Frasco',
            'description' => 'Producto fuera de circulación.',
            'indications' => 'Ninguna',
            'price' => 15.0,
            'stock' => 0,
            'is_active' => false,
        ]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(function ($page) use ($inactiveProduct) {
            $products = collect($page->toArray()['props']['products']);
            return ! $products->contains('id', $inactiveProduct->id);
        });
    }

    public function test_inactive_products_are_excluded_from_api_search(): void
    {
        $line = ProductLine::first();
        Product::create([
            'product_line_id' => $line->id,
            'name' => 'Oculto Especializado Inactivo',
            'slug' => 'oculto-especializado-inactivo',
            'active_ingredients' => 'Sustancia Oculta',
            'presentation' => 'Tubo',
            'description' => 'Test de exclusión en búsqueda.',
            'indications' => 'Test',
            'price' => 20.0,
            'stock' => 5,
            'is_active' => false,
        ]);

        $response = $this->getJson(route('api.search', ['q' => 'Sustancia Oculta']));

        $response->assertOk();
        $response->assertJsonMissing(['name' => 'Oculto Especializado Inactivo']);
    }

    public function test_pdp_related_products_exclude_current_product_and_inactive_products(): void
    {
        $product = Product::where('is_active', true)->first();

        $response = $this->get(route('product.show', ['slug' => $product->slug]));

        $response->assertOk();
        $response->assertInertia(function ($page) use ($product) {
            $related = collect($page->toArray()['props']['relatedProducts']);
            // No debe contenerse a sí mismo
            $selfExcluded = ! $related->contains('id', $product->id);
            // Todos los relacionados deben pertenecer a la misma línea
            $sameLine = $related->every(fn ($p) => $p['product_line_id'] === $product->product_line_id);
            // Todos los relacionados deben estar activos
            $allActive = $related->every(fn ($p) => $p['is_active'] === true);

            return $selfExcluded && $sameLine && $allActive;
        });
    }
}
