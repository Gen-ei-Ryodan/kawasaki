<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyRule extends Model
{
    use HasFactory;

    protected $table = 'loyalty_rules';

    protected $fillable = [
        'name',
        'trigger_type',
        'min_amount',
        'points_earned',
        'status',
    ];

    protected $casts = [
        'min_amount' => 'decimal:2',
        'points_earned' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}