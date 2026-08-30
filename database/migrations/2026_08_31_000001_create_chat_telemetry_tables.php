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
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_uid', 64)->unique()->index();
            $table->string('first_query', 255)->nullable();
            $table->string('peer_hash', 64)->nullable()->index();
            $table->string('url_ref', 255)->nullable();
            $table->unsignedInteger('turn_count')->default(0);
            $table->unsignedInteger('total_latency_ms')->default(0);
            $table->string('last_source', 64)->nullable();
            $table->string('action', 64)->nullable();
            $table->json('suggested_product_ids')->nullable();
            $table->boolean('converted_to_order')->default(false);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_session_id')->constrained('chat_sessions')->cascadeOnDelete();
            $table->string('role', 16);
            $table->longText('content');
            $table->string('source', 64)->nullable();
            $table->string('model', 64)->nullable();
            $table->unsignedInteger('latency_ms')->default(0);
            $table->unsignedInteger('prompt_tokens')->nullable();
            $table->unsignedInteger('completion_tokens')->nullable();
            $table->boolean('disclaimer_shown')->default(false);
            $table->string('guardrail_triggered', 120)->nullable();
            $table->timestamp('created_at')->nullable()->index();
            $table->timestamp('updated_at')->nullable();
        });

        Schema::create('product_daily_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->date('date');
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('chatbot_mentions_count')->default(0);
            $table->unsignedInteger('quote_requests_count')->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_daily_stats');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_sessions');
    }
};
