<?php

namespace App\Http\Controllers;

use App\Models\PharmacovigilanceReport;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PharmacovigilanceController extends Controller
{
    /**
     * Display the official Pharmacovigilance reporting form.
     */
    public function create(): Response
    {
        $products = Product::where('is_active', true)->select('id', 'name', 'presentation')->get();

        return Inertia::render('farmacovigilancia', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created pharmacovigilance / quality report in storage.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'product_name' => 'required|string|max:150',
            'batch_number' => 'nullable|string|max:50',
            'expiry_date' => 'nullable|date',
            'reporter_name' => 'required|string|max:120',
            'reporter_type' => 'required|in:Paciente,Médico,Farmacéutico,Distribuidor',
            'reporter_contact' => 'required|string|max:150',
            'adverse_reaction' => 'required|string|min:10',
            'severity' => 'required|in:Leve,Moderada,Grave',
        ]);

        $ticketNumber = PharmacovigilanceReport::generateTicketNumber();

        $report = PharmacovigilanceReport::create([
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
