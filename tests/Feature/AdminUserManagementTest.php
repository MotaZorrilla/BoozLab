<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_super_admin_can_create_new_user_with_role(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();

        $response = $this->actingAs($superAdmin)->post(route('admin.users.store'), [
            'name' => 'Lic. Ana Martínez',
            'email' => 'ana@boozlaboratorio.com',
            'role' => 'gestor_comercial',
            'password' => 'Segura12345*!',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'ana@boozlaboratorio.com',
            'is_admin' => true,
        ]);

        $created = User::where('email', 'ana@boozlaboratorio.com')->first();
        $this->assertTrue($created->hasRole('gestor_comercial'));
    }

    public function test_super_admin_cannot_delete_own_account(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();

        $response = $this->actingAs($superAdmin)->delete(route('admin.users.destroy', $superAdmin));

        $response->assertSessionHasErrors(['error']);
        $this->assertDatabaseHas('users', ['id' => $superAdmin->id]);
    }

    public function test_cannot_delete_the_only_super_admin(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();

        // Create another admin acting as operator
        $secondAdmin = User::factory()->create(['is_admin' => true]);
        $secondAdmin->assignRole('super_admin');

        // Delete first, leaving only 1
        $this->actingAs($secondAdmin)->delete(route('admin.users.destroy', $superAdmin));

        // Now attempt to delete the remaining last super admin
        $response = $this->actingAs($superAdmin)->delete(route('admin.users.destroy', $secondAdmin));
        $this->assertDatabaseHas('users', ['id' => $secondAdmin->id]);
    }
}
