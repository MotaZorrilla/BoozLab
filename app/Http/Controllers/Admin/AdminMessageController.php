<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminMessageController extends Controller
{
    /**
     * Display the messages and leads management view.
     */
    public function index(): \Inertia\Response
    {
        $messages = Message::orderByDesc('created_at')->get();

        return \Inertia\Inertia::render('admin/messages', [
            'messages' => $messages,
        ]);
    }

    /**
     * Update the status and administrative follow-up notes for a message / Lira lead.
     */
    public function updateStatus(Request $request, Message $message): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Pendiente,En Gestión,Contactado,Resuelto',
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $message->update($validated);

        return redirect()->back()->with('success', 'Estado y dictamen del mensaje actualizados correctamente.');
    }

    /**
     * Export all messages and Lira leads to CSV with Excel compatibility.
     */
    public function exportCsv(): StreamedResponse
    {
        $fileName = 'booz_mensajes_leads_'.date('Ymd_His').'.csv';
        $messages = Message::orderByDesc('created_at')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($messages) {
            $handle = fopen('php://output', 'w');
            // UTF-8 BOM for Microsoft Excel
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'ID',
                'Origen',
                'Tipo',
                'Nombre y Apellido',
                'Correo Electrónico',
                'Teléfono / WhatsApp',
                'Asunto',
                'Mensaje / Consulta',
                'Estado de Gestión',
                'Notas y Dictamen Administrativo',
                'Fecha de Registro',
            ], ';');

            foreach ($messages as $m) {
                $origen = ($m->source === 'lira_chatbot' || $m->type === 'lira') ? 'Lira Asistente Virtual' : 'Formulario Web';
                fputcsv($handle, [
                    $m->id,
                    $origen,
                    $m->type,
                    $m->name,
                    $m->email,
                    $m->phone ?? 'N/A',
                    $m->subject ?? 'General',
                    $m->message,
                    $m->status,
                    $m->admin_notes ?? 'Sin seguimiento aún',
                    $m->created_at->format('Y-m-d H:i:s'),
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }
}
