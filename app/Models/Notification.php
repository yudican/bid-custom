<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    //use Uuid;
    use HasFactory;

    //public $incrementing = false;

    // protected $fillable = ['title','body'];
    protected $guarded = [];
    
    protected $dates = [];
}
