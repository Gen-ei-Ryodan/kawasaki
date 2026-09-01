<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceBooking extends Model
{
    use HasFactory;

    protected $table = 'service_bookings';

    protected $fillable = [
        'booking_number',
        'vehicle_id',
        'customer_id',
        'dealer_id',
        'booking_date',
        'booking_time',
        'service_type',
        'complaint',
        'assigned_advisor_id',
        'status',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'booking_time' => 'datetime:H:i',
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

    public function assignedAdvisor()
    {
        return $this->belongsTo(User::class, 'assigned_advisor_id');
    }

    public function workOrders(): HasMany
    {
        return $this->hasMany(ServiceWorkOrder::class);
    }
}