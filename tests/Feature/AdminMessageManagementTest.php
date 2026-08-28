<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMessageManagementTest extends TestCase
{
    use RefreshDatabase;

    private function createAdminUser(): User
    {
        return User::factory()->create([
            'email' => 'admin@boozlaboratorio.com',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
    }

    private function createRegularUser(): User
    {
        return User::factory()->create([
            'email' => 'user@example.com',
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);
    }

    public function test_admin_can_update_message_status_and_notes(): void
    {
        $admin = $this->createAdminUser();

        $message = Message::create([
            'type' => 'lira',
            'source' => 'lira_chatbot',
            'name' => 'Farmacia Los Andes',
            'email' => 'contacto@losandes.com',
            'phone' => '+58 414 9998888',
            'message' => 'Solicitud de lista de precios al mayor para 50 unidades de Bacumer.',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($admin)
            ->put(route('admin.messages.updateStatus', $message), [
                'status' => 'En Gestión',
                'admin_notes' => 'Contactado por WhatsApp. Se envió catálogo y lista de precios al mayor.',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'status' => 'En Gestión',
            'admin_notes' => 'Contactado por WhatsApp. Se envió catálogo y lista de precios al mayor.',
        ]);
    }

    public function test_non_admin_cannot_update_message_status(): void
    {
        $regularUser = $this->createRegularUser();

        $message = Message::create([
            'type' => 'contacto',
            'source' => 'web',
            'name' => 'Dr. José',
            'email' => 'jose@example.com',
            'message' => 'Consulta técnica sobre dosis de Gentamicis.',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($regularUser)
            ->put(route('admin.messages.updateStatus', $message), [
                'status' => 'Resuelto',
            ]);

        $response->assertForbidden();
    }

    public function test_cannot_update_message_with_invalid_status(): void
    {
        $admin = $this->createAdminUser();

        $message = Message::create([
            'type' => 'lira',
            'name' => 'Cliente',
            'email' => 'cliente@example.com',
            'message' => 'Mensaje...',
            'status' => 'Pendiente',
        ]);

        $response = $this->actingAs($admin)
            ->put(route('admin.messages.updateStatus', $message), [
                'status' => 'EstadoInvalido',
            ]);

        $response->assertSessionHasErrors(['status']);
    }
}
