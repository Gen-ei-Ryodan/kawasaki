<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salesperson_id')->constrained('salespersons');
            $table->foreignId('lead_id')->nullable()->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->enum('activity_type', ['CALL', 'WHATSAPP', 'MEETING', 'TEST_RIDE', 'PRICE_QUOTE', 'FOLLOW_UP', 'PURCHASE', 'OTHER']);
            $table->text('description')->nullable();
            $table->date('activity_date');
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_activities');
    }
};