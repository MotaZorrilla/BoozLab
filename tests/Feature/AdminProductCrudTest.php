<?php

namespace Tests\Feature;

use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guests_cannot_access_dashboard(): void
    {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_admin_can_view_dashboard_with_kpis(): void
    {
        $admin = User::first();

        $response = $this->actingAs($admin)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('stats')
            ->has('products')
            ->has('productLines')
            ->has('reports')
        );
    }

    public function test_admin_can_create_new_product(): void
    {
        $admin = User::first();
        $line = ProductLine::first();

        $payload = [
            'product_line_id' => $line->id,
            'name' => 'Neocis Pomada Cicatrizante',
            'slug' => 'neocis-pomada',
            'active_ingredients' => 'Neomicina 0.5% + Óxido de Zinc 10%',
            'presentation' => 'Tubo colapsible 30g',
            'description' => 'Pomada antiséptica dérmica de uso local.',
            'indications' => 'Quemaduras leves, heridas menores y raspones.',
            'posology' => 'Aplicar 2 veces al día.',
            'contraindications' => 'Hipersensibilidad.',
            'price' => 5.50,
            'stock' => 60,
            'is_prescription_required' => false,
            'is_active' => true,
        ];

        $response = $this->actingAs($admin)->post(route('admin.products.store'), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'name' => 'Neocis Pomada Cicatrizante',
            'slug' => 'neocis-pomada',
        ]);
    }

    public function test_admin_can_update_product_properties(): void
    {
        $admin = User::first();
        $product = Product::first();

        $payload = [
            'product_line_id' => $product->product_line_id,
            'name' => $product->name.' Modificado',
            'slug' => $product->slug,
            'active_ingredients' => $product->active_ingredients,
            'presentation' => 'Tubo colapsible 25g',
            'description' => 'Descripción actualizada para pruebas.',
            'indications' => $product->indications,
            'price' => 12.00,
            'stock' => 120,
            'is_prescription_required' => true,
            'is_active' => true,
        ];

        $response = $this->actingAs($admin)->put(route('admin.products.update', $product), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'presentation' => 'Tubo colapsible 25g',
            'price' => 12.00,
        ]);
    }

    public function test_admin_can_toggle_product_active_status(): void
    {
        $admin = User::first();
        $product = Product::first();
        $originalStatus = $product->is_active;

        $response = $this->actingAs($admin)->post(route('admin.products.toggle', $product));

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_active' => ! $originalStatus,
        ]);
    }

    public function test_admin_can_delete_product(): void
    {
        $admin = User::first();
        $product = Product::first();

        $response = $this->actingAs($admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect();
        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_admin_can_update_pharmacovigilance_report_status(): void
    {
        $admin = User::first();

        $report = PharmacovigilanceReport::create([
            'ticket_number' => 'BOOZ-FV-2026-TEST',
            'product_name' => 'Bacumer Crema',
            'reporter_name' => 'Dr. Test',
            'reporter_type' => 'Médico',
            'reporter_contact' => 'test@test.com',
            'adverse_reaction' => 'Reacción de prueba para actualizar estado.',
            'severity' => 'Moderada',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.reports.updateStatus', $report), [
            'status' => 'Resuelto',
            'admin_notes' => 'Lote verificado en control de calidad. No se evidenciaron impurezas.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('pharmacovigilance_reports', [
            'id' => $report->id,
            'status' => 'Resuelto',
            'admin_notes' => 'Lote verificado en control de calidad. No se evidenciaron impurezas.',
        ]);
    }
}
