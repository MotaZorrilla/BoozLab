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
        Schema::create('interaction_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type', 64)->index();
            $table->string('channel', 32)->index(); // whatsapp, lira_ai, web_form, store_cart
            $table->string('source', 64)->index();  // pdp_dual_card, floating_button, cart_checkout, footer
            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->string('session_uid', 100)->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->nullable()->index();
            $table->timestamp('updated_at')->nullable();
        });

        if (Schema::hasTable('product_daily_stats') && !Schema::hasColumn('product_daily_stats', 'whatsapp_clicks_count')) {
            Schema::table('product_daily_stats', function (Blueprint $table) {
                $table->unsignedInteger('whatsapp_clicks_count')->default(0)->after('quote_requests_count');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interaction_events');

        if (Schema::hasTable('product_daily_stats') && Schema::hasColumn('product_daily_stats', 'whatsapp_clicks_count')) {
            Schema::table('product_daily_stats', function (Blueprint $table) {
                $table->dropColumn('whatsapp_clicks_count');
            });
        }
    }
};
