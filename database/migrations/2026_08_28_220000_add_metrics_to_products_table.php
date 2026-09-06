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
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('is_active');
            $table->unsignedBigInteger('chatbot_inquiries_count')->default(0)->after('views_count');
            $table->unsignedBigInteger('quote_inquiries_count')->default(0)->after('chatbot_inquiries_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['views_count', 'chatbot_inquiries_count', 'quote_inquiries_count']);
        });
    }
};
