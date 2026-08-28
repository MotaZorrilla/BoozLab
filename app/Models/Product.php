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
        'image_path',
        'pdf_path',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
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
     * Auto-generate slug if not provided.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }
}
