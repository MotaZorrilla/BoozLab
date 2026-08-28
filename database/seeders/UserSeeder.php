<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'email' => 'admin@boozlaboratorio.com',
                'name' => 'Dr. Carlos Mendoza',
                'password' => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin' => true,
                'role' => 'super_admin',
            ],
            [
                'email' => 'direccion.tecnica@boozlaboratorio.com',
                'name' => 'Dra. Beatriz Paredes',
                'password' => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin' => true,
                'role' => 'director_tecnico',
            ],
            [
                'email' => 'ventas@boozlaboratorio.com',
                'name' => 'Lic. Valentina Rivas',
                'password' => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin' => true,
                'role' => 'gestor_comercial',
            ],
            [
                'email' => 'farmacovigilancia@boozlaboratorio.com',
                'name' => 'Farm. Elena Salazar',
                'password' => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin' => true,
                'role' => 'oficial_farmacovigilancia',
            ],
            [
                'email' => 'comercial@boozlaboratorio.com',
                'name' => 'Lcdo. Roberto Gómez',
                'password' => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin' => true,
                'role' => 'gestor_comercial',
            ],
        ];

        foreach ($users as $data) {
            $roleSlug = $data['role'];
            unset($data['role']);

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                $data
            );

            $user->syncRoles([$roleSlug]);
        }
    }
}
