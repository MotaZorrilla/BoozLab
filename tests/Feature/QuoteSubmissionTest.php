<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteSubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_can_submit_commercial_quote_from_cart(): void
    {
        $product1 = Product::first();
        $product2 = Product::skip(1)->first();

        $payload = [
            'customer_name' => 'Farmacia Los Caobos',
            'customer_contact' => '+58 412 1234567',
            'customer_type' => 'Farmacia',
            'items' => [
                ['product_id' => $product1->id, 'quantity' => 5],
                ['product_id' => $product2->id, 'quantity' => 10],
            ],
        ];

        $response = $this->postJson(route('api.quotes.store'), $payload);

        $response->assertCreated();
        $response->assertJsonStructure(['status', 'quote_number', 'message']);
        $this->assertStringStartsWith('BOOZ-COT-', $response->json('quote_number'));
        $this->assertDatabaseHas('quotes', [
            'customer_name' => 'Farmacia Los Caobos',
            'total_items' => 15,
            'status' => 'Pendiente',
        ]);
    }

    public function test_quote_submission_fails_without_items(): void
    {
        $response = $this->postJson(route('api.quotes.store'), [
            'customer_name' => 'Prueba Sin Items',
            'items' => [],
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['items']);
    }
}
