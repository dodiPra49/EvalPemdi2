<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaturityLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicator_id',
        'level_number',
        'level_name',
        'score_range_min',
        'score_range_max',
        'criteria_description',
    ];

    protected $casts = [
        'level_number' => 'integer',
        'score_range_min' => 'float',
        'score_range_max' => 'float',
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function templates()
    {
        return $this->hasMany(MaturityTemplate::class);
    }
}
