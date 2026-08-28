<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AiGuardrail extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'rule_instruction',
        'is_active',
        'is_system',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_system' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($guardrail) {
            if (empty($guardrail->slug)) {
                $base = Str::slug($guardrail->name);
                $slug = $base;
                $i = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }
                $guardrail->slug = $slug;
            }
        });
    }
}
