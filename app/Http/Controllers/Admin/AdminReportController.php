<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PharmacovigilanceReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
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
}
