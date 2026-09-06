<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatbotResilienceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_empty_message_returns_official_welcome_prompt(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => '',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['reply', 'suggestedProducts', 'disclaimer']);
        $this->assertStringContainsString('Lira', $response->json('reply'));
        $this->assertEmpty($response->json('suggestedProducts'));
    }

    public function test_whitespace_only_message_returns_official_welcome_prompt(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => '     ',
        ]);

        $response->assertOk();
        $this->assertStringContainsString('Lira', $response->json('reply'));
    }

    public function test_inquiry_for_prescription_product_includes_medical_recipe_note(): void
    {
        // Bactrocis requiere récipe médico
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Bactrocis',
        ]);

        $response->assertOk();
        $reply = $response->json('reply');
        $this->assertStringContainsString('récipe', strtolower($reply));
    }
}
