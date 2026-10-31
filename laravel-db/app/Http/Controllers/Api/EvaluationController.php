<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationDetailResource;
use App\Http\Resources\EvaluationResource;
use App\Http\Resources\EvidenceFileResource;
use App\Models\Evaluation;
use App\Models\EvaluationDetail;
use App\Models\EvidenceFile;
use App\Models\MaturityLevel;
use App\Models\WorkUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Tag(
 *     name="Evaluations",
 *     description="Self-Assessment Evaluation and Evidence Management"
 * )
 */
class EvaluationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/evaluations/current",
     *     tags={"Evaluations"},
     *     summary="Get current active evaluation session for user's work unit",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Current evaluation detail")
     * )
     */
    public function current(Request $request)
    {
        $user = $request->user();
        $year = (int) ($request->query('year') ?? date('Y'));

        // If user has no work_unit_id, pick the first unit for demo / assessment
        $workUnitId = $user->work_unit_id ?? WorkUnit::first()?->id ?? 1;

        $evaluation = Evaluation::firstOrCreate(
            [
                'work_unit_id' => $workUnitId,
                'year' => $year,
            ],
            [
                'evaluator_user_id' => $user->id,
                'final_index_pemdi' => 1.00,
                'predicate' => 'Kurang / Merintis',
                'status' => 'draft',
            ]
        );

        $evaluation->load([
            'workUnit',
            'details.selectedLevel',
            'details.evidenceFiles',
        ]);

        return response()->json([
            'success' => true,
            'data' => new EvaluationResource($evaluation),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/evaluations/save-answer",
     *     tags={"Evaluations"},
     *     summary="Save maturity level selection and explanation notes for an indicator",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Answer saved")
     * )
     */
    public function saveAnswer(Request $request)
    {
        $validated = $request->validate([
            'evaluation_id' => 'required|exists:evaluations,id',
            'indicator_id' => 'required|exists:indicators,id',
            'selected_level_id' => 'nullable|exists:maturity_levels,id',
            'assessed_score' => 'nullable|numeric|min:1|max:5',
            'explanation_notes' => 'nullable|string',
        ]);

        $score = $validated['assessed_score'];
        if (!$score && !empty($validated['selected_level_id'])) {
            $level = MaturityLevel::find($validated['selected_level_id']);
            $score = $level ? (float) $level->level_number : 1.00;
        }

        $detail = EvaluationDetail::updateOrCreate(
            [
                'evaluation_id' => $validated['evaluation_id'],
                'indicator_id' => $validated['indicator_id'],
            ],
            [
                'selected_level_id' => $validated['selected_level_id'],
                'assessed_score' => $score ?? 1.00,
                'explanation_notes' => $validated['explanation_notes'] ?? null,
            ]
        );

        // Recalculate score
        $evaluation = Evaluation::find($validated['evaluation_id']);
        $scoreResult = $evaluation->calculateScore();

        return response()->json([
            'success' => true,
            'message' => 'Jawaban indikator berhasil disimpan.',
            'data' => new EvaluationDetailResource($detail->load(['selectedLevel', 'evidenceFiles'])),
            'score_summary' => $scoreResult,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/evaluations/upload-evidence",
     *     tags={"Evaluations"},
     *     summary="Upload evidence file for an indicator",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="File uploaded")
     * )
     */
    public function uploadEvidence(Request $request)
    {
        $validated = $request->validate([
            'evaluation_id' => 'required|exists:evaluations,id',
            'indicator_id' => 'required|exists:indicators,id',
            'description' => 'nullable|string',
            'file' => 'required|file|max:25600',
        ]);

        $file = $request->file('file');
        $fileName = 'evidence-' . time() . '-' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('evidences', $fileName, 'public');

        $detail = EvaluationDetail::firstOrCreate([
            'evaluation_id' => $validated['evaluation_id'],
            'indicator_id' => $validated['indicator_id'],
        ], [
            'assessed_score' => 1.00,
        ]);

        $evidence = EvidenceFile::create([
            'evaluation_detail_id' => $detail->id,
            'original_name' => $file->getClientOriginalName(),
            'stored_name' => $fileName,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'file_url' => 'storage/' . $path,
            'description' => $validated['description'] ?? null,
            'uploaded_by' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bukti dukung berhasil diunggah.',
            'data' => new EvidenceFileResource($evidence),
        ], 201);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/evaluations/evidence/{id}",
     *     tags={"Evaluations"},
     *     summary="Delete evidence file",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Evidence deleted")
     * )
     */
    public function deleteEvidence($id)
    {
        $evidence = EvidenceFile::findOrFail($id);

        $cleanPath = str_replace('storage/', '', $evidence->file_url);
        if (Storage::disk('public')->exists($cleanPath)) {
            Storage::disk('public')->delete($cleanPath);
        }

        $evidence->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bukti dukung berhasil dihapus.',
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/evaluations/{id}/calculate-score",
     *     tags={"Evaluations"},
     *     summary="Calculate real-time score index for an evaluation",
     *     @OA\Response(response=200, description="Calculated scores")
     * )
     */
    public function calculateScore($id)
    {
        $evaluation = Evaluation::findOrFail($id);
        $result = $evaluation->calculateScore();

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/evaluations/{id}/submit",
     *     tags={"Evaluations"},
     *     summary="Finalize and submit evaluation to verification phase",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Submitted")
     * )
     */
    public function submit($id)
    {
        $evaluation = Evaluation::findOrFail($id);
        $evaluation->update([
            'status' => 'submitted',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Penilaian mandiri berhasil dikirimkan ke tahap verifikasi.',
            'data' => new EvaluationResource($evaluation),
        ]);
    }
}
