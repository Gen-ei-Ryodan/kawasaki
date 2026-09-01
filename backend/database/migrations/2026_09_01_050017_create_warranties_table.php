<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warranties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->string('warranty_number')->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('warranty_period');
            $table->enum('status', ['ACTIVE', 'EXPIRED', 'VOID'])->default('ACTIVE');
            $table->text('terms')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warranties');
    }
};