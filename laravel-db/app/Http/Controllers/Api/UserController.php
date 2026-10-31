<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Tag(
 *     name="Users Management",
 *     description="User Account Management for Administrator"
 * )
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/master/users",
     *     tags={"Users Management"},
     *     summary="List all users",
     *     @OA\Response(response=200, description="List of users")
     * )
     */
    public function index()
    {
        $users = User::with('workUnit')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/master/users",
     *     tags={"Users Management"},
     *     summary="Create new user",
     *     @OA\Response(response=201, description="User created successfully")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'nip' => 'nullable|string|max:50|unique:users,nip',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,koordinator,penanggung_jawab,pelaksana_entri,pelaksana_unit',
            'status' => 'required|in:active,inactive',
            'work_unit_id' => 'nullable|exists:work_units,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil ditambahkan.',
            'data' => new UserResource($user->load('workUnit')),
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/master/users/{id}",
     *     tags={"Users Management"},
     *     summary="Update user details",
     *     @OA\Response(response=200, description="User updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'nip' => 'nullable|string|max:50|unique:users,nip,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,koordinator,penanggung_jawab,pelaksana_entri,pelaksana_unit',
            'status' => 'required|in:active,inactive',
            'work_unit_id' => 'nullable|exists:work_units,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil diperbarui.',
            'data' => new UserResource($user->load('workUnit')),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/master/users/{id}",
     *     tags={"Users Management"},
     *     summary="Delete user account",
     *     @OA\Response(response=200, description="User deleted")
     * )
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus.',
        ]);
    }
}
