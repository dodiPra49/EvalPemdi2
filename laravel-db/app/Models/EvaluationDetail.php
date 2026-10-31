<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_id',
        'indicator_id',
        'selected_level_id',
        'assessed_score',
        'explanation_notes',
    ];

    protected $casts = [
        'assessed_score' => 'float',
    ];

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function selectedLevel()
    {
        return $this->belongsTo(MaturityLevel::class, 'selected_level_id');
    }

    public function evidenceFiles()
    {
        return $this->hasMany(EvidenceFile::class);
    }
}
