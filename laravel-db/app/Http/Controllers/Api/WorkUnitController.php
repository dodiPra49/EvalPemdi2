<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkUnitResource;
use App\Models\WorkUnit;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Work Units",
 *     description="Management of OPD / Perangkat Daerah"
 * )
 */
class WorkUnitController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/master/units",
     *     tags={"Work Units"},
     *     summary="List all registered work units",
     *     @OA\Response(response=200, description="List of work units")
     * )
     */
    public function index()
    {
        $units = WorkUnit::withCount('users')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => WorkUnitResource::collection($units),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/master/units",
     *     tags={"Work Units"},
     *     summary="Create new work unit",
     *     @OA\Response(response=201, description="Unit created successfully")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:work_units,code',
            'category' => 'required|in:Pusat,Daerah',
            'pic_name' => 'nullable|string|max:255',
            'pic_contact' => 'nullable|string|max:50',
        ]);

        $unit = WorkUnit::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Unit kerja berhasil ditambahkan.',
            'data' => new WorkUnitResource($unit),
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/master/units/{id}",
     *     tags={"Work Units"},
     *     summary="Update work unit details",
     *     @OA\Response(response=200, description="Unit updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $unit = WorkUnit::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:work_units,code,' . $unit->id,
            'category' => 'required|in:Pusat,Daerah',
            'pic_name' => 'nullable|string|max:255',
            'pic_contact' => 'nullable|string|max:50',
        ]);

        $unit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Unit kerja berhasil diperbarui.',
            'data' => new WorkUnitResource($unit),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/master/units/{id}",
     *     tags={"Work Units"},
     *     summary="Delete a work unit",
     *     @OA\Response(response=200, description="Unit deleted")
     * )
     */
    public function destroy($id)
    {
        $unit = WorkUnit::findOrFail($id);
        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit kerja berhasil dihapus.',
        ]);
    }
}
