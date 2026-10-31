<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'category',
        'pic_name',
        'pic_contact',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
