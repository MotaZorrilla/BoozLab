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
            ->has('topProducts')
        );
    }
}
