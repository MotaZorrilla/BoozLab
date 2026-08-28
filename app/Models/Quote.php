<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_number',
        'customer_name',
        'customer_contact',
        'customer_type',
        'channel',
        'items_payload',
        'total_items',
        'total_amount',
        'status',
        'admin_notes',
        'downloaded_at',
    ];

    protected function casts(): array
    {
        return [
            'items_payload' => 'array',
            'total_items' => 'integer',
            'total_amount' => 'decimal:2',
            'downloaded_at' => 'datetime',
        ];
    }
}
