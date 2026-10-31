<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AspectResource;
use App\Http\Resources\IndicatorResource;
use App\Models\Aspect;
use App\Models\Indicator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * @OA\Tag(
 *     name="Master Data",
 *     description="Aspects, Indicators, and Maturity Levels"
 * )
 */
class AspectController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/master/aspects",
     *     tags={"Master Data"},
     *     summary="List all 7 aspects with 20 indicators and maturity levels",
     *     @OA\Response(
     *         response=200,
     *         description="List of aspects",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/AspectResource"))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $aspects = Aspect::with(['indicators.maturityLevels', 'indicators.templates'])
            ->orderBy('order_index')
            ->get();

        return response()->json([
            'success' => true,
            'data' => AspectResource::collection($aspects),
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/master/indicators/{id}",
     *     tags={"Master Data"},
     *     summary="Get indicator detail with maturity levels and criteria",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Indicator detail")
     * )
     */
    public function showIndicator($id)
    {
        $indicator = Indicator::with(['aspect', 'maturityLevels', 'templates'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new IndicatorResource($indicator),
        ]);
    }
}
