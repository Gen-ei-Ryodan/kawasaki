<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('work_order_number')->unique();
            $table->foreignId('service_booking_id')->nullable()->constrained();
            $table->foreignId('vehicle_id')->constrained();
            $table->foreignId('technician_id')->nullable()->constrained('users');
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('work_description')->nullable();
            $table->enum('status', ['OPEN', 'IN_PROGRESS', 'WAITING_PART', 'COMPLETED', 'CANCELLED'])->default('OPEN');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_work_orders');
    }
};