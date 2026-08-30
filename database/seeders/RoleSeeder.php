<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Administrador',
                'slug' => 'super_admin',
                'description' => 'Control total y acceso irrestricto a todos los módulos y configuraciones.',
                'permissions' => ['*'],
            ],
            [
                'name' => 'Director Técnico',
                'slug' => 'director_tecnico',
                'description' => 'Supervisión de farmacovigilancia INH, dictámenes sanitarios, actas oficiales y fórmulas del catálogo.',
                'permissions' => [
                    'products.view',
                    'products.review',
                    'reports.view',
                    'reports.manage',
                    'reports.print',
                    'analytics.view',
                ],
            ],
            [
                'name' => 'Gestor Comercial',
                'slug' => 'gestor_comercial',
                'description' => 'Gestión de productos, stock, precios, cotizaciones de WhatsApp y leads.',
                'permissions' => [
                    'products.view',
                    'products.manage',
                    'quotes.view',
                    'quotes.manage',
                    'messages.view',
                    'messages.manage',
                ],
            ],
            [
                'name' => 'Oficial de Farmacovigilancia',
                'slug' => 'oficial_farmacovigilancia',
                'description' => 'Registro, clasificación y resolución de reportes sanitarios e impresión de actas INH.',
                'permissions' => [
                    'reports.view',
                    'reports.manage',
                    'reports.print',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                [
                    'name' => $roleData['name'],
                    'description' => $roleData['description'],
                    'permissions' => $roleData['permissions'],
                ]
            );
        }
    }
}
