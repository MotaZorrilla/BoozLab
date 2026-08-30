<?php

namespace Tests\Feature;

use App\Models\DailyVisitor;
use App\Models\PageView;
use App\Models\Product;
use App\Models\ProductDailyStat;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SystemSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrafficTelemetryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_visiting_homepage_records_page_view_and_unique_visitor(): void
    {
        $today = now()->toDateString();

        $response = $this->get('/');
        $response->assertOk();

        $this->assertDatabaseHas('page_views', [
            'date' => $today,
            'section' => 'home',
            'url_path' => '/',
            'views_count' => 1,
            'unique_visitors_count' => 1,
        ]);

        $this->assertEquals(1, DailyVisitor::where('date', $today)->count());
    }

    public function test_subsequent_visits_from_same_visitor_increments_views_not_uniques(): void
    {
        $today = now()->toDateString();

        $this->get('/');
        $this->get('/');

        $pageView = PageView::where('date', $today)->where('url_path', '/')->firstOrFail();

        $this->assertEquals(2, $pageView->views_count);
        $this->assertEquals(1, $pageView->unique_visitors_count);
        $this->assertEquals(1, DailyVisitor::where('date', $today)->count());
    }

    public function test_visiting_product_page_records_product_page_view_and_daily_stats(): void
    {
        $today = now()->toDateString();
        $product = Product::firstOrFail();

        $response = $this->get("/producto/{$product->slug}");
        $response->assertOk();

        $this->assertDatabaseHas('page_views', [
            'date' => $today,
            'section' => 'product',
            'url_path' => "/producto/{$product->slug}",
            'product_id' => $product->id,
        ]);

        $this->assertDatabaseHas('product_daily_stats', [
            'date' => $today,
            'product_id' => $product->id,
        ]);
    }

    public function test_admin_and_api_routes_are_ignored_by_traffic_tracker(): void
    {
        $today = now()->toDateString();

        $this->getJson('/api/search?q=crema');

        $this->assertDatabaseMissing('page_views', [
            'date' => $today,
            'url_path' => '/api/search',
        ]);
    }

    public function test_admin_analytics_displays_traffic_kpis(): void
    {
        $admin = User::where('email', 'admin@boozlaboratorio.com')->firstOrFail();

        // Generar una visita
        $this->get('/');

        $response = $this->actingAs($admin)->get('/admin/analytics');
        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->component('admin/analytics')
            ->has('kpis.total_page_views')
            ->has('kpis.total_unique_visitors')
            ->has('topPages')
            ->has('chartData')
        );
    }
}
