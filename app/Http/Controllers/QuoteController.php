<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuoteController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['nullable', 'string', 'max:150'],
            'customer_contact' => ['nullable', 'string', 'max:150'],
            'customer_type' => ['nullable', 'in:Paciente,Farmacia,Clínica,Distribuidor'],
            'channel' => ['nullable', 'in:whatsapp,web_cart,manual'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
        ]);

        $quote = DB::transaction(function () use ($validated) {
            $year = date('Y');
            $lastQuote = Quote::whereYear('created_at', $year)->lockForUpdate()->latest('id')->first();
            $nextSeq = $lastQuote ? ((int) substr($lastQuote->quote_number, strrpos($lastQuote->quote_number, '-') + 1)) + 1 : 1;
            $quoteNumber = sprintf('BOOZ-COT-%s-%04d', $year, $nextSeq);

            $productIds = collect($validated['items'])->pluck('product_id');
            $products = \App\Models\Product::whereIn('id', $productIds)->get()->keyBy('id');

            $totalAmount = 0.0;
            foreach ($validated['items'] as $item) {
                $p = $products->get($item['product_id']);
                if ($p) {
                    $totalAmount += ((float) $p->price) * $item['quantity'];
                }
            }

            $createdQuote = Quote::create([
                'quote_number' => $quoteNumber,
                'customer_name' => $validated['customer_name'] ?? 'Cliente Web',
                'customer_contact' => $validated['customer_contact'] ?? null,
                'customer_type' => $validated['customer_type'] ?? 'Paciente',
                'channel' => $validated['channel'] ?? 'whatsapp',
                'items_payload' => $validated['items'],
                'total_items' => array_sum(array_column($validated['items'], 'quantity')),
                'total_amount' => $totalAmount,
                'status' => 'Pendiente',
            ]);

            // Incrementar métricas de demanda por producto
            foreach ($validated['items'] as $item) {
                \App\Models\Product::where('id', $item['product_id'])->increment('quote_inquiries_count', $item['quantity']);
            }

            return $createdQuote;
        });

        return response()->json([
            'status' => 'success',
            'quote_number' => $quote->quote_number,
            'message' => 'Cotización registrada formalmente en Booz Laboratorio.',
        ], 201);
    }
}
