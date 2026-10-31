<?php

namespace App\Http\Controllers;

use App\Http\Resources\AspectResource;
use App\Http\Resources\EvaluationResource;
use App\Http\Resources\MaturityTemplateResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\WorkUnitResource;
use App\Models\Aspect;
use App\Models\Evaluation;
use App\Models\MaturityTemplate;
use App\Models\User;
use App\Models\WorkUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WebController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('user.evaluasi');
        }

        return redirect()->route('login');
    }

    public function loginView()
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $login = $credentials['login'];
        $user = User::where('email', $login)
            ->orWhere('nip', $login)
            ->first();

        if (!$user || !password_verify($credentials['password'], $user->password)) {
            return back()->withErrors([
                'login' => 'NIP/Email atau kata sandi tidak valid.',
            ]);
        }

        if ($user->status !== 'active') {
            return back()->withErrors([
                'login' => 'Akun Anda sedang dinonaktifkan.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        if ($user->role === 'admin') {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('user.evaluasi'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function evaluasi(Request $request)
    {
        $user = Auth::user();
        $workUnitId = $user ? $user->work_unit_id : (WorkUnit::first()?->id ?? 1);
        if (!$workUnitId) {
            $workUnitId = 1;
        }

        $aspects = Aspect::with(['indicators.maturityLevels', 'indicators.templates'])
            ->orderBy('order_index')
            ->get();

        $evaluation = Evaluation::firstOrCreate(
            [
                'work_unit_id' => $workUnitId,
                'year' => (int) date('Y'),
            ],
            [
                'evaluator_user_id' => $user?->id,
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

        return Inertia::render('User/Evaluasi', [
            'initialAspects' => AspectResource::collection($aspects)->resolve(),
            'initialEvaluation' => (new EvaluationResource($evaluation))->resolve(),
        ]);
    }

    public function adminDashboard()
    {
        $totalUnits = WorkUnit::count();
        $totalUsers = User::count();
        $totalTemplates = MaturityTemplate::count();
        $evaluations = Evaluation::with('workUnit')->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_units' => $totalUnits,
                'total_users' => $totalUsers,
                'total_templates' => $totalTemplates,
                'active_evaluations' => $evaluations->count(),
            ],
            'recentEvaluations' => EvaluationResource::collection($evaluations)->resolve(),
        ]);
    }

    public function adminUsers()
    {
        $users = User::with('workUnit')->orderBy('name')->get();
        $units = WorkUnit::orderBy('name')->get();

        return Inertia::render('Admin/Users', [
            'initialUsers' => UserResource::collection($users)->resolve(),
            'workUnits' => WorkUnitResource::collection($units)->resolve(),
        ]);
    }

    public function adminUnits()
    {
        $units = WorkUnit::withCount('users')->orderBy('name')->get();

        return Inertia::render('Admin/Units', [
            'initialUnits' => WorkUnitResource::collection($units)->resolve(),
        ]);
    }

    public function adminTemplates()
    {
        $templates = MaturityTemplate::with(['indicator', 'maturityLevel'])
            ->orderBy('id', 'desc')
            ->get();

        $aspects = Aspect::with('indicators.maturityLevels')->orderBy('order_index')->get();

        return Inertia::render('Admin/Templates', [
            'initialTemplates' => MaturityTemplateResource::collection($templates)->resolve(),
            'aspects' => AspectResource::collection($aspects)->resolve(),
        ]);
    }
}
