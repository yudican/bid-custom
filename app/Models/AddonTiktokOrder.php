<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddonTiktokOrder extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'order_items' => 'json',
        'price' => 'json',
    ];
}
