<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_records', function (Blueprint $table) {
            $table->id();
            $table->string('service_number')->unique();
            $table->foreignId('vehicle_id')->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->foreignId('dealer_id')->nullable()->constrained();
            $table->date('service_date');
            $table->integer('odometer')->nullable();
            $table->enum('service_type', ['ROUTINE', 'PERIODIC', 'REPAIR', 'WARRANTY', 'INSPECTION', 'OTHER']);
            $table->text('complaint')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('total_cost', 15, 2)->default(0);
            $table->enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_records');
    }
};