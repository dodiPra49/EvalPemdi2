<?php

namespace Tests\Feature;

use App\Models\Aspect;
use App\Models\Evaluation;
use App\Models\Indicator;
use App\Models\User;
use App\Models\WorkUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserIndicatorAssignmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_user_with_responsible_indicators(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $indicators = $this->createIndicators();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/master/users', [
            'name' => 'Pengguna Baru',
            'email' => 'pengguna.baru@example.test',
            'nip' => '123456789',
            'password' => 'secret-password',
            'status' => 'active',
            'work_unit_id' => null,
            'responsible_indicator_ids' => [$indicators[0]->id],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Pengguna Baru')
            ->assertJsonCount(1, 'data.responsible_indicators');

        $this->assertDatabaseHas('users', [
            'email' => 'pengguna.baru@example.test',
            'role' => 'pelaksana_entri',
        ]);
    }

    public function test_admin_can_save_indicator_assignments_without_changing_user_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'koordinator']);
        $indicators = $this->createIndicators();

        $response = $this->actingAs($admin, 'web')
            ->withHeader('Origin', 'http://localhost')
            ->putJson("/api/v1/master/users/{$user->id}", [
                'name' => $user->name,
                'email' => $user->email,
                'nip' => $user->nip,
                'password' => '',
                'status' => 'active',
                'work_unit_id' => null,
                'responsible_indicator_ids' => [$indicators[0]->id, $indicators[1]->id],
            ]);

        $response->assertOk()
            ->assertJsonPath('data.role', 'koordinator')
            ->assertJsonCount(2, 'data.responsible_indicators');

        $this->assertEquals(
            [$indicators[0]->id, $indicators[1]->id],
            $user->fresh()->indicators()->orderBy('indicators.id')->pluck('indicators.id')->all()
        );
    }

    public function test_user_evaluation_only_contains_assigned_indicators(): void
    {
        $unit = WorkUnit::create([
            'name' => 'Unit Uji',
            'code' => 'UNIT-UJI',
            'category' => 'Daerah',
        ]);
        $user = User::factory()->create(['work_unit_id' => $unit->id]);
        [$assigned, $unassigned] = $this->createIndicators();
        $user->indicators()->attach($assigned->id);

        $this->actingAs($user)->get('/evaluasi')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('User/Evaluasi')
                ->has('initialAspects', 1)
                ->has('initialAspects.0.indicators', 1)
                ->where('initialAspects.0.indicators.0.id', $assigned->id)
                ->missing('initialAspects.0.indicators.1')
            );
    }

    public function test_user_cannot_save_an_unassigned_indicator(): void
    {
        $unit = WorkUnit::create([
            'name' => 'Unit Uji',
            'code' => 'UNIT-UJI',
            'category' => 'Daerah',
        ]);
        $user = User::factory()->create(['work_unit_id' => $unit->id]);
        [$assigned, $unassigned] = $this->createIndicators();
        $user->indicators()->attach($assigned->id);
        $evaluation = Evaluation::create([
            'work_unit_id' => $unit->id,
            'evaluator_user_id' => $user->id,
            'year' => 2026,
            'final_index_pemdi' => 1,
            'predicate' => 'Kurang / Merintis',
            'status' => 'draft',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/evaluations/save-answer', [
                'evaluation_id' => $evaluation->id,
                'indicator_id' => $unassigned->id,
            ])
            ->assertForbidden();
    }

    private function createIndicators(): array
    {
        $aspect = Aspect::create([
            'code' => 'ASPEK-UJI',
            'name' => 'Aspek Uji',
            'weight' => 100,
            'order_index' => 1,
        ]);

        return collect([1, 2])->map(fn (int $number) => Indicator::create([
            'aspect_id' => $aspect->id,
            'indicator_number' => $number,
            'name' => "Indikator Uji {$number}",
            'weight' => 50,
        ]))->all();
    }
}
