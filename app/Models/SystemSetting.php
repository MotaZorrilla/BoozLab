<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('system_settings_all'));
        static::deleted(fn () => Cache::forget('system_settings_all'));
    }

    /**
     * Get a setting value with in-memory caching and automatic decryption.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        try {
            $settings = Cache::rememberForever('system_settings_all', function () {
                return static::all()->keyBy('key');
            });

            if (! isset($settings[$key])) {
                return $default;
            }

            $setting = $settings[$key];
            if ($setting->type === 'encrypted' && ! empty($setting->value)) {
                try {
                    return Crypt::decryptString($setting->value);
                } catch (\Throwable) {
                    return $setting->value;
                }
            }

            return $setting->value ?? $default;
        } catch (\Throwable) {
            return $default;
        }
    }

    /**
     * Set a setting value with encryption if requested.
     */
    public static function set(string $key, mixed $value, string $type = 'string', string $group = 'general', ?string $description = null): static
    {
        $storedValue = ($type === 'encrypted' && ! empty($value))
            ? Crypt::encryptString($value)
            : (is_array($value) ? json_encode($value) : (string) $value);

        $attributes = [
            'value' => $storedValue,
            'type' => $type,
            'group' => $group,
        ];

        if ($description !== null) {
            $attributes['description'] = $description;
        }

        $setting = static::updateOrCreate(
            ['key' => $key],
            $attributes
        );

        Cache::forget('system_settings_all');

        return $setting;
    }
}
