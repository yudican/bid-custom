<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthTiktok extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'auth_tiktok';
}
