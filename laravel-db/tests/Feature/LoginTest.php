<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_lists_distinct_ippd_names_from_users(): void
    {
        User::factory()->create(['name' => 'Dinas A']);
        User::factory()->create(['name' => 'Dinas A']);
        User::factory()->create(['name' => 'Dinas B']);

        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/Login')
                ->where('ippdNames', ['Dinas A', 'Dinas B'])
            );
    }

    public function test_user_can_login_with_ippd_name_and_password(): void
    {
        $user = User::factory()->create([
            'name' => 'Dinas Pengujian',
            'password' => 'secret-password',
        ]);

        $this->post(route('login'), [
            'login' => $user->name,
            'password' => 'secret-password',
        ])
            ->assertRedirect(route('user.evaluasi'));

        $this->assertAuthenticatedAs($user);
    }
}
