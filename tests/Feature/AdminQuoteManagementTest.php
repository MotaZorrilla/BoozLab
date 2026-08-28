<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminQuoteManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_view_quotes_list_with_formatted_items(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $product = Product::first();

        Quote::create([
            'quote_number' => 'BOOZ-COT-2026-0001',
            'customer_name' => 'Farmacia Central',
            'customer_contact' => '04141234567',
            'customer_type' => 'Farmacia',
            'items_payload' => [
                ['product_id' => $product->id, 'quantity' => 5],
            ],
            'total_items' => 5,
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($superAdmin)->get(route('admin.quotes.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/quotes')
            ->has('quotes.data', 1)
            ->where('quotes.data.0.items.0.quantity', 5)
            ->where('quotes.data.0.items.0.product.name', $product->name)
            ->has('stats.total_quotes')
            ->has('topProducts')
        );
    }
}
