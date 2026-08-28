<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatbotGuardrailsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_chatbot_returns_greeting(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Hola, buenos días',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['reply', 'suggestedProducts', 'disclaimer']);
        $this->assertStringContainsString('Lira', $response->json('reply'));
    }

    public function test_chatbot_returns_product_information_with_anti_automedicacion_disclaimer(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Para qué sirve Bacumer',
        ]);

        $response->assertOk();
        $this->assertStringContainsString('Bacumer', $response->json('reply'));
        $this->assertNotNull($response->json('disclaimer'));
        $this->assertStringContainsString('automedicación', strtolower($response->json('disclaimer')));
    }

    public function test_chatbot_enforces_anti_automedicacion_guardrail_on_symptom_inquiries(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Tengo una infección en el pie con dolor, qué me tomo',
        ]);

        $response->assertOk();
        $this->assertNotNull($response->json('disclaimer'));
        $this->assertStringContainsString('médico', strtolower($response->json('reply').' '.$response->json('disclaimer')));
    }

    public function test_chatbot_returns_location_details_for_valle_de_guanape(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Dónde está ubicado el laboratorio',
        ]);

        $response->assertOk();
        $this->assertStringContainsString('Valle de Guanape', $response->json('reply'));
        $this->assertStringContainsString('J-40906185-0', $response->json('reply'));
    }
}
