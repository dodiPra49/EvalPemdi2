<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="MaturityTemplateResource",
 *     title="MaturityTemplate Resource",
 *     description="Dokumen template bukti dukung",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="DOKUMEN_SDLC_APLIKASI.docx"),
 *     @OA\Property(property="document_type", type="string", example="docx"),
 *     @OA\Property(property="file_path", type="string", example="storage/templates/DOKUMEN_SDLC_APLIKASI.docx"),
 *     @OA\Property(property="download_url", type="string", example="/storage/templates/DOKUMEN_SDLC_APLIKASI.docx")
 * )
 */
class MaturityTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'indicator_id' => $this->indicator_id,
            'maturity_level_id' => $this->maturity_level_id,
            'title' => $this->title,
            'document_type' => $this->document_type,
            'file_path' => $this->file_path,
            'download_url' => asset($this->file_path),
            'description' => $this->description,
        ];
    }
}
