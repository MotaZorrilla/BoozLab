<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('quote_number', 50)->unique();
            $table->string('customer_name', 150)->nullable();
            $table->string('customer_contact', 150)->nullable();
            $table->string('customer_type', 50)->default('Paciente'); // Paciente, Farmacia, Clínica, Distribuidor
            $table->json('items_payload'); // Snapshot de productos y cantidades
            $table->integer('total_items')->default(1);
            $table->string('status', 30)->default('Pendiente'); // Pendiente, Contactado, Despachado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
