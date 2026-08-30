<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_uid',
        'first_query',
        'peer_hash',
        'url_ref',
        'turn_count',
        'total_latency_ms',
        'last_source',
        'action',
        'suggested_product_ids',
        'converted_to_order',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'suggested_product_ids' => 'array',
        'converted_to_order' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'turn_count' => 'integer',
        'total_latency_ms' => 'integer',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }

    public function scopeBySource(Builder $query, ?string $source): Builder
    {
        if (empty($source) || $source === 'all') {
            return $query;
        }

        return $query->where('last_source', $source);
    }

    public function scopeByDateRange(Builder $query, ?string $from, ?string $to): Builder
    {
        if (!empty($from)) {
            $query->whereDate('started_at', '>=', $from);
        }

        if (!empty($to)) {
            $query->whereDate('started_at', '<=', $to);
        }

        return $query;
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('first_query', 'like', "%{$term}%")
              ->orWhere('session_uid', 'like', "%{$term}%")
              ->orWhereHas('messages', function (Builder $mq) use ($term) {
                  $mq->where('content', 'like', "%{$term}%");
              });
        });
    }
}
