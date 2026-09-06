<?php

namespace Tests\Feature;

use App\Models\ProductLine;
use App\Models\SystemSetting;
use App\Services\LiraAiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LiraAiServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_lira_ai_service_resolves_dynamic_whatsapp_number(): void
    {
        SystemSetting::set('whatsapp_sales_phone', '584129990000', 'text', 'general');

        /** @var LiraAiService $service */
        $service = app(LiraAiService::class);
        $result = $service->queryDeterministic('¿Cómo puedo pedir cotización?');

        $this->assertStringContainsString('584129990000', $result['reply']);
    }

    public function test_lira_ai_service_resolves_dynamic_company_identity(): void
    {
        SystemSetting::set('company_rif', 'J-99999999-9', 'text', 'general');
        SystemSetting::set('company_instagram', '@booz_oficial_test', 'text', 'general');

        /** @var LiraAiService $service */
        $service = app(LiraAiService::class);
        $result = $service->queryDeterministic('¿Dónde están ubicados?');

        $this->assertStringContainsString('J-99999999-9', $result['reply']);
        $this->assertStringContainsString('@booz_oficial_test', $result['reply']);
    }

    public function test_lira_ai_service_resolves_dynamic_lines_from_database(): void
    {
        /** @var LiraAiService $service */
        $service = app(LiraAiService::class);
        $result = $service->queryDeterministic('cuéntame de sus líneas de productos');

        $linesCount = ProductLine::count();
        $this->assertStringContainsString("{$linesCount} Líneas Terapéuticas Oficiales", $result['reply']);
    }

    public function test_lira_ai_service_builds_complete_system_instruction(): void
    {
        /** @var LiraAiService $service */
        $service = app(LiraAiService::class);
        $instruction = $service->buildSystemInstruction();

        $this->assertStringContainsString('Lira', $instruction);
        $this->assertStringContainsString('VADEMÉCUM CLÍNICO ACTIVO', $instruction);
        $this->assertStringContainsString('GUARDRAILS SANITARIOS', $instruction);
    }
}
