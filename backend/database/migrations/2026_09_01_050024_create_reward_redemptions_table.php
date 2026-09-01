<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->id();
            $table->string('redemption_number')->unique();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('reward_id')->constrained();
            $table->integer('points_used');
            $table->enum('status', ['PENDING', 'FULFILLED', 'CANCELLED'])->default('PENDING');
            $table->timestamp('redeemed_at')->nullable();
            $table->timestamp('fulfilled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reward_redemptions');
    }
};