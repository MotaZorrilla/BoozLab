<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Store a contact / consultation / sales message from the public site or Lira Assistant.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:consulta,reportar,contacto,lira',
            'source' => 'nullable|string|max:50',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:120',
            'phone' => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:150',
            'message' => 'required|string|min:3|max:5000',
        ]);

        $source = $validated['source'] ?? ($validated['type'] === 'lira' ? 'lira_chatbot' : 'web');

        $message = Message::create([
            'type' => $validated['type'],
            'source' => $source,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'] ?? ($validated['type'] === 'lira' ? 'Contacto solicitado vía Lira Asistente' : null),
            'message' => $validated['message'],
            'status' => 'Pendiente',
        ]);

        // Despacho seguro de alertas administrativas
        try {
            $adminEmail = config('mail.from.address', 'admin@boozlaboratorio.com');
            \Illuminate\Support\Facades\Mail::to($adminEmail)->send(new \App\Mail\NewMessageLeadAlert($message));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('No se pudo enviar correo de alerta de mensaje: '.$e->getMessage());
        }

        if ($webhookUrl = env('ADMIN_ALERT_WEBHOOK_URL')) {
            try {
                \Illuminate\Support\Facades\Http::timeout(3)->post($webhookUrl, [
                    'event' => 'new_message_lead',
                    'id' => $message->id,
                    'source' => $message->source,
                    'name' => $message->name,
                    'phone' => $message->phone,
                    'email' => $message->email,
                    'message' => $message->message,
                ]);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Webhook mensaje falló: '.$e->getMessage());
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Mensaje recibido correctamente. Nuestro equipo se comunicará a la brevedad.',
            'id' => $message->id,
            'source' => $source,
        ], 201);
    }
}
