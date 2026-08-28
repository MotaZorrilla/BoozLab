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
        $admin = User::updateOrCreate(
            ['email' => 'admin@boozlaboratorio.com'],
            [
                'name' => 'Director Técnico Booz',
                'password' => Hash::make('admin1234'),
                'email_verified_at' => now(),
                'is_admin' => true,
            ]
        );

        $admin->assignRole('super_admin');
    }
}
