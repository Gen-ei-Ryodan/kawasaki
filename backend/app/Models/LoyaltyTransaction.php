<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyTransaction extends Model
{
    use HasFactory;

    protected $table = 'loyalty_transactions';

    protected $fillable = [
        'customer_id',
        'type',
        'points',
        'reference_type',
        'reference_id',
        'description',
        'expired_at',
    ];

    protected $casts = [
        'points' => 'integer',
        'expired_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}