<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleOwnership extends Model
{
    use HasFactory;

    protected $table = 'vehicle_ownerships';

    protected $fillable = [
        'vehicle_id',
        'customer_id',
        'purchase_transaction_id',
        'dealer_id',
        'salesperson_id',
        'purchase_date',
        'delivery_date',
        'ownership_start',
        'ownership_end',
        'status',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'delivery_date' => 'date',
        'ownership_start' => 'datetime',
        'ownership_end' => 'datetime',
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

    public function purchaseTransaction()
    {
        return $this->belongsTo(SalesTransaction::class, 'purchase_transaction_id');
    }

    public function dealer()
    {
        return $this->belongsTo(Dealer::class);
    }

    public function salesperson()
    {
        return $this->belongsTo(Salesperson::class);
    }

    public function transfersAsFrom(): HasMany
    {
        return $this->hasMany(OwnershipTransfer::class, 'from_customer_id');
    }

    public function transfersAsTo(): HasMany
    {
        return $this->hasMany(OwnershipTransfer::class, 'to_customer_id');
    }
}