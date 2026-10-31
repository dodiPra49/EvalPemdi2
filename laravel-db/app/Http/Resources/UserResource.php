<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="UserResource",
 *     title="User Resource",
 *     description="User model data representation",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Dodi Administrator"),
 *     @OA\Property(property="email", type="string", example="admin@evalpemdi.go.id"),
 *     @OA\Property(property="nip", type="string", nullable=true, example="198501012010011001"),
 *     @OA\Property(property="role", type="string", example="admin"),
 *     @OA\Property(property="status", type="string", example="active"),
 *     @OA\Property(property="work_unit", ref="#/components/schemas/WorkUnitResource")
 * )
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'nip' => $this->nip,
            'role' => $this->role,
            'status' => $this->status,
            'work_unit_id' => $this->work_unit_id,
            'work_unit' => new WorkUnitResource($this->whenLoaded('workUnit')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
