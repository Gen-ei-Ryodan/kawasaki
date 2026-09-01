<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained();
            $table->enum('document_type', ['STNK', 'BPKB', 'INVOICE', 'WARRANTY', 'SERVICE_RECORD', 'OTHER']);
            $table->string('document_number')->nullable();
            $table->string('file_path')->nullable();
            $table->date('issued_date')->nullable();
            $table->date('expired_date')->nullable();
            $table->enum('status', ['ACTIVE', 'EXPIRED', 'VOID'])->default('ACTIVE');
            $table->foreignId('uploaded_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_documents');
    }
};