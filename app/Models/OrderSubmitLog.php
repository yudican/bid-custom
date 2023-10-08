<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderSubmitLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'submited_by',
        'updated_by',
        'type_si',
        'vat',
        'tax'
    ];

    protected $appends = [
        'submited_by_name',
        'updated_by_name',
        'success',
        'failed',
    ];

    /**
     * Get all of the submitedBy for the OrderSubmitLog
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function submitedBy()
    {
        return $this->hasMany(User::class);
    }

    public function orderSubmitLogDetails()
    {
        return $this->hasMany(OrderSubmitLogDetail::class);
    }

    public function getSubmitedByNameAttribute()
    {
        return $this->submited_by ? User::find($this->submited_by)->name : '-';
    }

    public function getUpdatedByNameAttribute()
    {
        return $this->updated_by ? User::find($this->updated_by)->name : '-';
    }

    public function getSuccessAttribute()
    {
        return $this->orderSubmitLogDetails()->where('status', 'success')->count();
    }

    public function getFailedAttribute()
    {
        return $this->orderSubmitLogDetails()->where('status', 'failed')->count();
    }
}
