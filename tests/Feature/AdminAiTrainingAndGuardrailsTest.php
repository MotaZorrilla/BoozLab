<?php

namespace Tests\Feature;

use App\Models\AiGuardrail;
use App\Models\AiKnowledgeDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AdminAiTrainingAndGuardrailsTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->superAdmin = User::where('email', 'admin@boozlab.com')->first()
            ?? User::factory()->create(['email' => 'admin@boozlab.com', 'is_admin' => true]);

        $this->regularUser = User::factory()->create([
            'email' => 'empleado@boozlab.com',
            'is_admin' => false,
        ]);
    }

    public function test_super_admin_can_access_ai_console_and_receives_documents_and_guardrails(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.ai.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/ai')
            ->has('knowledgeDocuments')
            ->has('guardrails')
            ->has('corpusStats')
            ->where('corpusStats.documents_count', fn ($count) => $count >= 4)
            ->where('corpusStats.guardrails_count', fn ($count) => $count >= 5)
        );
    }

    public function test_non_super_admin_cannot_access_ai_console(): void
    {
        $response = $this->actingAs($this->regularUser)->get(route('admin.ai.index'));

        $response->assertForbidden();
    }

    public function test_super_admin_can_create_knowledge_document(): void
    {
        $response = $this->actingAs($this->superAdmin)->post(route('admin.ai.documents.store'), [
            'title' => 'Guía de Estabilidad Térmica de Cremas',
            'category' => 'vademecum',
            'content' => 'Las cremas de Booz Laboratorio mantienen su estabilidad física entre 15°C y 30°C.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('ai_knowledge_documents', [
            'title' => 'Guía de Estabilidad Térmica de Cremas',
            'category' => 'vademecum',
            'is_active' => true,
        ]);
    }

    public function test_super_admin_can_upload_file_as_knowledge_document(): void
    {
        $file = UploadedFile::fake()->createWithContent('protocolo_lotes.txt', 'Procedimiento de cuarentena para lotes en planta.');

        $response = $this->actingAs($this->superAdmin)->post(route('admin.ai.documents.store'), [
            'title' => 'Protocolo de Cuarentena de Lotes',
            'category' => 'protocolo',
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('ai_knowledge_documents', [
            'title' => 'Protocolo de Cuarentena de Lotes',
            'file_name' => 'protocolo_lotes.txt',
        ]);
    }

    public function test_super_admin_can_toggle_and_delete_knowledge_document(): void
    {
        $doc = AiKnowledgeDocument::create([
            'title' => 'Documento Temporal',
            'category' => 'general',
            'content' => 'Contenido temporal para prueba.',
            'file_size_bytes' => 50,
            'is_active' => true,
        ]);

        // Toggle to inactive
        $this->actingAs($this->superAdmin)->post(route('admin.ai.documents.toggle', $doc->id));
        $this->assertFalse($doc->fresh()->is_active);

        // Delete
        $this->actingAs($this->superAdmin)->delete(route('admin.ai.documents.destroy', $doc->id));
        $this->assertDatabaseMissing('ai_knowledge_documents', ['id' => $doc->id]);
    }

    public function test_super_admin_can_create_and_manage_guardrails(): void
    {
        $response = $this->actingAs($this->superAdmin)->post(route('admin.ai.guardrails.store'), [
            'name' => 'Restricción de Precios Mayoristas',
            'type' => 'derivacion_humana',
            'rule_instruction' => 'No reveles tablas de descuento mayorista a usuarios particulares sin RIF comercial.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $guardrail = AiGuardrail::where('name', 'Restricción de Precios Mayoristas')->first();
        $this->assertNotNull($guardrail);
        $this->assertFalse($guardrail->is_system);

        // Toggle
        $this->actingAs($this->superAdmin)->post(route('admin.ai.guardrails.toggle', $guardrail->id));
        $this->assertFalse($guardrail->fresh()->is_active);

        // Custom guardrail can be deleted
        $this->actingAs($this->superAdmin)->delete(route('admin.ai.guardrails.destroy', $guardrail->id));
        $this->assertDatabaseMissing('ai_guardrails', ['id' => $guardrail->id]);
    }

    public function test_system_guardrail_cannot_be_deleted(): void
    {
        $systemGuardrail = AiGuardrail::where('is_system', true)->first();
        $this->assertNotNull($systemGuardrail);

        $response = $this->actingAs($this->superAdmin)->delete(route('admin.ai.guardrails.destroy', $systemGuardrail->id));
        $response->assertSessionHasErrors(['error']);

        $this->assertDatabaseHas('ai_guardrails', ['id' => $systemGuardrail->id]);
    }

    public function test_ai_test_playground_endpoint_executes_successfully(): void
    {
        $response = $this->actingAs($this->superAdmin)->postJson(route('admin.ai.test'), [
            'message' => '¿Cómo reportar una sospecha de reacción adversa?',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'success',
            'source',
            'latency_ms',
            'response',
        ]);
        $this->assertTrue($response->json('success'));
        $this->assertNotEmpty($response->json('response'));
    }

    public function test_chatbot_responds_to_pharmacovigilance_inquiry_with_trained_guidance(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => 'Tengo una sospecha de reacción adversa con un lote',
        ]);

        $response->assertOk();
        $this->assertStringContainsString('Farmacovigilancia', $response->json('reply'));
        $this->assertStringContainsString('lote', $response->json('reply'));
    }

    public function test_chatbot_responds_to_order_quote_inquiry_with_trained_guidance(): void
    {
        $response = $this->postJson(route('chatbot.query'), [
            'message' => '¿Cómo cotizar o hacer pedido al mayor?',
        ]);

        $response->assertOk();
        $this->assertStringContainsString('Bolsa de Pedidos', $response->json('reply'));
        $this->assertStringContainsString('Valle de Guanape', $response->json('reply'));
    }
}
