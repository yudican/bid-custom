<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTiktok extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $appends = ['total_order_tiktok'];

    public function getTotalOrderTiktokAttribute()
    {
        return getSetting('tiktok_order_total');
    }
}
