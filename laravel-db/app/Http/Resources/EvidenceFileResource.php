<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="EvidenceFileResource",
 *     title="EvidenceFile Resource",
 *     description="Uploaded evidence file representation",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="original_name", type="string", example="SK_Tim_Digital.pdf"),
 *     @OA\Property(property="stored_name", type="string", example="evidence-12345.pdf"),
 *     @OA\Property(property="file_size", type="integer", example=1048576),
 *     @OA\Property(property="file_url", type="string", example="/storage/evidences/evidence-12345.pdf"),
 *     @OA\Property(property="description", type="string", nullable=true)
 * )
 */
class EvidenceFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'evaluation_detail_id' => $this->evaluation_detail_id,
            'original_name' => $this->original_name,
            'stored_name' => $this->stored_name,
            'mime_type' => $this->mime_type,
            'file_size' => (int) $this->file_size,
            'file_url' => asset($this->file_url),
            'description' => $this->description,
            'uploaded_by' => $this->uploaded_by,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
