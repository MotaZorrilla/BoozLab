<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminMessageController extends Controller
{
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
}
