<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_consultation_message(): void
    {
        $payload = [
            'type' => 'consulta',
            'name' => 'María Pérez',
            'email' => 'maria@example.com',
            'phone' => '+58 414 7775555',
            'message' => 'Solicito información sobre la presentación de Centellacis Crema.',
        ];

        $response = $this->postJson(route('api.messages.store'), $payload);

        $response->assertCreated();
        $response->assertJson([
            'status' => 'success',
        ]);
        $this->assertDatabaseHas('messages', [
            'type' => 'consulta',
            'name' => 'María Pérez',
            'email' => 'maria@example.com',
            'status' => 'Pendiente',
        ]);
    }

    public function test_cannot_submit_message_without_required_fields(): void
    {
        $response = $this->postJson(route('api.messages.store'), []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['type', 'name', 'email', 'message']);
    }

    public function test_cannot_submit_invalid_message_type(): void
    {
        $response = $this->postJson(route('api.messages.store'), [
            'type' => 'spam',
            'name' => 'Carlos',
            'email' => 'carlos@example.com',
            'message' => 'Mensaje de prueba.',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['type']);
    }
}
