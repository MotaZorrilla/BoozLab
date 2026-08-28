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
        Schema::table('quotes', function (Blueprint $table) {
            $table->string('channel', 50)->default('whatsapp')->after('customer_type'); // whatsapp, web_cart, manual
            $table->decimal('total_amount', 10, 2)->default(0.00)->after('total_items');
            $table->text('admin_notes')->nullable()->after('status');
            $table->timestamp('downloaded_at')->nullable()->after('admin_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['channel', 'total_amount', 'admin_notes', 'downloaded_at']);
        });
    }
};
