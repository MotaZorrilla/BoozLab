<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'whatsapp_sales_phone',
                'value' => '584148873615',
                'type' => 'string',
                'group' => 'whatsapp',
                'description' => 'Número oficial de WhatsApp para atención y cotizaciones comerciales.',
            ],
            [
                'key' => 'whatsapp_default_message',
                'value' => 'Hola Booz Laboratorio, deseo cotizar productos farmacéuticos.',
                'type' => 'string',
                'group' => 'whatsapp',
                'description' => 'Mensaje predeterminado al abrir WhatsApp desde la plataforma web.',
            ],
            [
                'key' => 'company_name',
                'value' => 'Booz Laboratorio VGME, C.A.',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Razón social legal del laboratorio farmacéutico.',
            ],
            [
                'key' => 'company_rif',
                'value' => 'J-40906185-0',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Registro de Información Fiscal (RIF) de Booz Laboratorio.',
            ],
            [
                'key' => 'plant_location',
                'value' => 'Valle de Guanape, Edo. Anzoátegui',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Ubicación oficial de la planta farmacéutica de producción.',
            ],
            [
                'key' => 'gemini_model',
                'value' => 'gemini-2.5-flash',
                'type' => 'string',
                'group' => 'ai',
                'description' => 'Modelo de Google Gemini utilizado por el asistente virtual Lira.',
            ],
            [
                'key' => 'lira_system_prompt',
                'value' => 'Eres Lira, la asistente clínica y científica oficial de Booz Laboratorio VGME, C.A. (RIF J-40906185-0), laboratorio farmacéutico con planta de manufactura en Valle de Guanape, Estado Anzoátegui, Venezuela. Tu misión es brindar orientación clara, empática y profesional sobre nuestro catálogo de 18 productos farmacéuticos y dermocosméticos distribuidos en 4 líneas terapéuticas.',
                'type' => 'text',
                'group' => 'ai',
                'description' => 'Directriz y personalidad configurable del asistente virtual Lira.',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'group' => $setting['group'],
                    'description' => $setting['description'],
                ]
            );
        }
    }
}
