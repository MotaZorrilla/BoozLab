<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Quote;
use Illuminate\Database\Seeder;

class QuoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all()->keyBy('slug');

        $bactrocis = $products->get('bactrocis-crema-especializada-pie-diabetico') ?? Product::first();
        $bacumer = $products->get('bacumer-crema-multifactorial') ?? Product::skip(1)->first();
        $calamicis = $products->get('calamicis-locion-calmante') ?? Product::skip(2)->first();
        $beducis = $products->get('beducis-crema-regeneradora') ?? Product::skip(3)->first();
        $gentamicis = $products->get('gentamicis-crema-dermica') ?? Product::skip(4)->first();
        $amikacis = $products->get('amikacis-crema-antibiotica') ?? Product::skip(5)->first();
        $betamer = $products->get('betamer-crema-antiinflamatoria') ?? Product::skip(6)->first();
        $cevitmer = $products->get('cevitmer-vitamina-c') ?? Product::skip(7)->first();
        $albemer = $products->get('albemer-suspension-oral') ?? Product::skip(8)->first();

        $quotes = [
            [
                'quote_number' => 'BOOZ-COT-2026-0001',
                'customer_name' => 'Farmatodo Express Lechería',
                'customer_contact' => '04148899111',
                'customer_type' => 'Farmacia',
                'items_payload' => [
                    ['product_id' => $bactrocis->id, 'quantity' => 20],
                    ['product_id' => $bacumer->id, 'quantity' => 15],
                    ['product_id' => $calamicis->id, 'quantity' => 30],
                ],
                'total_items' => 65,
                'status' => 'Despachado',
                'created_at' => now()->subDays(7),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0002',
                'customer_name' => 'Clínica Metropolitana Oriente',
                'customer_contact' => '04248123344',
                'customer_type' => 'Clínica',
                'items_payload' => [
                    ['product_id' => $gentamicis->id, 'quantity' => 25],
                    ['product_id' => $amikacis->id, 'quantity' => 20],
                    ['product_id' => $betamer->id, 'quantity' => 15],
                ],
                'total_items' => 60,
                'status' => 'Despachado',
                'created_at' => now()->subDays(6),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0003',
                'customer_name' => 'Droguería FarmaUnión C.A.',
                'customer_contact' => '04123344551',
                'customer_type' => 'Distribuidor',
                'items_payload' => [
                    ['product_id' => $calamicis->id, 'quantity' => 100],
                    ['product_id' => $beducis->id, 'quantity' => 50],
                    ['product_id' => $cevitmer->id, 'quantity' => 80],
                    ['product_id' => $albemer->id, 'quantity' => 60],
                ],
                'total_items' => 290,
                'status' => 'En Gestión',
                'created_at' => now()->subDays(4),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0004',
                'customer_name' => 'Sra. Teresa de Ramos',
                'customer_contact' => '04149988776',
                'customer_type' => 'Paciente',
                'items_payload' => [
                    ['product_id' => $bactrocis->id, 'quantity' => 3],
                    ['product_id' => $beducis->id, 'quantity' => 2],
                ],
                'total_items' => 5,
                'status' => 'Contactado',
                'created_at' => now()->subDays(3),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0005',
                'customer_name' => 'Farmacia San Rafael Puerto La Cruz',
                'customer_contact' => '04167788992',
                'customer_type' => 'Farmacia',
                'items_payload' => [
                    ['product_id' => $bacumer->id, 'quantity' => 12],
                    ['product_id' => $betamer->id, 'quantity' => 10],
                    ['product_id' => $gentamicis->id, 'quantity' => 10],
                ],
                'total_items' => 32,
                'status' => 'Pendiente',
                'created_at' => now()->subDays(2),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0006',
                'customer_name' => 'Centro Médico Docente Guanape',
                'customer_contact' => '04245544332',
                'customer_type' => 'Clínica',
                'items_payload' => [
                    ['product_id' => $bactrocis->id, 'quantity' => 10],
                    ['product_id' => $gentamicis->id, 'quantity' => 15],
                    ['product_id' => $beducis->id, 'quantity' => 10],
                ],
                'total_items' => 35,
                'status' => 'En Gestión',
                'created_at' => now()->subDay(),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0007',
                'customer_name' => 'Dr. Pedro Rondón - Consulta Privada',
                'customer_contact' => '04121122334',
                'customer_type' => 'Clínica',
                'items_payload' => [
                    ['product_id' => $bacumer->id, 'quantity' => 8],
                    ['product_id' => $betamer->id, 'quantity' => 8],
                    ['product_id' => $calamicis->id, 'quantity' => 6],
                ],
                'total_items' => 22,
                'status' => 'Pendiente',
                'created_at' => now()->subHours(10),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0008',
                'customer_name' => 'Carlos Alberto Méndez',
                'customer_contact' => '04144455667',
                'customer_type' => 'Paciente',
                'items_payload' => [
                    ['product_id' => $cevitmer->id, 'quantity' => 2],
                    ['product_id' => $calamicis->id, 'quantity' => 1],
                ],
                'total_items' => 3,
                'status' => 'Pendiente',
                'created_at' => now()->subHours(3),
            ],
        ];

        foreach ($quotes as $q) {
            $createdQuote = Quote::updateOrCreate(
                ['quote_number' => $q['quote_number']],
                $q
            );

            // Sincronizar métricas de demanda por producto
            foreach ($q['items_payload'] as $item) {
                Product::where('id', $item['product_id'])->increment('quote_inquiries_count', $item['quantity']);
            }
        }
    }
}
