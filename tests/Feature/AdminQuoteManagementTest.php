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

        $response = $this->actingAs($superAdmin)->get(route('admin.quotes.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/quotes')
            ->has('quotes.data')
            ->where('stats.total_quotes', fn ($total) => $total >= 8)
            ->has('stats.channel_stats')
            ->has('stats.customer_type_stats')
            ->has('allProducts')
            ->has('topProducts')
        );
    }

    public function test_admin_can_filter_quotes_by_status_and_customer_type(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();

        $response = $this->actingAs($superAdmin)->get(route('admin.quotes.index', [
            'status' => 'Despachado',
            'customer_type' => 'Farmacia',
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/quotes')
            ->where('filters.status', 'Despachado')
            ->where('filters.customer_type', 'Farmacia')
        );
    }

    public function test_admin_can_create_manual_quote(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $product = Product::first();

        $response = $this->actingAs($superAdmin)->post(route('admin.quotes.store'), [
            'customer_name' => 'Farmacia Santa Eduvigis C.A.',
            'customer_contact' => '04149988112',
            'customer_type' => 'Farmacia',
            'status' => 'Pendiente',
            'admin_notes' => 'Pedido telefónico recibido por planta.',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 15],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('quotes', [
            'customer_name' => 'Farmacia Santa Eduvigis C.A.',
            'customer_type' => 'Farmacia',
            'channel' => 'manual',
            'total_items' => 15,
            'status' => 'Pendiente',
        ]);
    }

    public function test_admin_can_update_quote_status_and_notes(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $quote = Quote::first();

        $response = $this->actingAs($superAdmin)->put(route('admin.quotes.update', $quote), [
            'status' => 'Despachado',
            'admin_notes' => 'Guía de encomienda MRW #123456.',
            'mark_downloaded' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('quotes', [
            'id' => $quote->id,
            'status' => 'Despachado',
            'admin_notes' => 'Guía de encomienda MRW #123456.',
        ]);
        $this->assertNotNull($quote->fresh()->downloaded_at);
    }

    public function test_admin_can_update_product_stock_from_quotes_module(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $product = Product::first();

        $response = $this->actingAs($superAdmin)->post(route('admin.quotes.updateStock'), [
            'product_id' => $product->id,
            'stock' => 150,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 150,
        ]);
    }

    public function test_admin_can_export_quotes_csv(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();

        $response = $this->actingAs($superAdmin)->get(route('admin.quotes.exportCsv'));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    public function test_admin_can_view_printable_quote_voucher(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $quote = Quote::first();

        $response = $this->actingAs($superAdmin)->get(route('admin.quotes.print', $quote));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/quote-voucher')
            ->has('quote')
            ->where('quote.quote_number', $quote->quote_number)
        );
        $this->assertNotNull($quote->fresh()->downloaded_at);
    }

    public function test_admin_can_delete_quote(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $quote = Quote::first();

        $response = $this->actingAs($superAdmin)->delete(route('admin.quotes.destroy', $quote));

        $response->assertRedirect();
        $this->assertDatabaseMissing('quotes', [
            'id' => $quote->id,
        ]);
    }
}
