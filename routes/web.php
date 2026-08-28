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

    // Product Management (CMS)
    Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::put('/admin/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::post('/admin/products/{product}/toggle', [AdminProductController::class, 'toggleActive'])->name('admin.products.toggle');
    Route::delete('/admin/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

    // Pharmacovigilance & Quality Reports Management
    Route::put('/admin/reports/{report}/status', [AdminReportController::class, 'updateStatus'])->name('admin.reports.updateStatus');

    // Contact & Lira AI Leads Management
    Route::put('/admin/messages/{message}/status', [\App\Http\Controllers\Admin\AdminMessageController::class, 'updateStatus'])->name('admin.messages.updateStatus');
});

require __DIR__.'/settings.php';
