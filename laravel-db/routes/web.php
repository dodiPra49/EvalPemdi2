<?php

use App\Http\Controllers\Api\OpenApiController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Inertia.js React Application & Swagger Documentation
|--------------------------------------------------------------------------
*/

// Swagger UI Documentation
Route::get('/api/documentation', [OpenApiController::class, 'ui'])->name('api.documentation');

// Root redirect
Route::get('/', [WebController::class, 'index'])->name('home');

// Authentication
Route::get('/login', [WebController::class, 'loginView'])->name('login');
Route::post('/login', [WebController::class, 'login']);
Route::post('/logout', [WebController::class, 'logout'])->name('logout');

// User Portal (Self-Assessment 20 Indikator)
Route::middleware('auth')->group(function () {
    Route::get('/evaluasi', [WebController::class, 'evaluasi'])->name('user.evaluasi');

    // Admin Panel Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [WebController::class, 'adminDashboard'])->name('admin.dashboard');
        Route::get('/users', [WebController::class, 'adminUsers'])->name('admin.users');
        Route::get('/units', [WebController::class, 'adminUnits'])->name('admin.units');
        Route::get('/templates', [WebController::class, 'adminTemplates'])->name('admin.templates');
    });
});
