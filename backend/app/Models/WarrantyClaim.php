<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarrantyClaim extends Model
{
    use HasFactory;

    protected $table = 'warranty_claims';

    protected $fillable = [
        'claim_number',
        'vehicle_id',
        'customer_id',
        'warranty_id',
        'service_record_id',
        'claim_date',
        'problem',
        'diagnosis',
        'resolution',
        'cost',
        'status',
    ];

    protected $casts = [
        'claim_date' => 'date',
        'cost' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function warranty()
    {
        return $this->belongsTo(Warranty::class);
    }

    public function serviceRecord()
    {
        return $this->belongsTo(ServiceRecord::class, 'service_record_id');
    }
}