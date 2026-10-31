<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aspect extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'weight',
        'order_index',
    ];

    protected $casts = [
        'weight' => 'float',
        'order_index' => 'integer',
    ];

    public function indicators()
    {
        return $this->hasMany(Indicator::class)->orderBy('indicator_number');
    }
}
