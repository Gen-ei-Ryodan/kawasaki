<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follow_ups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->nullable()->constrained();
            $table->foreignId('customer_id')->nullable()->constrained();
            $table->foreignId('salesperson_id')->constrained('salespersons');
            $table->date('follow_up_date');
            $table->time('follow_up_time')->nullable();
            $table->enum('channel', ['PHONE', 'WHATSAPP', 'EMAIL', 'VISIT', 'SHOWROOM', 'VIDEO_CALL', 'OTHER'])->nullable();
            $table->string('purpose')->nullable();
            $table->text('notes')->nullable();
            $table->text('result')->nullable();
            $table->timestamp('next_follow_up_at')->nullable();
            $table->enum('status', ['PLANNED', 'COMPLETED', 'MISSED', 'CANCELLED'])->default('PLANNED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follow_ups');
    }
};