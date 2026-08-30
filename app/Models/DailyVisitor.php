<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyVisitor extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'daily_visitors';

    protected $fillable = [
        'date',
        'visitor_hash',
        'browser',
        'device_type',
        'os',
        'entry_path',
        'created_at',
    ];

    protected $casts = [
        'date' => 'string',
        'created_at' => 'datetime',
    ];

    public function scopeByDate($query, string $date)
    {
        return $query->where('date', $date);
    }
}
