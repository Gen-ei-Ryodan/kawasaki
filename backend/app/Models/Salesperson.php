<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salesperson extends Model
{
    use HasFactory;

    protected $table = 'salespersons';

    protected $fillable = [
        'employee_code',
        'name',
        'email',
        'phone',
        'dealer_id',
        'join_date',
        'status',
    ];

    protected $casts = [
        'join_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function dealer()
    {
        return $this->belongsTo(Dealer::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class);
    }

    public function salesActivities(): HasMany
    {
        return $this->hasMany(SalesActivity::class);
    }

    public function salesTransactions(): HasMany
    {
        return $this->hasMany(SalesTransaction::class);
    }

    public function salesTargets(): HasMany
    {
        return $this->hasMany(SalesTarget::class);
    }

    public function vehicleOwnerships(): HasMany
    {
        return $this->hasMany(VehicleOwnership::class);
    }
}