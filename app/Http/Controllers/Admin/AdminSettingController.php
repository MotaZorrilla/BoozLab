<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\SettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings', [
            'settings' => [
                'whatsapp_sales_phone' => SettingService::whatsappPhone(),
                'whatsapp_contact_phone' => SettingService::whatsappContactPhone(),
                'company_phone' => SettingService::companyPhone(),
                'whatsapp_default_message' => SettingService::whatsappDefaultMessage(),
                'whatsapp_cart_header' => SettingService::whatsappCartHeader(),
                'whatsapp_cart_footer' => SettingService::whatsappCartFooter(),
                'whatsapp_cart_customer_types' => SettingService::whatsappCartCustomerTypes(),
                'company_name' => SettingService::companyName(),
                'company_rif' => SettingService::companyRif(),
                'plant_location' => SettingService::plantLocation(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'whatsapp_sales_phone' => ['required', 'string', 'min:8', 'max:25'],
            'whatsapp_contact_phone' => ['nullable', 'string', 'min:8', 'max:25'],
            'company_phone' => ['nullable', 'string', 'min:8', 'max:25'],
            'whatsapp_default_message' => ['required', 'string', 'max:500'],
            'whatsapp_cart_header' => ['required', 'string', 'max:1000'],
            'whatsapp_cart_footer' => ['required', 'string', 'max:1000'],
            'whatsapp_cart_customer_types' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:150'],
            'company_rif' => ['required', 'string', 'max:50'],
            'plant_location' => ['required', 'string', 'max:150'],
        ]);

        // Clean phone digits for storage
        $salesDigits = preg_replace('/\D/', '', $validated['whatsapp_sales_phone']);
        $contactDigits = ! empty($validated['whatsapp_contact_phone']) ? preg_replace('/\D/', '', $validated['whatsapp_contact_phone']) : $salesDigits;
        $companyDigits = ! empty($validated['company_phone']) ? preg_replace('/\D/', '', $validated['company_phone']) : $contactDigits;

        SystemSetting::set('whatsapp_sales_phone', $salesDigits, 'string', 'whatsapp', 'WhatsApp de Ventas y Tienda Virtual');
        SystemSetting::set('whatsapp_contact_phone', $contactDigits, 'string', 'whatsapp', 'WhatsApp de Atención y Soporte General');
        SystemSetting::set('company_phone', $companyDigits, 'string', 'whatsapp', 'Central Telefónica de Planta');
        SystemSetting::set('whatsapp_default_message', $validated['whatsapp_default_message'], 'string', 'whatsapp', 'Mensaje Predeterminado WhatsApp General');
        SystemSetting::set('whatsapp_cart_header', $validated['whatsapp_cart_header'], 'text', 'whatsapp', 'Encabezado del Pedido en Bolsa de Tienda');
        SystemSetting::set('whatsapp_cart_footer', $validated['whatsapp_cart_footer'], 'text', 'whatsapp', 'Pie / Cierre del Pedido en Bolsa de Tienda');
        SystemSetting::set('whatsapp_cart_customer_types', $validated['whatsapp_cart_customer_types'], 'string', 'whatsapp', 'Perfiles de Cliente en Bolsa de Tienda');
        SystemSetting::set('company_name', $validated['company_name'], 'string', 'company', 'Razón Social Legal');
        SystemSetting::set('company_rif', $validated['company_rif'], 'string', 'company', 'RIF Oficial');
        SystemSetting::set('plant_location', $validated['plant_location'], 'string', 'company', 'Ubicación de Planta');

        return back()->with('success', 'Configuraciones actualizadas exitosamente.');
    }
}
