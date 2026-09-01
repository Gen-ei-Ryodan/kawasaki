<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleModel extends Model
{
    use HasFactory;

    protected $table = 'vehicle_models';

    protected $fillable = [
        'brand',
        'model',
        'variant',
        'year',
        'engine_cc',
        'description',
        'status',
    ];

    protected $casts = [
        'year' => 'integer',
        'engine_cc' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }
}