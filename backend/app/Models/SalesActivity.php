<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesActivity extends Model
{
    use HasFactory;

    protected $table = 'sales_activities';

    protected $fillable = [
        'salesperson_id',
        'lead_id',
        'customer_id',
        'activity_type',
        'description',
        'activity_date',
        'reference_type',
        'reference_id',
    ];

    protected $casts = [
        'activity_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function salesperson()
    {
        return $this->belongsTo(Salesperson::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}