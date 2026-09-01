<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OwnershipTransfer extends Model
{
    use HasFactory;

    protected $table = 'ownership_transfers';

    protected $fillable = [
        'vehicle_id',
        'from_customer_id',
        'to_customer_id',
        'transfer_date',
        'reason',
        'document_reference',
        'approved_by',
        'notes',
    ];

    protected $casts = [
        'transfer_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function fromCustomer()
    {
        return $this->belongsTo(Customer::class, 'from_customer_id');
    }

    public function toCustomer()
    {
        return $this->belongsTo(Customer::class, 'to_customer_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}