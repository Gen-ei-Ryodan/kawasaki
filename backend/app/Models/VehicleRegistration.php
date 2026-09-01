<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleRegistration extends Model
{
    use HasFactory;

    protected $table = 'vehicle_registrations';

    protected $fillable = [
        'vehicle_id',
        'license_plate',
        'stnk_number',
        'registration_date',
        'registration_expiry',
        'bpkb_number',
        'status',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'registration_expiry' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}