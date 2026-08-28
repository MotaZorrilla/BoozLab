<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Product Lines Table
        Schema::create('product_lines', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 10)->unique();
            $table->text('description')->nullable();
            $table->string('badge_color', 50)->default('blue');
            $table->string('image_path', 255)->nullable();
            $table->timestamps();
        });

        // 2. Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_line_id')->constrained('product_lines')->onDelete('cascade');
            $table->string('name', 150);
            $table->string('slug', 150)->unique();
            $table->string('active_ingredients', 255);
            $table->string('presentation', 150)->default('Tubo colapsible 20g');
            $table->text('description');
            $table->text('indications');
            $table->text('posology')->nullable();
            $table->text('contraindications')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->integer('stock')->default(50);
            $table->boolean('is_prescription_required')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('image_path', 255)->default('/assets/img/product_1.png');
            $table->string('pdf_path', 255)->nullable();
            $table->timestamps();
        });

        // 3. Testimonials Table
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author_name', 120);
            $table->string('author_role', 150);
            $table->string('avatar_path', 255)->default('/assets/img/avatar_doctor.png');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. FAQs Table
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('answer');
            $table->string('category', 50)->default('general');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Pharmacovigilance Reports Table (Exigencia INH)
        Schema::create('pharmacovigilance_reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 50)->unique();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name', 150);
            $table->string('batch_number', 50)->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('reporter_name', 120);
            $table->string('reporter_type', 50)->default('Paciente'); // Paciente, Médico, Farmacéutico
            $table->string('reporter_contact', 150);
            $table->text('adverse_reaction');
            $table->string('severity', 20)->default('Leve'); // Leve, Moderada, Grave
            $table->string('status', 30)->default('Pendiente'); // Pendiente, En Revisión, Resuelto
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });

        // 6. Messages Table (Consultas, Soporte, Contacto)
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50)->default('consulta'); // consulta, reportar, contacto
            $table->string('name', 120);
            $table->string('email', 120);
            $table->string('phone', 30)->nullable();
            $table->string('subject', 150)->nullable();
            $table->text('message');
            $table->string('status', 30)->default('Pendiente'); // Pendiente, Leído, Resuelto
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('pharmacovigilance_reports');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_lines');
    }
};
