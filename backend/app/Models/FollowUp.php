<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUp extends Model
{
    use HasFactory;

    protected $table = 'follow_ups';

    protected $fillable = [
        'lead_id',
        'customer_id',
        'salesperson_id',
        'follow_up_date',
        'follow_up_time',
        'channel',
        'purpose',
        'notes',
        'result',
        'next_follow_up_at',
        'status',
    ];

    protected $casts = [
        'follow_up_date' => 'date',
        'follow_up_time' => 'datetime:H:i',
        'next_follow_up_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function salesperson()
    {
        return $this->belongsTo(Salesperson::class);
    }
}