<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductDailyStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'date',
        'views_count',
        'chatbot_mentions_count',
        'quote_requests_count',
    ];

    protected $casts = [
        'date' => 'string',
        'views_count' => 'integer',
        'chatbot_mentions_count' => 'integer',
        'quote_requests_count' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
