<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    use HasFactory;

    protected $fillable = [
        'aspect_id',
        'indicator_number',
        'name',
        'weight',
        'description',
        'supervisor_agency',
        'responsible_functions',
    ];

    protected $casts = [
        'indicator_number' => 'integer',
        'weight' => 'float',
    ];

    public function aspect()
    {
        return $this->belongsTo(Aspect::class);
    }

    public function maturityLevels()
    {
        return $this->hasMany(MaturityLevel::class)->orderBy('level_number');
    }

    public function templates()
    {
        return $this->hasMany(MaturityTemplate::class);
    }

    public function evaluationDetails()
    {
        return $this->hasMany(EvaluationDetail::class);
    }
}
