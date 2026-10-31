<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="EvaluationDetailResource",
 *     title="EvaluationDetail Resource",
 *     description="User assessment answer for an indicator",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="indicator_id", type="integer", example=1),
 *     @OA\Property(property="selected_level_id", type="integer", nullable=true, example=3),
 *     @OA\Property(property="assessed_score", type="number", format="float", example=3.00),
 *     @OA\Property(property="explanation_notes", type="string", nullable=true),
 *     @OA\Property(property="evidence_files", type="array", @OA\Items(ref="#/components/schemas/EvidenceFileResource"))
 * )
 */
class EvaluationDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'evaluation_id' => $this->evaluation_id,
            'indicator_id' => $this->indicator_id,
            'selected_level_id' => $this->selected_level_id,
            'assessed_score' => (float) $this->assessed_score,
            'explanation_notes' => $this->explanation_notes,
            'selected_level' => new MaturityLevelResource($this->whenLoaded('selectedLevel')),
            'evidence_files' => EvidenceFileResource::collection($this->whenLoaded('evidenceFiles')),
        ];
    }
}
