<?php

namespace App\Services;

use App\Models\SystemSetting;

class SettingService
{
    public const DEFAULT_WHATSAPP_PHONE = '584148873615';

    public const DEFAULT_WHATSAPP_CONTACT_PHONE = '584148873615';

    public const DEFAULT_COMPANY_PHONE = '584148873615';

    public const DEFAULT_WHATSAPP_MESSAGE = 'Hola Booz Laboratorio, deseo cotizar productos farmacéuticos.';

    public const DEFAULT_WHATSAPP_CART_HEADER = "*HOLA BOOZ LABORATORIO* 🔬\nDeseo solicitar cotización y disponibilidad para el siguiente pedido:";

    public const DEFAULT_WHATSAPP_CART_FOOTER = '_Por favor confirmar disponibilidad en planta / droguería y tiempos de entrega oficial._';

    public const DEFAULT_WHATSAPP_CART_CUSTOMER_TYPES = 'Paciente,Farmacia,Clínica,Distribuidor';

    public const DEFAULT_COMPANY_RIF = 'J-40906185-0';

    public const DEFAULT_COMPANY_NAME = 'Booz Laboratorio VGME, C.A.';

    public const DEFAULT_PLANT_LOCATION = 'Valle de Guanape, Edo. Anzoátegui';

    public const DEFAULT_OFFICE_LOCATION = 'Puerto Ordaz, Edo. Bolívar';

    public const DEFAULT_COMPANY_INSTAGRAM = '@booz.laboratorio';

    public const DEFAULT_LEGAL_DISCLAIMER = '⚠️ Aviso Ético y Sanitario: Booz Laboratorio no promueve la automedicación. Esta respuesta tiene fines estrictamente informativos y educativos. Consulta siempre a tu médico o farmacéutico tratante antes de iniciar cualquier tratamiento farmacológico.';

    public const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

    public static function whatsappPhone(): string
    {
        return SystemSetting::get('whatsapp_sales_phone', self::DEFAULT_WHATSAPP_PHONE);
    }

    public static function whatsappContactPhone(): string
    {
        return SystemSetting::get('whatsapp_contact_phone', self::whatsappPhone());
    }

    public static function companyPhone(): string
    {
        return SystemSetting::get('company_phone', self::whatsappContactPhone());
    }

    public static function whatsappDefaultMessage(): string
    {
        return SystemSetting::get('whatsapp_default_message', self::DEFAULT_WHATSAPP_MESSAGE);
    }

    public static function whatsappCartHeader(): string
    {
        return SystemSetting::get('whatsapp_cart_header', self::DEFAULT_WHATSAPP_CART_HEADER);
    }

    public static function whatsappCartFooter(): string
    {
        return SystemSetting::get('whatsapp_cart_footer', self::DEFAULT_WHATSAPP_CART_FOOTER);
    }

    public static function whatsappCartCustomerTypes(): string
    {
        return SystemSetting::get('whatsapp_cart_customer_types', self::DEFAULT_WHATSAPP_CART_CUSTOMER_TYPES);
    }

    public static function companyRif(): string
    {
        return SystemSetting::get('company_rif', self::DEFAULT_COMPANY_RIF);
    }

    public static function companyName(): string
    {
        return SystemSetting::get('company_name', self::DEFAULT_COMPANY_NAME);
    }

    public static function plantLocation(): string
    {
        return SystemSetting::get('plant_location', self::DEFAULT_PLANT_LOCATION);
    }

    public static function officeLocation(): string
    {
        return SystemSetting::get('office_location', self::DEFAULT_OFFICE_LOCATION);
    }

    public static function companyInstagram(): string
    {
        return SystemSetting::get('company_instagram', self::DEFAULT_COMPANY_INSTAGRAM);
    }

    public static function legalDisclaimer(): string
    {
        return SystemSetting::get('legal_disclaimer', self::DEFAULT_LEGAL_DISCLAIMER);
    }

    public static function geminiKey(): ?string
    {
        $key = SystemSetting::get('gemini_api_key');
        if (! empty($key)) {
            return $key;
        }

        return config('services.gemini.key');
    }

    public static function geminiModel(): string
    {
        return SystemSetting::get('gemini_model', self::DEFAULT_GEMINI_MODEL);
    }

    public static function liraSystemPrompt(): ?string
    {
        return SystemSetting::get('lira_system_prompt');
    }

    /**
     * Returns an associative array of settings safe to expose in client frontend.
     */
    public static function publicSettings(): array
    {
        return [
            'whatsapp_sales_phone' => self::whatsappPhone(),
            'whatsapp_contact_phone' => self::whatsappContactPhone(),
            'company_phone' => self::companyPhone(),
            'whatsapp_default_message' => self::whatsappDefaultMessage(),
            'whatsapp_cart_header' => self::whatsappCartHeader(),
            'whatsapp_cart_footer' => self::whatsappCartFooter(),
            'whatsapp_cart_customer_types' => self::whatsappCartCustomerTypes(),
            'company_name' => self::companyName(),
            'company_rif' => self::companyRif(),
            'company_instagram' => self::companyInstagram(),
            'plant_location' => self::plantLocation(),
            'office_location' => self::officeLocation(),
            'legal_disclaimer' => self::legalDisclaimer(),
        ];
    }
}
