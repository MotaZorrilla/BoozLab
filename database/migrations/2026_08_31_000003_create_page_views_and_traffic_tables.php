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
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->date('date')->index();
            $table->string('section', 32)->index(); // home, product, vademecum, farmacovigilancia, tools, glossary, cases, blog, other
            $table->string('url_path', 255)->index();
            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('unique_visitors_count')->default(0);
            $table->timestamps();

            $table->unique(['date', 'url_path']);
        });

        Schema::create('daily_visitors', function (Blueprint $table) {
            $table->id();
            $table->date('date')->index();
            $table->string('visitor_hash', 64)->index();
            $table->timestamp('created_at')->nullable();

            $table->unique(['date', 'visitor_hash']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_visitors');
        Schema::dropIfExists('page_views');
    }
};
