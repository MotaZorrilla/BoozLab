<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_line_id',
        'name',
        'slug',
        'active_ingredients',
        'presentation',
        'description',
        'indications',
        'posology',
        'contraindications',
        'price',
        'stock',
        'is_prescription_required',
        'is_active',
        'views_count',
        'chatbot_inquiries_count',
        'quote_inquiries_count',
        'image_path',
        'pdf_path',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'views_count' => 'integer',
            'chatbot_inquiries_count' => 'integer',
            'quote_inquiries_count' => 'integer',
            'is_prescription_required' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the product line that owns the product.
     */
    public function productLine(): BelongsTo
    {
        return $this->belongsTo(ProductLine::class, 'product_line_id');
    }

    /**
     * Get the pharmacovigilance reports for the product.
     */
    public function pharmacovigilanceReports(): HasMany
    {
        return $this->hasMany(PharmacovigilanceReport::class);
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Auto-generate slug if not provided.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $baseSlug = Str::slug($product->name);
                $slug = $baseSlug;
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$counter}";
                    $counter++;
                }
                $product->slug = $slug;
            }
        });
    }
}
