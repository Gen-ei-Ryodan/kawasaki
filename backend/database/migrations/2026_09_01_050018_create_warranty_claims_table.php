<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warranty_claims', function (Blueprint $table) {
            $table->id();
            $table->string('claim_number')->unique();
            $table->foreignId('vehicle_id')->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->foreignId('warranty_id')->nullable()->constrained();
            $table->foreignId('service_record_id')->nullable()->constrained();
            $table->date('claim_date');
            $table->text('problem')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('resolution')->nullable();
            $table->decimal('cost', 15, 2)->default(0);
            $table->enum('status', ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED'])->default('SUBMITTED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warranty_claims');
    }
};