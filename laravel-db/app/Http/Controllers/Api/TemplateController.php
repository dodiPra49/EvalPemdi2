<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MaturityTemplateResource;
use App\Models\MaturityTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Tag(
 *     name="Templates",
 *     description="Master Template Bukti Dukung (.docx, .xlsx)"
 * )
 */
class TemplateController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/master/templates",
     *     tags={"Templates"},
     *     summary="List all templates with related indicators",
     *     @OA\Response(response=200, description="List of templates")
     * )
     */
    public function index()
    {
        $templates = MaturityTemplate::with(['indicator', 'maturityLevel'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => MaturityTemplateResource::collection($templates),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/master/templates",
     *     tags={"Templates"},
     *     summary="Upload and register new template file",
     *     @OA\Response(response=201, description="Template created")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'indicator_id' => 'required|exists:indicators,id',
            'maturity_level_id' => 'nullable|exists:maturity_levels,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:docx,xlsx,pdf|max:25600',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('templates', $fileName, 'public');

        $template = MaturityTemplate::create([
            'indicator_id' => $validated['indicator_id'],
            'maturity_level_id' => $validated['maturity_level_id'] ?? null,
            'title' => $validated['title'],
            'document_type' => in_array($extension, ['docx', 'xlsx', 'pdf']) ? $extension : 'docx',
            'file_path' => 'storage/' . $path,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Template berhasil diunggah.',
            'data' => new MaturityTemplateResource($template),
        ], 201);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/master/templates/{id}",
     *     tags={"Templates"},
     *     summary="Delete a template file",
     *     @OA\Response(response=200, description="Template deleted")
     * )
     */
    public function destroy($id)
    {
        $template = MaturityTemplate::findOrFail($id);

        $cleanPath = str_replace('storage/', '', $template->file_path);
        if (Storage::disk('public')->exists($cleanPath)) {
            Storage::disk('public')->delete($cleanPath);
        }

        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'Template berhasil dihapus.',
        ]);
    }
}
