<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'source',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'admin_notes',
    ];

    /**
     * Scope to filter pending messages needing attention.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'Pendiente');
    }

    /**
     * Scope to filter messages originated from Lira virtual assistant.
     */
    public function scopeFromLira(Builder $query): Builder
    {
        return $query->where('source', 'lira_chatbot')->orWhere('type', 'lira');
    }
}
