<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->foreignId('lead_id')->nullable()->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->foreignId('salesperson_id')->nullable()->constrained('salespersons');
            $table->foreignId('dealer_id')->nullable()->constrained();
            $table->foreignId('vehicle_id')->nullable()->constrained();
            $table->date('sale_date')->nullable();
            $table->decimal('vehicle_price', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('additional_cost', 15, 2)->default(0);
            $table->decimal('final_price', 15, 2)->default(0);
            $table->enum('payment_method', ['CASH', 'CREDIT', 'BANK_TRANSFER', 'OTHER'])->nullable();
            $table->enum('payment_status', ['UNPAID', 'PARTIAL', 'PAID'])->default('UNPAID');
            $table->enum('status', ['DRAFT', 'BOOKED', 'SOLD', 'CANCELLED'])->default('DRAFT');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_transactions');
    }
};