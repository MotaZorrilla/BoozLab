<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Store a contact / consultation / sales message from the public site.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:consulta,reportar,contacto',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:120',
            'phone' => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:150',
            'message' => 'required|string|min:5|max:5000',
        ]);

        $message = Message::create([
            'type' => $validated['type'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'],
            'status' => 'Pendiente',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mensaje recibido correctamente. Nuestro equipo se comunicará a la brevedad.',
            'id' => $message->id,
        ], 201);
    }
}
