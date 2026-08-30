<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use App\Models\User;
use App\Services\SettingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Tests\TestCase;

class DynamicSystemSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_settings_seeded_with_default_values(): void
    {
        $this->assertEquals('584148873615', SettingService::whatsappPhone());
        $this->assertEquals('J-40906185-0', SettingService::companyRif());
        $this->assertEquals('Booz Laboratorio VGME, C.A.', SettingService::companyName());
    }

    public function test_super_admin_can_update_whatsapp_number(): void
    {
        $superAdmin = User::where('email', 'admin@boozlaboratorio.com')->first();

        $response = $this->actingAs($superAdmin)->put(route('admin.settings.update'), [
            'whatsapp_sales_phone' => '+58 (412) 999-8877',
            'whatsapp_contact_phone' => '+58 (414) 111-2233',
            'company_phone' => '+58 (281) 444-5566',
            'whatsapp_default_message' => 'Hola Booz, deseo información comercial.',
            'whatsapp_cart_header' => '*COTIZACIÓN BOOZ LAB*',
            'whatsapp_cart_footer' => '_Confirmar disponibilidad inmediata_',
            'whatsapp_cart_customer_types' => 'Paciente,Farmacia,Clínica,Distribuidor',
            'company_name' => 'Booz Laboratorio VGME, C.A.',
            'company_rif' => 'J-40906185-0',
            'plant_location' => 'Valle de Guanape, Anzoátegui',
        ]);

        $response->assertRedirect();
        $this->assertEquals('584129998877', SettingService::whatsappPhone());
        $this->assertEquals('584141112233', SettingService::whatsappContactPhone());
        $this->assertEquals('582814445566', SettingService::companyPhone());
        $this->assertEquals('Hola Booz, deseo información comercial.', SettingService::whatsappDefaultMessage());
        $this->assertEquals('*COTIZACIÓN BOOZ LAB*', SettingService::whatsappCartHeader());
        $this->assertEquals('_Confirmar disponibilidad inmediata_', SettingService::whatsappCartFooter());
        $this->assertEquals('Paciente,Farmacia,Clínica,Distribuidor', SettingService::whatsappCartCustomerTypes());
    }

    public function test_encrypted_setting_handling(): void
    {
        SystemSetting::set('gemini_api_key', 'AIzaSyFakeKeyForTesting123', 'encrypted', 'ai');

        $storedRow = SystemSetting::where('key', 'gemini_api_key')->first();
        $this->assertNotEquals('AIzaSyFakeKeyForTesting123', $storedRow->value);

        // Access via Model::get returns decrypted
        $this->assertEquals('AIzaSyFakeKeyForTesting123', SystemSetting::get('gemini_api_key'));
    }

    public function test_inertia_shares_public_settings_to_visitors(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('settings.whatsapp_sales_phone')
            ->has('settings.whatsapp_contact_phone')
            ->has('settings.company_phone')
            ->has('settings.whatsapp_default_message')
            ->has('settings.whatsapp_cart_header')
            ->has('settings.whatsapp_cart_footer')
            ->has('settings.whatsapp_cart_customer_types')
            ->has('settings.company_rif')
        );
    }
}
