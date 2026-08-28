<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PharmacovigilanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_pharmacovigilance_page_loads_successfully(): void
    {
        $response = $this->get(route('farmacovigilancia.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('farmacovigilancia')
            ->has('products')
        );
    }

    public function test_can_submit_valid_pharmacovigilance_report(): void
    {
        $payload = [
            'product_name' => 'Bactrocis Crema Especializada',
            'batch_number' => 'L-202608',
            'expiry_date' => '2028-08-31',
            'reporter_name' => 'Dra. Elena Vargas',
            'reporter_type' => 'Médico',
            'reporter_contact' => '0414-5551234',
            'adverse_reaction' => 'Paciente refiere leve eritema en bordes de la herida tras segunda aplicación.',
            'severity' => 'Leve',
        ];

        $response = $this->postJson(route('farmacovigilancia.store'), $payload);

        $response->assertCreated();
        $response->assertJson([
            'status' => 'success',
        ]);
        $response->assertJsonStructure([
            'status',
            'ticket_number',
            'message',
        ]);

        $this->assertDatabaseHas('pharmacovigilance_reports', [
            'product_name' => 'Bactrocis Crema Especializada',
            'reporter_name' => 'Dra. Elena Vargas',
            'severity' => 'Leve',
            'status' => 'Pendiente',
        ]);
    }

    public function test_ticket_number_follows_correlative_format(): void
    {
        $payload = [
            'product_name' => 'Albemer Suspensión Oral',
            'reporter_name' => 'Juan Carlos',
            'reporter_type' => 'Paciente',
            'reporter_contact' => 'juan@example.com',
            'adverse_reaction' => 'Sabor amargo percibido por el paciente tras la toma de 10ml.',
            'severity' => 'Leve',
        ];

        $response = $this->postJson(route('farmacovigilancia.store'), $payload);

        $response->assertCreated();
        $ticket = $response->json('ticket_number');

        $year = date('Y');
        $this->assertMatchesRegularExpression("/^BOOZ-FV-{$year}-\d{4}$/", $ticket);
    }

    public function test_cannot_submit_report_without_required_fields(): void
    {
        $response = $this->postJson(route('farmacovigilancia.store'), []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['product_name', 'reporter_name', 'reporter_type', 'reporter_contact', 'adverse_reaction', 'severity']);
    }

    public function test_cannot_submit_invalid_severity(): void
    {
        $response = $this->postJson(route('farmacovigilancia.store'), [
            'product_name' => 'Betamer',
            'reporter_name' => 'Carlos',
            'reporter_type' => 'Paciente',
            'reporter_contact' => 'carlos@test.com',
            'adverse_reaction' => 'Picazón intensa reportada.',
            'severity' => 'Extrema', // No permitido
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['severity']);
    }
}
