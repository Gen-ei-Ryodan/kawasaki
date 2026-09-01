<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_ownerships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('purchase_transaction_id')->nullable()->constrained('sales_transactions');
            $table->foreignId('dealer_id')->nullable()->constrained();
            $table->foreignId('salesperson_id')->nullable()->constrained();
            $table->date('purchase_date')->nullable();
            $table->date('delivery_date')->nullable();
            $table->timestamp('ownership_start')->nullable();
            $table->timestamp('ownership_end')->nullable();
            $table->enum('status', ['CURRENT', 'TRANSFERRED', 'ENDED'])->default('CURRENT');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_ownerships');
    }
};