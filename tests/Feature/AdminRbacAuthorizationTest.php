<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRbacAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_super_admin_can_access_all_admin_modules(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();
        $this->actingAs($superAdmin);

        $this->get(route('dashboard'))->assertOk();
        $this->get(route('admin.products.index'))->assertOk();
        $this->get(route('admin.reports.index'))->assertOk();
        $this->get(route('admin.messages.index'))->assertOk();
        $this->get(route('admin.quotes.index'))->assertOk();
        $this->get(route('admin.users.index'))->assertOk();
        $this->get(route('admin.ai.index'))->assertOk();
        $this->get(route('admin.settings.index'))->assertOk();
    }

    public function test_role_seeders_create_four_official_roles(): void
    {
        $this->assertDatabaseHas('roles', ['slug' => 'super_admin']);
        $this->assertDatabaseHas('roles', ['slug' => 'director_tecnico']);
        $this->assertDatabaseHas('roles', ['slug' => 'gestor_comercial']);
        $this->assertDatabaseHas('roles', ['slug' => 'oficial_farmacovigilancia']);
    }

    public function test_user_has_role_and_permission_methods(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $user->assignRole('gestor_comercial');

        $this->assertTrue($user->hasRole('gestor_comercial'));
        $this->assertFalse($user->hasRole('super_admin'));
        $this->assertTrue($user->hasPermission('quotes.view'));
        $this->assertEquals('gestor_comercial', $user->primary_role);
    }

    public function test_commercial_manager_cannot_access_settings_or_users(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $user->assignRole('gestor_comercial');
        $this->actingAs($user);

        $this->get(route('admin.quotes.index'))->assertOk();
        $this->get(route('admin.messages.index'))->assertOk();
        $this->get(route('admin.settings.index'))->assertForbidden();
        $this->get(route('admin.users.index'))->assertForbidden();
        $this->get(route('admin.ai.index'))->assertForbidden();
    }

    public function test_pharmacovigilance_officer_is_restricted_to_reports(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $user->assignRole('oficial_farmacovigilancia');
        $this->actingAs($user);

        $this->get(route('admin.reports.index'))->assertOk();
        $this->get(route('admin.quotes.index'))->assertForbidden();
        $this->get(route('admin.settings.index'))->assertForbidden();
        $this->get(route('admin.users.index'))->assertForbidden();
    }
}
