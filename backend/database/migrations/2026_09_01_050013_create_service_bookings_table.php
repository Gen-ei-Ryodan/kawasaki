<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->foreignId('vehicle_id')->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->foreignId('dealer_id')->nullable()->constrained();
            $table->date('booking_date');
            $table->time('booking_time')->nullable();
            $table->enum('service_type', ['ROUTINE', 'PERIODIC', 'REPAIR', 'WARRANTY', 'INSPECTION', 'OTHER']);
            $table->text('complaint')->nullable();
            $table->foreignId('assigned_advisor_id')->nullable()->constrained('users');
            $table->enum('status', ['REQUESTED', 'CONFIRMED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])->default('REQUESTED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_bookings');
    }
};