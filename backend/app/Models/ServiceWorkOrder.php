<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceWorkOrder extends Model
{
    use HasFactory;

    protected $table = 'service_work_orders';

    protected $fillable = [
        'work_order_number',
        'service_booking_id',
        'vehicle_id',
        'technician_id',
        'start_time',
        'end_time',
        'diagnosis',
        'work_description',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function serviceBooking()
    {
        return $this->belongsTo(ServiceBooking::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
}