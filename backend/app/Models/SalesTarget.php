<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesTarget extends Model
{
    use HasFactory;

    protected $table = 'sales_targets';

    protected $fillable = [
        'salesperson_id',
        'dealer_id',
        'period',
        'target_units',
        'target_revenue',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'target_units' => 'integer',
        'target_revenue' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function salesperson()
    {
        return $this->belongsTo(Salesperson::class);
    }

    public function dealer()
    {
        return $this->belongsTo(Dealer::class);
    }
}