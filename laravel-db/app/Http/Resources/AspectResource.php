<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="AspectResource",
 *     title="Aspect Resource",
 *     description="Representation of a Pemdi 8/2026 Aspect",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="code", type="string", example="ASPEK_1"),
 *     @OA\Property(property="name", type="string", example="Tata Kelola dan Manajemen"),
 *     @OA\Property(property="weight", type="number", format="float", example=10.0),
 *     @OA\Property(property="order_index", type="integer", example=1),
 *     @OA\Property(property="indicators", type="array", @OA\Items(ref="#/components/schemas/IndicatorResource"))
 * )
 */
class AspectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'weight' => (float) $this->weight,
            'order_index' => (int) $this->order_index,
            'indicators' => IndicatorResource::collection($this->whenLoaded('indicators')),
        ];
    }
}
