<?php

namespace Tests\Feature;

use App\Mail\NewMessageLeadAlert;
use App\Mail\NewPharmacovigilanceAlert;
use App\Models\Message;
use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdminExportAndAlertsTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'email' => 'admin@boozlaboratorio.com',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
    }

    private function createSampleProduct(): Product
    {
        $line = ProductLine::firstOrCreate(
            ['code' => '02'],
            ['name' => '02 Tratamiento tópico', 'description' => 'Línea de prueba', 'badge_color' => 'blue']
        );

        return Product::create([
            'product_line_id' => $line->id,
            'name' => 'Bactrocis',
            'slug' => 'bactrocis-crema',
            'active_ingredients' => 'Moxifloxacina 0.5%',
            'presentation' => 'Tubo 20g',
            'description' => 'Tratamiento antibiótico para pie diabético.',
            'indications' => 'Infecciones dérmicas severas.',
            'price' => 15.00,
            'stock' => 100,
            'is_prescription_required' => true,
            'is_active' => true,
            'views_count' => 0,
            'chatbot_inquiries_count' => 0,
            'quote_inquiries_count' => 0,
        ]);
    }

    public function test_admin_can_export_pharmacovigilance_reports_to_csv(): void
    {
        $admin = $this->createAdmin();

        PharmacovigilanceReport::create([
            'ticket_number' => 'BOOZ-2026-0001',
            'product_name' => 'Bactrocis',
            'reporter_name' => 'Dr. Carlos Mendoza',
            'reporter_type' => 'Médico',
            'reporter_contact' => 'carlos@mendoza.com',
            'adverse_reaction' => 'Prurito leve en zona perilesional.',
            'severity' => 'Leve',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.reports.exportCsv'));

        $response->assertOk();
        $this->assertStringContainsString('text/csv', $response->headers->get('content-type'));
        $this->assertStringContainsString('booz_farmacovigilancia', $response->headers->get('content-disposition'));
    }

    public function test_admin_can_export_messages_to_csv(): void
    {
        $admin = $this->createAdmin();

        Message::create([
            'type' => 'lira',
            'source' => 'lira_chatbot',
            'name' => 'Farmacia Bolívar',
            'email' => 'bolivar@farmacias.com',
            'phone' => '+58 412 5554433',
            'message' => 'Deseamos solicitar cotización institucional.',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.messages.exportCsv'));

        $response->assertOk();
        $this->assertStringContainsString('text/csv', $response->headers->get('content-type'));
        $this->assertStringContainsString('booz_mensajes_leads', $response->headers->get('content-disposition'));
    }

    public function test_admin_can_view_printable_acta_sanitaria(): void
    {
        $admin = $this->createAdmin();

        $report = PharmacovigilanceReport::create([
            'ticket_number' => 'BOOZ-2026-0099',
            'product_name' => 'Bactrocis',
            'batch_number' => 'L-2026-X1',
            'expiry_date' => '2028-05-30',
            'reporter_name' => 'Lic. María Pérez',
            'reporter_type' => 'Farmacéutico',
            'reporter_contact' => '0414-1234567',
            'adverse_reaction' => 'Eritema cutáneo moderado tras 48 horas de aplicación tópica.',
            'severity' => 'Moderada',
            'status' => 'En Revisión',
            'admin_notes' => 'Se solicitó contramuestra al lote L-2026-X1 en planta Valle de Guanape.',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.reports.print', $report));

        $response->assertOk();
        $response->assertSee('BOOZ-2026-0099');
        $response->assertSee('J-40906185-0');
        $response->assertSee('Rafael Rangel');
        $response->assertSee('Bactrocis');
    }

    public function test_pharmacovigilance_submission_dispatches_alert_email(): void
    {
        Mail::fake();

        $payload = [
            'product_name' => 'Bacumer',
            'reporter_name' => 'Dra. Isabel Silva',
            'reporter_type' => 'Médico',
            'reporter_contact' => 'isabel@clinica.com',
            'adverse_reaction' => 'Sensación urente en pliegues cutáneos.',
            'severity' => 'Moderada',
        ];

        $response = $this->post(route('farmacovigilancia.store'), $payload);

        $response->assertRedirect();
        Mail::assertSent(NewPharmacovigilanceAlert::class, function ($mail) {
            return $mail->report->product_name === 'Bacumer' &&
                   $mail->report->severity === 'Moderada';
        });
    }

    public function test_message_submission_dispatches_alert_email(): void
    {
        Mail::fake();

        $payload = [
            'type' => 'lira',
            'source' => 'lira_chatbot',
            'name' => 'Droguería Oriente',
            'email' => 'ventas@oriente.com',
            'phone' => '+58 414 1112233',
            'message' => 'Solicitud de lista de distribución para Anzoátegui.',
        ];

        $response = $this->postJson(route('api.messages.store'), $payload);

        $response->assertCreated();
        Mail::assertSent(NewMessageLeadAlert::class, function ($mail) {
            return $mail->leadMessage->name === 'Droguería Oriente';
        });
    }

    public function test_product_view_and_quote_increments_metrics(): void
    {
        $product = $this->createSampleProduct();
        $this->assertEquals(0, $product->views_count);
        $this->assertEquals(0, $product->quote_inquiries_count);

        // 1. Visita a PDP incrementa views_count
        $this->get(route('product.show', $product->slug))->assertOk();
        $product->refresh();
        $this->assertEquals(1, $product->views_count);

        // 2. Cotización incrementa quote_inquiries_count
        $quotePayload = [
            'customer_name' => 'Clínica San Gabriel',
            'customer_contact' => '+58 414 8887766',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 10],
            ],
        ];

        $this->postJson(route('api.quotes.store'), $quotePayload)->assertCreated();
        $product->refresh();
        $this->assertEquals(10, $product->quote_inquiries_count);
    }
}
