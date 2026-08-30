<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PharmacovigilanceController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Public Routes ---
Route::get('/', [ProductController::class, 'home'])->name('home');
Route::get('/producto/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/productos/{slug}', [ProductController::class, 'show'])->name('product.show.plural');
Route::get('/producto/{slug}/vademecum', [ProductController::class, 'printVademecum'])->name('product.vademecum');
Route::get('/productos/{slug}/vademecum', [ProductController::class, 'printVademecum'])->name('product.vademecum.plural');
Route::get('/farmacovigilancia', [PharmacovigilanceController::class, 'create'])->name('farmacovigilancia.create');

// API & AJAX Endpoints
Route::post('/api/farmacovigilancia', [PharmacovigilanceController::class, 'store'])->middleware('throttle:5,1')->name('farmacovigilancia.store');
Route::post('/api/chatbot', [ChatbotController::class, 'query'])->middleware('throttle:30,1')->name('chatbot.query');
Route::post('/api/messages', [MessageController::class, 'store'])->middleware('throttle:10,1')->name('api.messages.store');
Route::post('/api/quotes', [\App\Http\Controllers\QuoteController::class, 'store'])->middleware('throttle:30,1')->name('api.quotes.store');
Route::get('/api/search', [ProductController::class, 'search'])->middleware('throttle:60,1')->name('api.search');

// Auxiliary Knowledge & Tools Pages
Route::get('/herramientas', function () {
    return Inertia::render('tools');
})->name('tools');

Route::get('/glosario', function () {
    return Inertia::render('glossary');
})->name('glossary');

Route::get('/casos-clinicos', function () {
    return Inertia::render('cases');
})->name('cases');

Route::get('/blog', function () {
    return Inertia::render('blog/index');
})->name('blog.index');

Route::get('/blog/{slug}', function ($slug) {
    return Inertia::render('blog/show', ['slug' => $slug]);
})->name('blog.show');

// --- Protected Admin Routes ---
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // 1. Catalog Management
    Route::middleware('permission:products.view')->group(function () {
        Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products.index');
        Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
        Route::post('/admin/products/upload-image', [AdminProductController::class, 'uploadImage'])->name('admin.products.uploadImage');
        Route::put('/admin/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
        Route::post('/admin/products/{product}/toggle', [AdminProductController::class, 'toggleActive'])->name('admin.products.toggle');
        Route::delete('/admin/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');
    });

    // 2. Pharmacovigilance & Quality Reports Management
    Route::middleware('permission:reports.view')->group(function () {
        Route::get('/admin/reports', [AdminReportController::class, 'index'])->name('admin.reports.index');
        Route::get('/admin/reports/export-csv', [AdminReportController::class, 'exportCsv'])->name('admin.reports.exportCsv');
        Route::get('/admin/reports/{report}/print', [AdminReportController::class, 'print'])->name('admin.reports.print');
        Route::put('/admin/reports/{report}/status', [AdminReportController::class, 'updateStatus'])->name('admin.reports.updateStatus');
    });

    // 3. Contact & Lira AI Leads Management
    Route::middleware('permission:messages.view')->group(function () {
        Route::get('/admin/messages', [\App\Http\Controllers\Admin\AdminMessageController::class, 'index'])->name('admin.messages.index');
        Route::get('/admin/messages/export-csv', [\App\Http\Controllers\Admin\AdminMessageController::class, 'exportCsv'])->name('admin.messages.exportCsv');
        Route::put('/admin/messages/{message}/status', [\App\Http\Controllers\Admin\AdminMessageController::class, 'updateStatus'])->name('admin.messages.updateStatus');
    });

    // 4. Quotes & Demand Analytics (Administrador de Tienda Virtual)
    Route::middleware('permission:quotes.view')->group(function () {
        Route::get('/admin/quotes', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'index'])->name('admin.quotes.index');
        Route::post('/admin/quotes', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'store'])->name('admin.quotes.store');
        Route::put('/admin/quotes/{quote}', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'update'])->name('admin.quotes.update');
        Route::delete('/admin/quotes/{quote}', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'destroy'])->name('admin.quotes.destroy');
        Route::get('/admin/quotes/export-csv', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'exportCsv'])->name('admin.quotes.exportCsv');
        Route::get('/admin/quotes/{quote}/print', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'print'])->name('admin.quotes.print');
        Route::post('/admin/quotes/update-stock', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'updateStock'])->name('admin.quotes.updateStock');
    });

    // 5. System Settings, Users & AI Console (Super Admin Only)
    Route::middleware('role:super_admin')->group(function () {
        // Settings & WhatsApp
        Route::get('/admin/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'index'])->name('admin.settings.index');
        Route::put('/admin/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'update'])->name('admin.settings.update');

        // User Management & RBAC
        Route::get('/admin/users', [\App\Http\Controllers\Admin\AdminUserController::class, 'index'])->name('admin.users.index');
        Route::post('/admin/users', [\App\Http\Controllers\Admin\AdminUserController::class, 'store'])->name('admin.users.store');
        Route::put('/admin/users/{user}', [\App\Http\Controllers\Admin\AdminUserController::class, 'update'])->name('admin.users.update');
        Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\AdminUserController::class, 'destroy'])->name('admin.users.destroy');

        // Artificial Intelligence & Lira Console
        Route::get('/admin/ai', [\App\Http\Controllers\Admin\AdminAiController::class, 'index'])->name('admin.ai.index');
        Route::put('/admin/ai', [\App\Http\Controllers\Admin\AdminAiController::class, 'update'])->name('admin.ai.update');
        Route::post('/admin/ai/test', [\App\Http\Controllers\Admin\AdminAiController::class, 'test'])->name('admin.ai.test');

        // Base de Conocimiento Documental de Lira AI
        Route::post('/admin/ai/documents', [\App\Http\Controllers\Admin\AdminAiController::class, 'storeDocument'])->name('admin.ai.documents.store');
        Route::put('/admin/ai/documents/{document}', [\App\Http\Controllers\Admin\AdminAiController::class, 'updateDocument'])->name('admin.ai.documents.update');
        Route::post('/admin/ai/documents/{document}/toggle', [\App\Http\Controllers\Admin\AdminAiController::class, 'toggleDocument'])->name('admin.ai.documents.toggle');
        Route::delete('/admin/ai/documents/{document}', [\App\Http\Controllers\Admin\AdminAiController::class, 'destroyDocument'])->name('admin.ai.documents.destroy');

        // Guardrails Sanitarios y Reglas de Contención
        Route::post('/admin/ai/guardrails', [\App\Http\Controllers\Admin\AdminAiController::class, 'storeGuardrail'])->name('admin.ai.guardrails.store');
        Route::put('/admin/ai/guardrails/{guardrail}', [\App\Http\Controllers\Admin\AdminAiController::class, 'updateGuardrail'])->name('admin.ai.guardrails.update');
        Route::post('/admin/ai/guardrails/{guardrail}/toggle', [\App\Http\Controllers\Admin\AdminAiController::class, 'toggleGuardrail'])->name('admin.ai.guardrails.toggle');
        Route::delete('/admin/ai/guardrails/{guardrail}', [\App\Http\Controllers\Admin\AdminAiController::class, 'destroyGuardrail'])->name('admin.ai.guardrails.destroy');
    });
});

require __DIR__.'/settings.php';
