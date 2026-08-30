<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_home_page_loads_successfully_with_products_and_lines(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('home')
            ->has('products')
            ->has('productLines', 4)
            ->has('testimonials')
            ->has('faqs')
        );
    }

    public function test_product_detail_page_loads_with_correct_product(): void
    {
        $product = Product::first();
        $this->assertNotNull($product);

        $response = $this->get(route('product.show', ['slug' => $product->slug]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('product-detail')
            ->where('product.slug', $product->slug)
            ->has('relatedProducts')
        );
    }

    public function test_invalid_product_slug_returns_404(): void
    {
        $response = $this->get(route('product.show', ['slug' => 'producto-inexistente-12345']));

        $response->assertNotFound();
    }

    public function test_product_search_api_returns_matches_by_name(): void
    {
        $response = $this->getJson(route('api.search', ['q' => 'Bacumer']));

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Bacumer Crema Multifactorial']);
    }

    public function test_product_search_api_returns_matches_by_active_ingredient(): void
    {
        $response = $this->getJson(route('api.search', ['q' => 'Moxifloxacina']));

        $response->assertOk();
        $response->assertJsonFragment(['active_ingredients' => 'Moxifloxacina 0.5%']);
    }

    public function test_product_vademecum_pdf_view_loads_successfully(): void
    {
        $product = Product::first();
        $this->assertNotNull($product);

        $response = $this->get(route('product.vademecum', ['slug' => $product->slug]));

        $response->assertOk();
        $response->assertSee('VADEMÉCUM CLÍNICO');
        $response->assertSeeText($product->name);
        $response->assertSeeText($product->active_ingredients);
    }
}
