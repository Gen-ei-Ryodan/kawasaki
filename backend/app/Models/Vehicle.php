<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Vehicle extends Model
{
    use HasFactory;

    protected $table = 'vehicles';

    protected $fillable = [
        'vehicle_code',
        'vehicle_model_id',
        'vin',
        'engine_number',
        'color',
        'year',
        'license_plate',
        'odometer',
        'dealer_id',
        'status',
        'created_by',
    ];

    protected $casts = [
        'year' => 'integer',
        'odometer' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class, 'vehicle_model_id');
    }

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(Dealer::class);
    }

    public function currentOwner()
    {
        return $this->hasOne(VehicleOwnership::class)->where('status', 'CURRENT');
    }

    public function ownerships(): HasMany
    {
        return $this->hasMany(VehicleOwnership::class);
    }

    public function salesTransactions(): HasMany
    {
        return $this->hasMany(SalesTransaction::class);
    }

    public function serviceRecords(): HasMany
    {
        return $this->hasMany(ServiceRecord::class);
    }

    public function serviceBookings(): HasMany
    {
        return $this->hasMany(ServiceBooking::class);
    }

    public function serviceWorkOrders(): HasMany
    {
        return $this->hasMany(ServiceWorkOrder::class);
    }

    public function serviceSchedules(): HasMany
    {
        return $this->hasMany(ServiceSchedule::class);
    }

    public function warranties(): HasMany
    {
        return $this->hasMany(Warranty::class);
    }

    public function warrantyClaims(): HasMany
    {
        return $this->hasMany(WarrantyClaim::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(VehicleDocument::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(VehicleRegistration::class);
    }

    public function timelines(): HasMany
    {
        return $this->hasMany(VehicleTimeline::class);
    }

    public function ownershipTransfers(): HasMany
    {
        return $this->hasMany(OwnershipTransfer::class);
    }

    public function customers(): HasManyThrough
    {
        return $this->hasManyThrough(Customer::class, VehicleOwnership::class);
    }
}