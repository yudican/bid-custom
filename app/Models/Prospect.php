<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prospect extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'prospect_number',
        'contact',
        'async_to',
        'created_by',
        'status',
        'tag',
    ];
    protected $appends = ['contact_name', 'contact_async_name', 'created_by_name', 'role_name', 'tag_name', 'activity_total', 'profile_photo_url'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($prospect) {
            $latestProspect = self::latest()->first();

            $sequenceNumber = 'SA001';
            $currentYear = now()->format('Y');
            if ($latestProspect) {
                $number = explode('/', $latestProspect->prospect_number);
                $sequenceNumber = (int)substr($number[1], -3) + 1;
            }

            $prospect->prospect_number = 'PROSPECT/SA' . str_pad($sequenceNumber, 3, '0', STR_PAD_LEFT) . '/' . $currentYear;
        });
    }


    /**
     * Get all of the activities for the Prospect
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function activities()
    {
        return $this->hasMany(ProspectActivity::class, 'prospect_id')->orderBy('created_at', 'DESC');
    }

    public function getActivityTotalAttribute()
    {
        return $this->activities()->count();
    }

    public function createBy()
    {
        return $this->hasMany(User::class, 'created_by');
    }

    public function getContactNameAttribute()
    {
        $user = User::find($this->contact, ['name']);

        if ($user) {
            return $user->name;
        }

        return '-';
    }

    public function getContactAsyncNameAttribute()
    {
        $user = User::find($this->async_to, ['name']);

        if ($user) {
            return $user->name;
        }

        return '-';
    }

    public function getProfilePhotoUrlAttribute()
    {
        $user = User::find($this->contact);

        if ($user) {
            return $user->profile_photo_url;
        }

        return '-';
    }


    public function getCreatedByNameAttribute()
    {
        $user = User::find($this->created_by, ['name']);

        if ($user) {
            return $user->name;
        }

        return '-';
    }


    public function getRoleNameAttribute()
    {
        $user = User::find($this->created_by);

        if ($user) {
            return $user?->role?->role_name ?? '-';
        }

        return '-';
    }

    public function getTagNameAttribute()
    {
        $count = $this->tag;
        if ($count == 'cold') {
            return '❄️ Cold';
        } else if ($count == 'warm') {
            return '🌤 Warm';
        } else if ($count == 'hot') {
            return '🔥 Hot';
        }

        return '❄️ Cold';
    }
}
