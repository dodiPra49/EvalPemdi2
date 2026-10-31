<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_unit_id',
        'evaluator_user_id',
        'year',
        'final_index_pemdi',
        'predicate',
        'status',
        'notes',
    ];

    protected $casts = [
        'year' => 'integer',
        'final_index_pemdi' => 'float',
    ];

    public function workUnit()
    {
        return $this->belongsTo(WorkUnit::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_user_id');
    }

    public function details()
    {
        return $this->hasMany(EvaluationDetail::class);
    }

    public function calculateScore(): array
    {
        $this->loadMissing(['details.indicator.aspect']);
        $aspects = Aspect::with('indicators')->get();

        $aspectScores = [];
        $totalIndex = 0.0;

        foreach ($aspects as $aspect) {
            $aspectWeight = (float) $aspect->weight;
            $sumIndikator = 0.0;

            foreach ($aspect->indicators as $ind) {
                $detail = $this->details->firstWhere('indicator_id', $ind->id);
                $score = $detail ? (float) $detail->assessed_score : 1.0;
                $indWeight = (float) $ind->weight;
                $sumIndikator += ($indWeight * $score);
            }

            $aspectIndex = $aspectWeight > 0 ? ($sumIndikator / $aspectWeight) : 1.0;
            $aspectScores[$aspect->code] = round($aspectIndex, 2);
            $totalIndex += $sumIndikator;
        }

        $roundedTotal = round($totalIndex, 2);

        // Predicate based on PermenPANRB 8/2026
        $predicate = 'Kurang / Merintis';
        if ($roundedTotal > 4.0) {
            $predicate = 'Memuaskan / Unggul';
        } elseif ($roundedTotal > 3.5) {
            $predicate = 'Sangat Baik / Melembaga';
        } elseif ($roundedTotal > 2.5) {
            $predicate = 'Baik / Berkembang';
        } elseif ($roundedTotal > 1.5) {
            $predicate = 'Cukup / Membangun';
        }

        $this->update([
            'final_index_pemdi' => $roundedTotal,
            'predicate' => $predicate,
        ]);

        return [
            'final_index_pemdi' => $roundedTotal,
            'predicate' => $predicate,
            'aspect_scores' => $aspectScores,
        ];
    }
}
