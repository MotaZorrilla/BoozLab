<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageView extends Model
{
    use HasFactory;

    protected $table = 'page_views';

    protected $fillable = [
        'date',
        'section',
        'url_path',
        'product_id',
        'views_count',
        'unique_visitors_count',
    ];

    protected $casts = [
        'date' => 'string',
        'views_count' => 'integer',
        'unique_visitors_count' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeByDate($query, string $date)
    {
        return $query->where('date', $date);
    }

    public function scopeBySection($query, string $section)
    {
        return $query->where('section', $section);
    }
}
