<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaturityTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicator_id',
        'maturity_level_id',
        'title',
        'document_type',
        'file_path',
        'description',
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function maturityLevel()
    {
        return $this->belongsTo(MaturityLevel::class);
    }
}
