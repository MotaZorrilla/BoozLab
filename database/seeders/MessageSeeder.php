<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'email' => 'marcos.villalobos@dermaclinic.ve',
                'name' => 'Dr. Marcos Villalobos',
                'phone' => '04142345678',
                'type' => 'consulta',
                'source' => 'web',
                'subject' => 'Solicitud de fichas técnicas para dermatología',
                'message' => 'Buenas tardes, quisiera recibir las monografías clínicas de Bacumer Crema y Bactrocis para incluirlas en nuestro protocolo clínico ambulatorio.',
                'status' => 'Resuelto',
                'admin_notes' => 'Se remitieron las fichas técnicas por correo y se agendó visita técnica con visitador médico de la zona.',
                'created_at' => now()->subDays(6),
            ],
            [
                'email' => 'compras@droguerianolver.com',
                'name' => 'Lic. Mariana Delgado - Droguería Nolver Oriente',
                'phone' => '04248123456',
                'type' => 'comercial',
                'source' => 'web',
                'subject' => 'Cotización por volumen de Calamicis y Cevitmer',
                'message' => 'Requerimos cotización formal para 500 unidades de Calamicis 200ml y 300 unidades de Cevitmer Gotas para despacho en Barcelona y Puerto La Cruz.',
                'status' => 'En Gestión',
                'admin_notes' => 'Cotización con escala de descuentos B2B enviada por WhatsApp al departamento de compras.',
                'created_at' => now()->subDays(5),
            ],
            [
                'email' => 'alejandro.colmenares@gmail.com',
                'name' => 'Alejandro Colmenares',
                'phone' => '04129988112',
                'type' => 'lira',
                'source' => 'lira_chatbot',
                'subject' => 'Consulta sobre Bactrocis Pie Diabético',
                'message' => 'Hola, Lira me atendió y me recomendó contactar al laboratorio para saber dónde adquirir Bactrocis Crema en Barquisimeto para mi padre que tiene úlcera diabética.',
                'status' => 'Pendiente',
                'admin_notes' => null,
                'created_at' => now()->subDays(4),
            ],
            [
                'email' => 'sofia.benitez@pediatriaccs.com',
                'name' => 'Dra. Sofía Benítez - Pediatra',
                'phone' => '04141122334',
                'type' => 'consulta',
                'source' => 'web',
                'subject' => 'Disponibilidad de Albemer Suspensión Pediátrica',
                'message' => 'Estimados colegas de Booz, necesito saber qué farmacias aliadas en Caracas tienen stock inmediato de Albemer 10ml para tratamiento antiparasitario infantil.',
                'status' => 'Contactado',
                'admin_notes' => 'Se suministró el listado de 8 farmacias con inventario activo en la Gran Caracas.',
                'created_at' => now()->subDays(3),
            ],
            [
                'email' => 'grangel@farmaoriente.com.ve',
                'name' => 'Ing. Gustavo Rangel - Distribuidora FarmaOriente',
                'phone' => '04249345671',
                'type' => 'comercial',
                'source' => 'lira_chatbot',
                'subject' => 'Interés en distribución exclusiva en Anzoátegui Sur',
                'message' => 'Buenas tardes, conversé con su asistente Lira y nos interesa distribuir la línea tópica y bienestar en nuestras sucursales de Anaco y El Tigre.',
                'status' => 'En Gestión',
                'admin_notes' => 'Enviado dossier comercial y políticas de crédito a 30 días.',
                'created_at' => now()->subDays(3),
            ],
            [
                'email' => 'carmen.machado62@cantv.net',
                'name' => 'Carmen Teresa Machado',
                'phone' => '04165544332',
                'type' => 'lira',
                'source' => 'lira_chatbot',
                'subject' => 'Consulta sobre Beducis Regeneradora',
                'message' => 'Me gustaría saber si la crema Beducis sirve para la resequedad extrema por tratamientos oncológicos. Lira me indicó que consulte con los especialistas de Booz.',
                'status' => 'Pendiente',
                'admin_notes' => null,
                'created_at' => now()->subDays(2),
            ],
            [
                'email' => 'farmacialagracia@hotmail.com',
                'name' => 'Farmacia La Gracia de Dios C.A.',
                'phone' => '04148765432',
                'type' => 'comercial',
                'source' => 'web',
                'subject' => 'Reposición de stock Betamer y Quadrimer',
                'message' => 'Solicitamos despacho urgente de 50 tubos de Betamer Crema y 50 de Quadrimer para nuestra sede central en Maturín.',
                'status' => 'Resuelto',
                'admin_notes' => 'Despachado con guía de encomienda #449102. Factura emitida y cancelada.',
                'created_at' => now()->subDays(2),
            ],
            [
                'email' => 'lquintero@cirugiavalencia.com',
                'name' => 'Dr. Leonardo Quintero - Cirujano',
                'phone' => '04123344556',
                'type' => 'consulta',
                'source' => 'web',
                'subject' => 'Consulta técnica sobre formulación de Bactrocis',
                'message' => 'Quisiera confirmar la concentración exacta de moxifloxacina en Bactrocis para profilaxis postquirúrgica dérmica en incisiones limpias.',
                'status' => 'Contactado',
                'admin_notes' => 'Dirección Técnica se comunicó telefónicamente y aclaró especificación según monografía INH.',
                'created_at' => now()->subDay(),
            ],
            [
                'email' => 'yuri.castillo88@gmail.com',
                'name' => 'Yurimar Castillo',
                'phone' => '04247788990',
                'type' => 'lira',
                'source' => 'lira_chatbot',
                'subject' => 'Disponibilidad de Cevitmer en Maracaibo',
                'message' => 'Hola Lira, quiero comprar Vitamina C Cevitmer para mis niños, ¿hacen envíos directos a Maracaibo o qué cadena lo tiene?',
                'status' => 'Pendiente',
                'admin_notes' => null,
                'created_at' => now()->subHours(14),
            ],
            [
                'email' => 'compras@policlinicapzo.com',
                'name' => 'Lic. Fernando Alfonzo - Policlínica Puerto Ordaz',
                'phone' => '04148899001',
                'type' => 'comercial',
                'source' => 'web',
                'subject' => 'Convenio institucional para dotación de planta',
                'message' => 'Deseamos establecer un convenio directo con Booz Laboratorio para suministro regular de la línea de desinfección y cremas dérmicas.',
                'status' => 'En Gestión',
                'admin_notes' => 'Reunión virtual agendada para el lunes con Dirección de Comercialización.',
                'created_at' => now()->subHours(8),
            ],
            [
                'email' => 'gladys.hernandez@yahoo.es',
                'name' => 'Gladys de Hernández',
                'phone' => '04162233445',
                'type' => 'consulta',
                'source' => 'web',
                'subject' => 'Duda sobre lote y fecha de Centellacis',
                'message' => 'Tengo un envase de Centellacis lote 2025 y quisiera saber si aún mantiene su actividad regenerativa completa.',
                'status' => 'Resuelto',
                'admin_notes' => 'Se verificó lote oficial vigente hasta diciembre de 2027. Usuaria notificada satisfactoriamente.',
                'created_at' => now()->subHours(5),
            ],
            [
                'email' => 'efarias@unidaddermatologica.org',
                'name' => 'Dr. Enrique Farías',
                'phone' => '04145566778',
                'type' => 'lira',
                'source' => 'lira_chatbot',
                'subject' => 'Muestras médicas para servicio de dermatología',
                'message' => 'Requiero contactar con el visitador médico de Booz en la zona metropolitana de Caracas para coordinar entrega de muestras clínicas.',
                'status' => 'Contactado',
                'admin_notes' => 'Coordinación médica asignó visitador para visita presencial esta semana.',
                'created_at' => now()->subHours(2),
            ],
        ];

        foreach ($messages as $msg) {
            Message::updateOrCreate(
                ['email' => $msg['email'], 'subject' => $msg['subject']],
                $msg
            );
        }
    }
}
