<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceRecord extends Model
{
    use HasFactory;

    protected $table = 'service_records';

    protected $fillable = [
        'service_number',
        'vehicle_id',
        'customer_id',
        'dealer_id',
        'service_date',
        'odometer',
        'service_type',
        'complaint',
        'diagnosis',
        'notes',
        'total_cost',
        'status',
    ];

    protected $casts = [
        'service_date' => 'date',
        'odometer' => 'integer',
        'total_cost' => 'decimal:2',
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

    public function dealer()
    {
        return $this->belongsTo(Dealer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServiceItem::class);
    }

    public function warrantyClaims(): HasMany
    {
        return $this->hasMany(WarrantyClaim::class, 'service_record_id');
    }
}