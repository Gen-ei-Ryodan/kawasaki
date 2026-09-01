<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalesTransaction extends Model
{
    use HasFactory;

    protected $table = 'sales_transactions';

    protected $fillable = [
        'transaction_number',
        'lead_id',
        'customer_id',
        'salesperson_id',
        'dealer_id',
        'vehicle_id',
        'sale_date',
        'vehicle_price',
        'discount',
        'additional_cost',
        'final_price',
        'payment_method',
        'payment_status',
        'promo_id',
        'status',
    ];

    protected $casts = [
        'vehicle_price' => 'decimal:2',
        'discount' => 'decimal:2',
        'additional_cost' => 'decimal:2',
        'final_price' => 'decimal:2',
        'sale_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function salesperson()
    {
        return $this->belongsTo(Salesperson::class);
    }

    public function dealer()
    {
        return $this->belongsTo(Dealer::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function ownerships(): HasMany
    {
        return $this->hasMany(VehicleOwnership::class, 'purchase_transaction_id');
    }
}