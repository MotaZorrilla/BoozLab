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
                'channel' => 'whatsapp',
                'items_payload' => [
                    ['product_id' => $bactrocis->id, 'quantity' => 20],
                    ['product_id' => $bacumer->id, 'quantity' => 15],
                    ['product_id' => $calamicis->id, 'quantity' => 30],
                ],
                'total_items' => 65,
                'total_amount' => (20 * 14.50) + (15 * 9.80) + (30 * 5.50), // 290 + 147 + 165 = 602.00
                'status' => 'Despachado',
                'admin_notes' => 'Despachado en sede Lechería. Pago confirmado vía transferencia Banesco.',
                'downloaded_at' => now()->subDays(6),
                'created_at' => now()->subDays(7),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0002',
                'customer_name' => 'Clínica Metropolitana Oriente',
                'customer_contact' => '04248123344',
                'customer_type' => 'Clínica',
                'channel' => 'manual',
                'items_payload' => [
                    ['product_id' => $gentamicis->id, 'quantity' => 25],
                    ['product_id' => $amikacis->id, 'quantity' => 20],
                    ['product_id' => $betamer->id, 'quantity' => 15],
                ],
                'total_items' => 60,
                'total_amount' => (25 * 6.50) + (20 * 8.90) + (15 * 7.20), // 162.5 + 178 + 108 = 448.50
                'status' => 'Despachado',
                'admin_notes' => 'Orden de compra clínica #MET-994. Despacho directo por planta.',
                'downloaded_at' => now()->subDays(5),
                'created_at' => now()->subDays(6),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0003',
                'customer_name' => 'Droguería FarmaUnión C.A.',
                'customer_contact' => '04123344551',
                'customer_type' => 'Distribuidor',
                'channel' => 'whatsapp',
                'items_payload' => [
                    ['product_id' => $calamicis->id, 'quantity' => 100],
                    ['product_id' => $beducis->id, 'quantity' => 50],
                    ['product_id' => $cevitmer->id, 'quantity' => 80],
                    ['product_id' => $albemer->id, 'quantity' => 60],
                ],
                'total_items' => 290,
                'total_amount' => (100 * 5.50) + (50 * 7.80) + (80 * 6.20) + (60 * 4.50), // 550 + 390 + 496 + 270 = 1706.00
                'status' => 'En Gestión',
                'admin_notes' => 'Negociando descuento del 8% por pronto pago con gerencia comercial.',
                'created_at' => now()->subDays(4),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0004',
                'customer_name' => 'Sra. Teresa de Ramos',
                'customer_contact' => '04149988776',
                'customer_type' => 'Paciente',
                'channel' => 'web_cart',
                'items_payload' => [
                    ['product_id' => $bactrocis->id, 'quantity' => 3],
                    ['product_id' => $beducis->id, 'quantity' => 2],
                ],
                'total_items' => 5,
                'total_amount' => (3 * 14.50) + (2 * 7.80), // 43.5 + 15.6 = 59.10
                'status' => 'Contactado',
                'admin_notes' => 'Se le indicó farmacia más cercana en Puerto La Cruz para retiro inmediato.',
                'created_at' => now()->subDays(3),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0005',
                'customer_name' => 'Farmacia San Rafael Puerto La Cruz',
                'customer_contact' => '04167788992',
                'customer_type' => 'Farmacia',
                'channel' => 'whatsapp',
                'items_payload' => [
                    ['product_id' => $bacumer->id, 'quantity' => 12],
                    ['product_id' => $betamer->id, 'quantity' => 10],
                    ['product_id' => $gentamicis->id, 'quantity' => 10],
                ],
                'total_items' => 32,
                'total_amount' => (12 * 9.80) + (10 * 7.20) + (10 * 6.50), // 117.6 + 72 + 65 = 254.60
                'status' => 'Pendiente',
                'admin_notes' => null,
                'created_at' => now()->subDays(2),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0006',
                'customer_name' => 'Centro Médico Docente Guanape',
                'customer_contact' => '04245544332',
                'customer_type' => 'Clínica',
                'channel' => 'manual',
                'items_payload' => [
                    ['product_id' => $bactrocis->id, 'quantity' => 10],
                    ['product_id' => $gentamicis->id, 'quantity' => 15],
                    ['product_id' => $beducis->id, 'quantity' => 10],
                ],
                'total_items' => 35,
                'total_amount' => (10 * 14.50) + (15 * 6.50) + (10 * 7.80), // 145 + 97.5 + 78 = 320.50
                'status' => 'En Gestión',
                'admin_notes' => 'Cotización elaborada en visita técnica a planta.',
                'created_at' => now()->subDay(),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0007',
                'customer_name' => 'Dr. Pedro Rondón - Consulta Privada',
                'customer_contact' => '04121122334',
                'customer_type' => 'Clínica',
                'channel' => 'whatsapp',
                'items_payload' => [
                    ['product_id' => $bacumer->id, 'quantity' => 8],
                    ['product_id' => $betamer->id, 'quantity' => 8],
                    ['product_id' => $calamicis->id, 'quantity' => 6],
                ],
                'total_items' => 22,
                'total_amount' => (8 * 9.80) + (8 * 7.20) + (6 * 5.50), // 78.4 + 57.6 + 33 = 169.00
                'status' => 'Pendiente',
                'admin_notes' => null,
                'created_at' => now()->subHours(10),
            ],
            [
                'quote_number' => 'BOOZ-COT-2026-0008',
                'customer_name' => 'Carlos Alberto Méndez',
                'customer_contact' => '04144455667',
                'customer_type' => 'Paciente',
                'channel' => 'web_cart',
                'items_payload' => [
                    ['product_id' => $cevitmer->id, 'quantity' => 2],
                    ['product_id' => $calamicis->id, 'quantity' => 1],
                ],
                'total_items' => 3,
                'total_amount' => (2 * 6.20) + (1 * 5.50), // 12.4 + 5.5 = 17.90
                'status' => 'Pendiente',
                'admin_notes' => null,
                'created_at' => now()->subHours(3),
            ],
        ];

        foreach ($quotes as $q) {
            Quote::updateOrCreate(
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
