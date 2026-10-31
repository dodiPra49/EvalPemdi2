<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvidenceFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_detail_id',
        'original_name',
        'stored_name',
        'mime_type',
        'file_size',
        'file_url',
        'description',
        'uploaded_by',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function detail()
    {
        return $this->belongsTo(EvaluationDetail::class, 'evaluation_detail_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
