<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoyaltyTier extends Model
{
    use HasFactory;

    protected $table = 'loyalty_tiers';

    protected $fillable = [
        'name',
        'minimum_points',
        'maximum_points',
        'benefits',
        'status',
    ];

    protected $casts = [
        'minimum_points' => 'integer',
        'maximum_points' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(LoyaltyAccount::class);
    }
}