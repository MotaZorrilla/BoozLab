<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'badge_color',
        'image_path',
    ];

    /**
     * Get the products for the line.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
