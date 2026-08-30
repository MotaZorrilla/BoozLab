<?php

namespace Tests\Feature;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Product;
use App\Models\ProductDailyStat;
use App\Models\Role;
use App\Models\User;
use App\Services\ChatTelemetryService;
use Database\Seeders\BoozClinicalPlatformSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SystemSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TelemetryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_chatbot_records_telemetry_session_and_messages(): void
    {
        $sessionUid = 'ses-test-' . uniqid();

        $response = $this->postJson('/api/chatbot', [
            'message' => 'hola',
            'session_uid' => $sessionUid,
            'url_ref' => '/producto/calamicis-locion',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['reply', 'source', 'session_uid']);
        $this->assertEquals($sessionUid, $response->json('session_uid'));

        $this->assertDatabaseHas('chat_sessions', [
            'session_uid' => $sessionUid,
            'first_query' => 'hola',
            'url_ref' => '/producto/calamicis-locion',
            'turn_count' => 1,
        ]);

        $session = ChatSession::where('session_uid', $sessionUid)->firstOrFail();

        $this->assertEquals(2, $session->messages()->count());
        $this->assertDatabaseHas('chat_messages', [
            'chat_session_id' => $session->id,
            'role' => 'user',
            'content' => 'hola',
        ]);
        $this->assertDatabaseHas('chat_messages', [
            'chat_session_id' => $session->id,
            'role' => 'assistant',
            'source' => 'deterministic_greeting',
        ]);
    }

    public function test_chatbot_returns_200_even_if_telemetry_fails(): void
    {
        $mockTelemetry = $this->mock(ChatTelemetryService::class);
        $mockTelemetry->shouldReceive('recordTurn')
            ->once()
            ->andThrow(new \RuntimeException('Database disk full simulation'));

        $response = $this->postJson('/api/chatbot', [
            'message' => 'información de productos',
            'session_uid' => 'fail-safe-session-123',
        ]);

        // Chatbot service must NOT return 500 when telemetry fails
        $response->assertOk();
        $response->assertJsonStructure(['reply', 'source']);
    }

    public function test_admin_can_view_analytics_and_filter_conversations(): void
    {
        $admin = User::where('email', 'admin@boozlaboratorio.com')->firstOrFail();

        // Crear sesiones de prueba
        ChatSession::create([
            'session_uid' => 'ses-admin-view-1',
            'first_query' => 'precios de bactrocis',
            'started_at' => now(),
            'turn_count' => 2,
            'total_latency_ms' => 45,
            'last_source' => 'deterministic_quote',
        ]);

        $response = $this->actingAs($admin)->get('/admin/analytics');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/analytics')
            ->has('kpis')
            ->has('chartData')
            ->has('sessions.data')
        );
    }

    public function test_admin_can_export_telemetry_csv(): void
    {
        $admin = User::where('email', 'admin@boozlaboratorio.com')->firstOrFail();

        ChatSession::create([
            'session_uid' => 'ses-csv-export-99',
            'first_query' => 'dosis de beducis crema',
            'started_at' => now(),
            'turn_count' => 1,
            'total_latency_ms' => 30,
            'last_source' => 'deterministic_product_match',
        ]);

        $response = $this->actingAs($admin)->get('/admin/analytics/export-csv');

        $response->assertOk();
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('boozlab_telemetria_lira_', $response->headers->get('Content-Disposition'));
    }

    public function test_telemetry_rollup_command_aggregates_stats(): void
    {
        $this->artisan('telemetry:rollup')
            ->expectsOutputToContain('Consolidación completada exitosamente')
            ->assertSuccessful();

        $this->assertEquals(18, ProductDailyStat::count());
    }
}
