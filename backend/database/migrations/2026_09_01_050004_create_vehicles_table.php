<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_code')->unique();
            $table->foreignId('vehicle_model_id')->constrained();
            $table->string('vin')->unique();
            $table->string('engine_number')->unique();
            $table->string('color')->nullable();
            $table->integer('year')->nullable();
            $table->string('license_plate')->nullable();
            $table->integer('odometer')->default(0);
            $table->foreignId('dealer_id')->constrained();
            $table->enum('status', ['IN_STOCK', 'BOOKED', 'SOLD', 'DELIVERED', 'IN_SERVICE', 'TRANSFERRED', 'SCRAPPED'])->default('IN_STOCK');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};