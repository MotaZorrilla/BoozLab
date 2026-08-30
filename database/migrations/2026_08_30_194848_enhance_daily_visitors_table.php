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
        Schema::table('daily_visitors', function (Blueprint $table) {
            $table->string('browser', 32)->nullable()->default('Otro')->after('visitor_hash');
            $table->string('device_type', 32)->nullable()->default('Desktop')->after('browser');
            $table->string('os', 32)->nullable()->default('Otro')->after('device_type');
            $table->string('entry_path', 255)->nullable()->after('os');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_visitors', function (Blueprint $table) {
            $table->dropColumn(['browser', 'device_type', 'os', 'entry_path']);
        });
    }
};
