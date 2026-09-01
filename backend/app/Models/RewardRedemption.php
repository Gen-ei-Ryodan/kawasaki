<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RewardRedemption extends Model
{
    use HasFactory;

    protected $table = 'reward_redemptions';

    protected $fillable = [
        'redemption_number',
        'customer_id',
        'reward_id',
        'points_used',
        'status',
        'redeemed_at',
        'fulfilled_at',
    ];

    protected $casts = [
        'points_used' => 'integer',
        'redeemed_at' => 'datetime',
        'fulfilled_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }
}