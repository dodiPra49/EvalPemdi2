<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="MaturityLevelResource",
 *     title="MaturityLevel Resource",
 *     description="Representation of a Maturity Level and its Criteria",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="level_number", type="integer", example=2),
 *     @OA\Property(property="level_name", type="string", example="Cukup / Membangun"),
 *     @OA\Property(property="score_range_min", type="number", example=1.51),
 *     @OA\Property(property="score_range_max", type="number", example=2.50),
 *     @OA\Property(property="criteria_description", type="string", example="Kriteria kematangan menurut Permenpan 8/2026")
 * )
 */
class MaturityLevelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'indicator_id' => $this->indicator_id,
            'level_number' => (int) $this->level_number,
            'level_name' => $this->level_name,
            'score_range_min' => (float) $this->score_range_min,
            'score_range_max' => (float) $this->score_range_max,
            'criteria_description' => $this->criteria_description,
            'templates' => MaturityTemplateResource::collection($this->whenLoaded('templates')),
        ];
    }
}
