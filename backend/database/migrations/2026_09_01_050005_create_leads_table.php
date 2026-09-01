<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('lead_code')->unique();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('source', ['WALK_IN', 'WEBSITE', 'WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'REFERRAL', 'EVENT', 'ADVERTISEMENT', 'PHONE', 'OTHER'])->nullable();
            $table->foreignId('interested_model_id')->nullable()->constrained('vehicle_models');
            $table->foreignId('salesperson_id')->nullable()->constrained();
            $table->foreignId('dealer_id')->nullable()->constrained();
            $table->decimal('estimated_budget', 15, 2)->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['COLD', 'WARM', 'HOT', 'HOLD', 'WON', 'LOST'])->default('COLD');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};