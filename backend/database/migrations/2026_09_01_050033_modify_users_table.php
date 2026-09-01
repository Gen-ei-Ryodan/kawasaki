<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('dealer_id')->nullable()->after('id')->constrained();
            $table->foreignId('role_id')->nullable()->after('dealer_id')->constrained('roles');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['dealer_id']);
            $table->dropColumn(['role_id', 'dealer_id']);
        });
    }
};