<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleDocument extends Model
{
    use HasFactory;

    protected $table = 'vehicle_documents';

    protected $fillable = [
        'vehicle_id',
        'document_type',
        'document_number',
        'file_path',
        'issued_date',
        'expired_date',
        'status',
        'uploaded_by',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'expired_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}