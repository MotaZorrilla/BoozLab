<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LiraAdminHandoffTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_message_from_lira_assistant(): void
    {
        $payload = [
            'type' => 'lira',
            'source' => 'lira_chatbot',
            'name' => 'Dr. Fernando Arreaza',
            'email' => 'farreaza@clinica.com',
            'phone' => '+58 412 1234567',
            'subject' => 'Interés en distribución de Bactrocis en Puerto Ordaz',
            'message' => 'Deseamos solicitar catálogo mayorista y términos de despacho para nuestra red de farmacias.',
        ];

        $response = $this->postJson(route('api.messages.store'), $payload);

        $response->assertCreated();
        $response->assertJson([
            'status' => 'success',
            'source' => 'lira_chatbot',
        ]);

        $this->assertDatabaseHas('messages', [
            'type' => 'lira',
            'source' => 'lira_chatbot',
            'name' => 'Dr. Fernando Arreaza',
            'email' => 'farreaza@clinica.com',
            'phone' => '+58 412 1234567',
            'status' => 'Pendiente',
        ]);
    }

    public function test_chatbot_returns_contact_handoff_response_on_admin_inquiry(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Quiero contactar al administrador o dueños del laboratorio',
        ]);

        $response->assertOk();
        $response->assertJson([
            'action' => 'show_contact_form',
        ]);
        $this->assertStringContainsString('equipo administrativo', $response->json('reply'));
    }
}
