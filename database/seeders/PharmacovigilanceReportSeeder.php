<?php

namespace Database\Seeders;

use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use Illuminate\Database\Seeder;

class PharmacovigilanceReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all()->keyBy('slug');

        $bactrocis = $products->get('bactrocis-crema-especializada-pie-diabetico') ?? Product::first();
        $bacumer = $products->get('bacumer-crema-multifactorial') ?? Product::skip(1)->first();
        $betamer = $products->get('betamer-crema-antiinflamatoria') ?? Product::skip(2)->first();
        $calamicis = $products->get('calamicis-locion-calmante') ?? Product::skip(3)->first();
        $gentamicis = $products->get('gentamicis-crema-dermica') ?? Product::skip(4)->first();
        $quadrimer = $products->get('quadrimer-crema-terapeutica') ?? Product::skip(5)->first();

        $reports = [
            [
                'ticket_number' => 'BOOZ-FV-2026-0001',
                'product_id' => $bactrocis?->id,
                'product_name' => $bactrocis?->name ?? 'Bactrocis Crema',
                'batch_number' => 'LOTE-240-B01',
                'expiry_date' => '2027-08-30',
                'reporter_name' => 'Dra. Claudia Rivas',
                'reporter_type' => 'Médico',
                'reporter_contact' => '04142233441',
                'adverse_reaction' => 'Paciente refirió leve prurito localizado en bordes perilesionales tras 48 horas de aplicación tópica en úlcera diabética grado II. Cede espontáneamente al espaciar dosis.',
                'severity' => 'Leve',
                'status' => 'Resuelto',
                'admin_notes' => 'Evaluado por Dirección Técnica. No se evidencia alteración fisicoquímica en contra-muestra. Reportado a archivo anual INH.',
                'created_at' => now()->subDays(12),
            ],
            [
                'ticket_number' => 'BOOZ-FV-2026-0002',
                'product_id' => $bacumer?->id,
                'product_name' => $bacumer?->name ?? 'Bacumer Crema',
                'batch_number' => 'LOTE-240-M02',
                'expiry_date' => '2027-11-15',
                'reporter_name' => 'Farm. Andrés Morillo',
                'reporter_type' => 'Farmacéutico',
                'reporter_contact' => '04248899112',
                'adverse_reaction' => 'Eritema transitorio y ligera sensación de calor en zona de aplicación malar en paciente con rosácea.',
                'severity' => 'Leve',
                'status' => 'Resuelto',
                'admin_notes' => 'Efecto secundario benigno conocido por metronidazol tópico. Se orientó al farmacéutico dispensador.',
                'created_at' => now()->subDays(8),
            ],
            [
                'ticket_number' => 'BOOZ-FV-2026-0003',
                'product_id' => $betamer?->id,
                'product_name' => $betamer?->name ?? 'Betamer Crema',
                'batch_number' => 'LOTE-240-BET03',
                'expiry_date' => '2026-12-31',
                'reporter_name' => 'Sra. Josefina Gómez',
                'reporter_type' => 'Paciente',
                'reporter_contact' => '04163344556',
                'adverse_reaction' => 'Sensación de ardor moderado y adelgazamiento cutáneo tras aplicación ininterrumpida por más de 3 semanas en pliegues inguinales.',
                'severity' => 'Moderada',
                'status' => 'En Revisión',
                'admin_notes' => 'Caso en seguimiento. Paciente utilizó el corticosteroide por tiempo prolongado sin control médico. Se instruyó suspensión progresiva.',
                'created_at' => now()->subDays(5),
            ],
            [
                'ticket_number' => 'BOOZ-FV-2026-0004',
                'product_id' => $calamicis?->id,
                'product_name' => $calamicis?->name ?? 'Calamicis Loción',
                'batch_number' => 'LOTE-240-C04',
                'expiry_date' => '2028-02-28',
                'reporter_name' => 'Dra. Mariana López',
                'reporter_type' => 'Médico',
                'reporter_contact' => '04149900112',
                'adverse_reaction' => 'Ligera xerosis cutánea en paciente pediátrico de 4 años tras uso reiterado por varicela.',
                'severity' => 'Leve',
                'status' => 'Resuelto',
                'admin_notes' => 'Respuesta astringente normal al óxido de zinc. Se recomendó alternar con crema humectante Hidramer.',
                'created_at' => now()->subDays(3),
            ],
            [
                'ticket_number' => 'BOOZ-FV-2026-0005',
                'product_id' => $gentamicis?->id,
                'product_name' => $gentamicis?->name ?? 'Gentamicis Crema',
                'batch_number' => 'LOTE-240-G01',
                'expiry_date' => '2027-06-30',
                'reporter_name' => 'Dr. Roberto Mendoza - Hosp. Razetti',
                'reporter_type' => 'Médico',
                'reporter_contact' => '04125566778',
                'adverse_reaction' => 'Sospecha de dermatitis de contacto alérgica perilesional en quemadura de 2do grado.',
                'severity' => 'Moderada',
                'status' => 'En Revisión',
                'admin_notes' => 'En proceso de prueba de sensibilidad. Muestra de retención del lote aislada en planta Valle de Guanape.',
                'created_at' => now()->subDay(),
            ],
            [
                'ticket_number' => 'BOOZ-FV-2026-0006',
                'product_id' => $quadrimer?->id,
                'product_name' => $quadrimer?->name ?? 'Quadrimer Crema',
                'batch_number' => 'LOTE-240-Q05',
                'expiry_date' => '2027-09-30',
                'reporter_name' => 'Pedro Luis Barreto',
                'reporter_type' => 'Paciente',
                'reporter_contact' => '04147788991',
                'adverse_reaction' => 'Aparición de pequeñas vesículas pruriginosas en flexura de codo tras 4 días de aplicación.',
                'severity' => 'Leve',
                'status' => 'Pendiente',
                'admin_notes' => 'Pendiente contacto telefónico con el notificante para completar ficha epidemiológica.',
                'created_at' => now()->subHours(6),
            ],
        ];

        foreach ($reports as $r) {
            PharmacovigilanceReport::updateOrCreate(
                ['ticket_number' => $r['ticket_number']],
                $r
            );
        }
    }
}
