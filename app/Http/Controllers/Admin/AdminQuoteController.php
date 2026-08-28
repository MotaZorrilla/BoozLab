<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Quote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminQuoteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $customerType = $request->query('customer_type');
        $channel = $request->query('channel');

        $query = Quote::query()->latest();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('quote_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_contact', 'like', "%{$search}%")
                    ->orWhere('admin_notes', 'like', "%{$search}%");
            });
        }

        if (!empty($status) && $status !== 'Todos') {
            $query->where('status', $status);
        }

        if (!empty($customerType) && $customerType !== 'Todos') {
            $query->where('customer_type', $customerType);
        }

        if (!empty($channel) && $channel !== 'Todos') {
            $query->where('channel', $channel);
        }

        $quotesPaginated = $query->paginate(15)->withQueryString();

        // Extraer todos los IDs de productos del payload para pre-cargarlos
        $productIds = collect($quotesPaginated->items())
            ->flatMap(function ($quote) {
                return collect($quote->items_payload)->pluck('product_id');
            })
            ->unique()
            ->filter();

        $productsById = Product::whereIn('id', $productIds)
            ->get(['id', 'name', 'presentation', 'price', 'stock'])
            ->keyBy('id');

        $quotesPaginated->through(function ($quote) use ($productsById) {
            $formattedItems = collect($quote->items_payload ?? [])->map(function ($item, $idx) use ($quote, $productsById) {
                $p = $productsById->get($item['product_id'] ?? null);
                return [
                    'id' => $idx + 1,
                    'quote_id' => $quote->id,
                    'product_id' => $item['product_id'] ?? 0,
                    'quantity' => (int) ($item['quantity'] ?? 1),
                    'unit_price' => $p ? (float) $p->price : 0.0,
                    'product' => $p ? [
                        'name' => $p->name,
                        'presentation' => $p->presentation,
                        'price' => (float) $p->price,
                        'stock' => (int) $p->stock,
                    ] : null,
                ];
            })->values()->toArray();

            return [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'customer_name' => $quote->customer_name,
                'customer_contact' => $quote->customer_contact,
                'customer_type' => $quote->customer_type,
                'channel' => $quote->channel ?? 'whatsapp',
                'total_items' => (int) $quote->total_items,
                'total_amount' => (float) ($quote->total_amount ?? 0),
                'status' => $quote->status,
                'admin_notes' => $quote->admin_notes,
                'downloaded_at' => $quote->downloaded_at?->format('d/m/Y H:i'),
                'is_downloaded' => !is_null($quote->downloaded_at),
                'created_at' => $quote->created_at?->format('d/m/Y H:i') ?? '',
                'items' => $formattedItems,
            ];
        });

        // Métricas y estadísticas completas de la tienda
        $totalQuotes = Quote::count();
        $pendingQuotes = Quote::where('status', 'Pendiente')->count();
        $dispatchedQuotes = Quote::where('status', 'Despachado')->count();
        $totalAmountSum = (float) Quote::sum('total_amount');
        $totalUnitsDemanded = (int) Product::sum('quote_inquiries_count');

        // Desglose de conversión por canal
        $channelStats = [
            'whatsapp' => Quote::where('channel', 'whatsapp')->count(),
            'web_cart' => Quote::where('channel', 'web_cart')->count(),
            'manual' => Quote::where('channel', 'manual')->count(),
        ];

        // Desglose por tipo de cliente
        $customerTypeStats = [
            'Paciente' => Quote::where('customer_type', 'Paciente')->count(),
            'Farmacia' => Quote::where('customer_type', 'Farmacia')->count(),
            'Clínica' => Quote::where('customer_type', 'Clínica')->count(),
            'Distribuidor' => Quote::where('customer_type', 'Distribuidor')->count(),
        ];

        // Listado de todos los productos para la carga manual y ajuste rápido de inventario
        $allProducts = Product::orderBy('name')
            ->get(['id', 'name', 'presentation', 'price', 'stock', 'quote_inquiries_count', 'is_active'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'presentation' => $p->presentation,
                'price' => (float) $p->price,
                'stock' => (int) $p->stock,
                'quote_inquiries_count' => (int) $p->quote_inquiries_count,
                'is_active' => (bool) $p->is_active,
            ]);

        $topQuotedProducts = Product::orderByDesc('quote_inquiries_count')
            ->take(10)
            ->get(['id', 'name', 'slug', 'quote_inquiries_count', 'price', 'stock'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'quote_inquiries_count' => (int) $p->quote_inquiries_count,
                'price' => (float) $p->price,
                'stock' => (int) $p->stock,
            ]);

        return Inertia::render('admin/quotes', [
            'quotes' => $quotesPaginated,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'Todos',
                'customer_type' => $customerType ?? 'Todos',
                'channel' => $channel ?? 'Todos',
            ],
            'stats' => [
                'total_quotes' => $totalQuotes,
                'pending_quotes' => $pendingQuotes,
                'dispatched_quotes' => $dispatchedQuotes,
                'total_amount_sum' => $totalAmountSum,
                'total_units_demanded' => $totalUnitsDemanded,
                'channel_stats' => $channelStats,
                'customer_type_stats' => $customerTypeStats,
            ],
            'allProducts' => $allProducts,
            'topProducts' => $topQuotedProducts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:150'],
            'customer_contact' => ['nullable', 'string', 'max:150'],
            'customer_type' => ['required', 'in:Paciente,Farmacia,Clínica,Distribuidor'],
            'status' => ['nullable', 'in:Pendiente,Contactado,Despachado,Cancelado'],
            'admin_notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:10000'],
        ]);

        DB::transaction(function () use ($validated) {
            $year = date('Y');
            $lastQuote = Quote::whereYear('created_at', $year)->lockForUpdate()->latest('id')->first();
            $nextSeq = $lastQuote ? ((int) substr($lastQuote->quote_number, strrpos($lastQuote->quote_number, '-') + 1)) + 1 : 1;
            $quoteNumber = sprintf('BOOZ-COT-%s-%04d', $year, $nextSeq);

            $productIds = collect($validated['items'])->pluck('product_id');
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $totalAmount = 0.0;
            foreach ($validated['items'] as $item) {
                $p = $products->get($item['product_id']);
                if ($p) {
                    $totalAmount += ((float) $p->price) * $item['quantity'];
                }
            }

            Quote::create([
                'quote_number' => $quoteNumber,
                'customer_name' => $validated['customer_name'],
                'customer_contact' => $validated['customer_contact'] ?? null,
                'customer_type' => $validated['customer_type'],
                'channel' => 'manual',
                'items_payload' => $validated['items'],
                'total_items' => array_sum(array_column($validated['items'], 'quantity')),
                'total_amount' => $totalAmount,
                'status' => $validated['status'] ?? 'Pendiente',
                'admin_notes' => $validated['admin_notes'] ?? null,
            ]);

            // Incrementar métricas de demanda
            foreach ($validated['items'] as $item) {
                Product::where('id', $item['product_id'])->increment('quote_inquiries_count', $item['quantity']);
            }
        });

        return back()->with('success', 'Cotización manual registrada exitosamente en la tienda.');
    }

    public function update(Request $request, Quote $quote): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:Pendiente,Contactado,Despachado,Cancelado'],
            'admin_notes' => ['nullable', 'string'],
            'mark_downloaded' => ['nullable', 'boolean'],
        ]);

        $updateData = [
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? null,
        ];

        if (!empty($validated['mark_downloaded']) && !$quote->downloaded_at) {
            $updateData['downloaded_at'] = now();
        }

        $quote->update($updateData);

        return back()->with('success', 'Cotización actualizada correctamente.');
    }

    public function destroy(Quote $quote): RedirectResponse
    {
        $quote->delete();

        return back()->with('success', 'Cotización eliminada del registro.');
    }

    public function updateStock(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'stock' => ['required', 'integer', 'min:0', 'max:50000'],
        ]);

        Product::where('id', $validated['product_id'])->update([
            'stock' => $validated['stock'],
        ]);

        return back()->with('success', 'Unidades disponibles actualizadas exitosamente.');
    }

    public function exportCsv(): StreamedResponse
    {
        $quotes = Quote::latest()->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="cotizaciones_tienda_booz_'.date('Ymd_His').'.csv"',
        ];

        $callback = function () use ($quotes) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // UTF-8 BOM

            fputcsv($file, [
                'ID',
                'Nro Cotización',
                'Cliente',
                'Teléfono/Contacto',
                'Tipo de Cliente',
                'Canal de Origen',
                'Unidades Totales',
                'Monto Total USD',
                'Estado',
                'Descargado',
                'Fecha Descarga',
                'Notas Administrativas',
                'Fecha Registro',
            ]);

            foreach ($quotes as $q) {
                fputcsv($file, [
                    $q->id,
                    $q->quote_number,
                    $q->customer_name,
                    $q->customer_contact,
                    $q->customer_type,
                    $q->channel ?? 'whatsapp',
                    $q->total_items,
                    number_format((float) $q->total_amount, 2, '.', ''),
                    $q->status,
                    $q->downloaded_at ? 'Sí' : 'No',
                    $q->downloaded_at?->format('d/m/Y H:i') ?? 'N/A',
                    $q->admin_notes,
                    $q->created_at?->format('d/m/Y H:i'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function print(Quote $quote): Response
    {
        $quote->update(['downloaded_at' => now()]);

        $productIds = collect($quote->items_payload)->pluck('product_id')->unique();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $formattedItems = collect($quote->items_payload)->map(function ($item) use ($products) {
            $p = $products->get($item['product_id']);
            return [
                'name' => $p?->name ?? 'Fármaco Booz',
                'presentation' => $p?->presentation ?? '',
                'active_ingredients' => $p?->active_ingredients ?? '',
                'quantity' => (int) ($item['quantity'] ?? 1),
                'price' => (float) ($p?->price ?? 0),
                'subtotal' => ((float) ($p?->price ?? 0)) * ((int) ($item['quantity'] ?? 1)),
            ];
        });

        return Inertia::render('admin/quote-voucher', [
            'quote' => [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'customer_name' => $quote->customer_name,
                'customer_contact' => $quote->customer_contact,
                'customer_type' => $quote->customer_type,
                'channel' => $quote->channel,
                'total_items' => $quote->total_items,
                'total_amount' => (float) $quote->total_amount,
                'status' => $quote->status,
                'admin_notes' => $quote->admin_notes,
                'created_at' => $quote->created_at?->format('d/m/Y H:i'),
                'items' => $formattedItems,
            ],
        ]);
    }
}
