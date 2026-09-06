<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use App\Services\SettingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatbotDynamicCorpusTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_chatbot_responds_with_greeting_and_disclaimer(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => '¿Qué tienen para el dolor?',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'reply',
            'suggestedProducts',
            'disclaimer',
        ]);
        $this->assertNotNull($response->json('disclaimer'));
    }

    public function test_chatbot_matches_products_by_brand_and_principles(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => '¿Tienen bactrocis moxifloxacina?',
        ]);

        $response->assertOk();
        $products = $response->json('suggestedProducts');
        $this->assertNotEmpty($products);
        $this->assertStringContainsString('Bactrocis', $products[0]['name']);
    }

    public function test_gemini_key_resolution_prefers_system_setting(): void
    {
        SystemSetting::set('gemini_api_key', 'AIzaSyDatabaseKeyOverride', 'encrypted', 'ai');

        $this->assertEquals('AIzaSyDatabaseKeyOverride', SettingService::geminiKey());
    }
}
