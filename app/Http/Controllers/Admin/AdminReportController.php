<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PharmacovigilanceReport;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    /**
     * Display the pharmacovigilance reports management view.
     */
    public function index(): \Inertia\Response
    {
        $reports = PharmacovigilanceReport::orderByDesc('created_at')->get();

        return \Inertia\Inertia::render('admin/reports', [
            'reports' => $reports,
        ]);
    }

    /**
     * Update the status and administrative notes for a pharmacovigilance report.
     */
    public function updateStatus(Request $request, PharmacovigilanceReport $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Pendiente,En Revisión,Resuelto',
            'admin_notes' => 'nullable|string',
        ]);

        $report->update($validated);

        return redirect()->back()->with('success', 'Estado del reporte actualizado.');
    }

    /**
     * Export all pharmacovigilance reports to CSV with Excel compatibility.
     */
    public function exportCsv(): StreamedResponse
    {
        $fileName = 'booz_farmacovigilancia_'.date('Ymd_His').'.csv';
        $reports = PharmacovigilanceReport::orderByDesc('created_at')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($reports) {
            $handle = fopen('php://output', 'w');
            // UTF-8 BOM for Microsoft Excel
            fputs($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Nro Ticket INH',
                'Producto',
                'Nro Lote',
                'Fecha Vencimiento',
                'Severidad',
                'Nombre Reportante',
                'Tipo Reportante',
                'Contacto',
                'Evento Adverso / Reacción',
                'Estado Sanitario',
                'Dictamen / Notas Técnicas',
                'Fecha y Hora Registro',
            ], ';');

            foreach ($reports as $r) {
                fputcsv($handle, [
                    $r->ticket_number,
                    $r->product_name,
                    $r->batch_number ?? 'N/A',
                    $r->expiry_date ?? 'N/A',
                    $r->severity,
                    $r->reporter_name,
                    $r->reporter_type,
                    $r->reporter_contact,
                    $r->adverse_reaction,
                    $r->status,
                    $r->admin_notes ?? 'Sin dictamen aún',
                    $r->created_at->format('Y-m-d H:i:s'),
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Display printable official clinical record for INH sanitarily compliant audit.
     */
    public function print(PharmacovigilanceReport $report): View
    {
        return view('reports.acta-sanitaria', compact('report'));
    }
}
