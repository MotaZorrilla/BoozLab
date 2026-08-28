<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePharmacovigilanceRequest;
use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PharmacovigilanceController extends Controller
{
    /**
     * Display the official Pharmacovigilance reporting form.
     */
    public function create(): Response
    {
        $products = Product::active()->select('id', 'name', 'presentation')->get();

        return Inertia::render('farmacovigilancia', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created pharmacovigilance / quality report in storage.
     */
    public function store(StorePharmacovigilanceRequest $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validated();

        $report = retry(5, function () use ($validated) {
            return DB::transaction(function () use ($validated) {
                $ticketNumber = PharmacovigilanceReport::generateTicketNumber();

                return PharmacovigilanceReport::create([
                    'ticket_number' => $ticketNumber,
                    'product_id' => $validated['product_id'] ?? null,
                    'product_name' => $validated['product_name'],
                    'batch_number' => $validated['batch_number'] ?? null,
                    'expiry_date' => $validated['expiry_date'] ?? null,
                    'reporter_name' => $validated['reporter_name'],
                    'reporter_type' => $validated['reporter_type'],
                    'reporter_contact' => $validated['reporter_contact'],
                    'adverse_reaction' => $validated['adverse_reaction'],
                    'severity' => $validated['severity'],
                    'status' => 'Pendiente',
                ]);
            });
        }, 50);

        // Despacho seguro de alertas administrativas
        try {
            $adminEmail = config('mail.from.address', 'admin@boozlaboratorio.com');
            \Illuminate\Support\Facades\Mail::to($adminEmail)->send(new \App\Mail\NewPharmacovigilanceAlert($report));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('No se pudo enviar correo de alerta de farmacovigilancia: '.$e->getMessage());
        }

        if ($webhookUrl = env('ADMIN_ALERT_WEBHOOK_URL')) {
            try {
                \Illuminate\Support\Facades\Http::timeout(3)->post($webhookUrl, [
                    'event' => 'pharmacovigilance_report',
                    'ticket' => $report->ticket_number,
                    'product' => $report->product_name,
                    'severity' => $report->severity,
                    'reporter' => $report->reporter_name,
                    'reaction' => $report->adverse_reaction,
                ]);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Webhook farmacovigilancia falló: '.$e->getMessage());
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'ticket_number' => $report->ticket_number,
                'message' => 'Reporte registrado exitosamente bajo el código '.$report->ticket_number,
            ], 201);
        }

        return redirect()->back()->with('success', 'Reporte registrado con éxito. Su número de ticket es: '.$report->ticket_number);
    }
}
