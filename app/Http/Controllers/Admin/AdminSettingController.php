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
                'whatsapp_default_message' => SettingService::whatsappDefaultMessage(),
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
            'whatsapp_default_message' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:150'],
            'company_rif' => ['required', 'string', 'max:50'],
            'plant_location' => ['required', 'string', 'max:150'],
        ]);

        // Clean phone digits for storage
        $phoneDigits = preg_replace('/\D/', '', $validated['whatsapp_sales_phone']);

        SystemSetting::set('whatsapp_sales_phone', $phoneDigits, 'string', 'whatsapp', 'WhatsApp Comercial Oficial');
        SystemSetting::set('whatsapp_default_message', $validated['whatsapp_default_message'], 'string', 'whatsapp', 'Mensaje Predeterminado WhatsApp');
        SystemSetting::set('company_name', $validated['company_name'], 'string', 'company', 'Razón Social Legal');
        SystemSetting::set('company_rif', $validated['company_rif'], 'string', 'company', 'RIF Oficial');
        SystemSetting::set('plant_location', $validated['plant_location'], 'string', 'company', 'Ubicación de Planta');

        return back()->with('success', 'Configuraciones actualizadas exitosamente.');
    }
}
