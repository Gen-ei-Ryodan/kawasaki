<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained();
            $table->string('license_plate')->nullable();
            $table->string('stnk_number')->nullable();
            $table->date('registration_date')->nullable();
            $table->date('registration_expiry')->nullable();
            $table->string('bpkb_number')->nullable();
            $table->enum('status', ['ACTIVE', 'EXPIRED'])->default('ACTIVE');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_registrations');
    }
};