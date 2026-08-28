<?php

namespace Tests\Feature;

use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use App\Models\ProductLine;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSecurityEnforcementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_unauthenticated_user_cannot_create_product(): void
    {
        $line = ProductLine::first();

        $response = $this->post(route('admin.products.store'), [
            'product_line_id' => $line->id,
            'name' => 'Intento No Autorizado',
            'presentation' => 'Tubo 20g',
            'active_ingredients' => 'Prueba',
            'description' => 'Test',
            'indications' => 'Test',
            'price' => 10.0,
            'stock' => 10,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('products', ['name' => 'Intento No Autorizado']);
    }

    public function test_non_admin_user_cannot_create_product(): void
    {
        $regularUser = User::factory()->create(['is_admin' => false]);
        $line = ProductLine::first();

        $response = $this->actingAs($regularUser)->post(route('admin.products.store'), [
            'product_line_id' => $line->id,
            'name' => 'Intento No Admin',
            'presentation' => 'Tubo 20g',
            'active_ingredients' => 'Prueba',
            'description' => 'Test',
            'indications' => 'Test',
            'price' => 10.0,
            'stock' => 10,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('products', ['name' => 'Intento No Admin']);
    }

    public function test_non_admin_user_cannot_update_product(): void
    {
        $regularUser = User::factory()->create(['is_admin' => false]);
        $product = Product::first();

        $response = $this->actingAs($regularUser)->put(route('admin.products.update', $product), [
            'product_line_id' => $product->product_line_id,
            'name' => 'Nombre Modificado Ilegal',
            'slug' => $product->slug,
            'presentation' => $product->presentation,
            'active_ingredients' => $product->active_ingredients,
            'description' => $product->description,
            'indications' => $product->indications,
            'price' => 999.0,
            'stock' => 10,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('products', ['name' => 'Nombre Modificado Ilegal']);
    }

    public function test_non_admin_user_cannot_toggle_product_status(): void
    {
        $regularUser = User::factory()->create(['is_admin' => false]);
        $product = Product::first();
        $originalStatus = $product->is_active;

        $response = $this->actingAs($regularUser)->post(route('admin.products.toggle', $product));

        $response->assertForbidden();
        $this->assertEquals($originalStatus, $product->fresh()->is_active);
    }

    public function test_non_admin_user_cannot_delete_product(): void
    {
        $regularUser = User::factory()->create(['is_admin' => false]);
        $product = Product::first();

        $response = $this->actingAs($regularUser)->delete(route('admin.products.destroy', $product));

        $response->assertForbidden();
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_non_admin_user_cannot_update_pharmacovigilance_report_status(): void
    {
        $regularUser = User::factory()->create(['is_admin' => false]);
        $report = PharmacovigilanceReport::create([
            'ticket_number' => 'BOOZ-FV-2026-TESTSEC',
            'product_name' => 'Bacumer',
            'reporter_name' => 'Dr. Intruso',
            'reporter_type' => 'Médico',
            'reporter_contact' => 'intruso@test.com',
            'adverse_reaction' => 'Reacción para prueba de seguridad.',
            'severity' => 'Moderada',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($regularUser)->put(route('admin.reports.updateStatus', $report), [
            'status' => 'Resuelto',
            'admin_notes' => 'Manipulación no autorizada.',
        ]);

        $response->assertForbidden();
        $this->assertEquals('Pendiente', $report->fresh()->status);
    }

    public function test_product_creation_fails_with_negative_price_or_negative_stock(): void
    {
        $admin = User::first();
        $line = ProductLine::first();

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'product_line_id' => $line->id,
            'name' => 'Producto Inválido',
            'presentation' => 'Frasco 100ml',
            'active_ingredients' => 'Inválido',
            'description' => 'Test',
            'indications' => 'Test',
            'price' => -5.0,
            'stock' => -10,
        ]);

        $response->assertSessionHasErrors(['price', 'stock']);
    }
}
