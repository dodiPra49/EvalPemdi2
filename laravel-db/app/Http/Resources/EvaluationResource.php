<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="EvaluationResource",
 *     title="Evaluation Resource",
 *     description="Instansi Evaluation Header with scores and predicate",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="work_unit_id", type="integer", example=1),
 *     @OA\Property(property="year", type="integer", example=2026),
 *     @OA\Property(property="final_index_pemdi", type="number", format="float", example=3.75),
 *     @OA\Property(property="predicate", type="string", example="Sangat Baik / Melembaga"),
 *     @OA\Property(property="status", type="string", example="draft"),
 *     @OA\Property(property="details", type="array", @OA\Items(ref="#/components/schemas/EvaluationDetailResource"))
 * )
 */
class EvaluationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'work_unit_id' => $this->work_unit_id,
            'evaluator_user_id' => $this->evaluator_user_id,
            'year' => (int) $this->year,
            'final_index_pemdi' => (float) $this->final_index_pemdi,
            'predicate' => $this->predicate,
            'status' => $this->status,
            'notes' => $this->notes,
            'work_unit' => new WorkUnitResource($this->whenLoaded('workUnit')),
            'details' => EvaluationDetailResource::collection($this->whenLoaded('details')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
