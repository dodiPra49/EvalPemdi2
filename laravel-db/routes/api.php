<?php

use App\Http\Controllers\Api\AspectController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\OpenApiController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkUnitController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - EVAL-PEMDI 2026 (Eloquent API Resources & OpenAPI)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // OpenAPI Specification
    Route::get('/openapi.json', [OpenApiController::class, 'spec']);

    // Authentication Public
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Master Data Public / Semi-Public
    Route::get('/master/aspects', [AspectController::class, 'index']);
    Route::get('/master/indicators/{id}', [AspectController::class, 'showIndicator']);

    // Protected Routes (Sanctum / Session)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Evaluation Endpoints
        Route::get('/evaluations/current', [EvaluationController::class, 'current']);
        Route::post('/evaluations/save-answer', [EvaluationController::class, 'saveAnswer']);
        Route::post('/evaluations/upload-evidence', [EvaluationController::class, 'uploadEvidence']);
        Route::delete('/evaluations/evidence/{id}', [EvaluationController::class, 'deleteEvidence']);
        Route::get('/evaluations/{id}/calculate-score', [EvaluationController::class, 'calculateScore']);
        Route::post('/evaluations/{id}/submit', [EvaluationController::class, 'submit']);

        // Admin Master Data CRUD
        Route::apiResource('/master/units', WorkUnitController::class);
        Route::apiResource('/master/users', UserController::class);
        Route::apiResource('/master/templates', TemplateController::class);
    });

    // Fallback unauthenticated access for testing Master APIs
    Route::get('/master/units', [WorkUnitController::class, 'index']);
    Route::get('/master/users', [UserController::class, 'index']);
    Route::get('/master/templates', [TemplateController::class, 'index']);
    Route::get('/evaluations/{id}/calculate-score', [EvaluationController::class, 'calculateScore']);
});
