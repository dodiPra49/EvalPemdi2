<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="IndicatorResource",
 *     title="Indicator Resource",
 *     description="Representation of a Pemdi 8/2026 Indicator",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="indicator_number", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Tingkat Kematangan Tata Kelola Pemdi"),
 *     @OA\Property(property="weight", type="number", format="float", example=5.0),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="supervisor_agency", type="string", nullable=true, example="KemenPANRB, Komdigi, Bappenas, BSSN"),
 *     @OA\Property(property="responsible_functions", type="string", nullable=true),
 *     @OA\Property(property="maturity_levels", type="array", @OA\Items(ref="#/components/schemas/MaturityLevelResource")),
 *     @OA\Property(property="templates", type="array", @OA\Items(ref="#/components/schemas/MaturityTemplateResource"))
 * )
 */
class IndicatorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'aspect_id' => $this->aspect_id,
            'indicator_number' => (int) $this->indicator_number,
            'name' => $this->name,
            'weight' => (float) $this->weight,
            'description' => $this->description,
            'supervisor_agency' => $this->supervisor_agency,
            'responsible_functions' => $this->responsible_functions,
            'maturity_levels' => MaturityLevelResource::collection($this->whenLoaded('maturityLevels')),
            'templates' => MaturityTemplateResource::collection($this->whenLoaded('templates')),
        ];
    }
}
