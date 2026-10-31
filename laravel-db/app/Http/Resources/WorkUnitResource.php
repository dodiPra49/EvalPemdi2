<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="WorkUnitResource",
 *     title="WorkUnit Resource",
 *     description="Perangkat Daerah / Unit Kerja representation",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Dinas Komunikasi dan Informatika"),
 *     @OA\Property(property="code", type="string", example="DISKOMINFO"),
 *     @OA\Property(property="category", type="string", example="Daerah"),
 *     @OA\Property(property="pic_name", type="string", nullable=true, example="Budi Santoso"),
 *     @OA\Property(property="pic_contact", type="string", nullable=true, example="081234567890")
 * )
 */
class WorkUnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'category' => $this->category,
            'pic_name' => $this->pic_name,
            'pic_contact' => $this->pic_contact,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
