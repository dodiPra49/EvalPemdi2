<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="User Authentication and Session Management"
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/auth/login",
     *     tags={"Authentication"},
     *     summary="User login with email or NIP",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"login", "password"},
     *             @OA\Property(property="login", type="string", example="admin@evalpemdi.go.id"),
     *             @OA\Property(property="password", type="string", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="user", ref="#/components/schemas/UserResource")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Invalid credentials")
     * )
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $login = $validated['login'];
        $user = User::with('workUnit')
            ->where(function ($query) use ($login) {
                $query->where('email', $login)
                      ->orWhere('nip', $login);
            })
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'NIP/Email atau kata sandi tidak sesuai.',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda sedang dinonaktifkan. Hubungi Administrator.',
            ], 403);
        }

        // Create Sanctum Token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/auth/me",
     *     tags={"Authentication"},
     *     summary="Get current authenticated user profile",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Profile details",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", ref="#/components/schemas/UserResource")
     *         )
     *     )
     * )
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('workUnit');

        return response()->json([
            'success' => true,
            'user' => new UserResource($user),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/logout",
     *     tags={"Authentication"},
     *     summary="Logout and revoke active token",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Logged out successfully")
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }
}
