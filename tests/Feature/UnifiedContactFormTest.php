<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnifiedContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_commercial_contact_message(): void
    {
        $payload = [
            'type' => 'contacto',
            'name' => 'Distribuidora Farmacéutica del Centro',
            'email' => 'compras@farmacentro.com',
            'phone' => '+58 241 8000000',
            'message' => 'Deseamos solicitar catálogo mayorista y lista de precios para droguerías.',
        ];

        $response = $this->postJson(route('api.messages.store'), $payload);

        $response->assertCreated();
        $response->assertJson([
            'status' => 'success',
        ]);
        $this->assertDatabaseHas('messages', [
            'type' => 'contacto',
            'name' => 'Distribuidora Farmacéutica del Centro',
            'status' => 'Pendiente',
        ]);
    }

    public function test_can_submit_pharmacovigilance_report_from_home_form_tab(): void
    {
        $payload = [
            'product_name' => 'Calamicis Loción Calmante',
            'reporter_name' => 'Pedro Salazar',
            'reporter_type' => 'Paciente',
            'reporter_contact' => 'pedro@correo.com',
            'adverse_reaction' => 'Paciente refiere sensación de ardor persistente tras aplicación.',
            'severity' => 'Leve',
        ];

        $response = $this->postJson(route('farmacovigilancia.store'), $payload);

        $response->assertCreated();
        $response->assertJsonStructure(['status', 'ticket_number']);
        $this->assertDatabaseHas('pharmacovigilance_reports', [
            'product_name' => 'Calamicis Loción Calmante',
            'reporter_name' => 'Pedro Salazar',
            'severity' => 'Leve',
        ]);
    }

    public function test_home_report_fails_if_adverse_reaction_has_fewer_than_ten_characters(): void
    {
        $payload = [
            'product_name' => 'Betamer',
            'reporter_name' => 'Carlos',
            'reporter_type' => 'Paciente',
            'reporter_contact' => 'carlos@test.com',
            'adverse_reaction' => 'Ardor', // Menor a 10 caracteres (min:10)
            'severity' => 'Leve',
        ];

        $response = $this->postJson(route('farmacovigilancia.store'), $payload);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['adverse_reaction']);
    }

    public function test_messages_endpoint_rate_limiting_throttles_excessive_submissions(): void
    {
        $payload = [
            'type' => 'consulta',
            'name' => 'Spam Bot',
            'email' => 'bot@spam.com',
            'message' => 'Mensaje repetitivo de prueba.',
        ];

        // El middleware es throttle:10,1 (10 por minuto)
        for ($i = 0; $i < 10; $i++) {
            $this->postJson(route('api.messages.store'), $payload)->assertCreated();
        }

        // El intento 11 debe ser bloqueado por Rate Limiting
        $blockedResponse = $this->postJson(route('api.messages.store'), $payload);
        $blockedResponse->assertStatus(429);
    }
}
