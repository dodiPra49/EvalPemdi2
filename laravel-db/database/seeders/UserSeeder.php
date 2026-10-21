<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $diskominfoId = DB::table('work_units')->where('code', 'DISKOMINFO-01')->value('id');
        $setdaId = DB::table('work_units')->where('code', 'SETDA-01')->value('id');

        $users = [
            [
                'name' => 'Administrator Portal Pemdi',
                'nip' => '198501012010011001',
                'email' => 'admin@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'work_unit_id' => $diskominfoId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Koordinator Pemdi (Sekda)',
                'nip' => '197502121998031002',
                'email' => 'koordinator@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'koordinator',
                'work_unit_id' => $setdaId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Penanggung Jawab Unsur Pejabat',
                'nip' => '198003152005011003',
                'email' => 'pejabat@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'penanggung_jawab',
                'work_unit_id' => $diskominfoId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Operator Evaluasi (Pelaksana Entri Data)',
                'nip' => '199205202018011004',
                'email' => 'operator@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'pelaksana_entri',
                'work_unit_id' => $diskominfoId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pelaksana Unit Kerja Diskominfo',
                'nip' => '199507112020011005',
                'email' => 'unit@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'pelaksana_unit',
                'work_unit_id' => $diskominfoId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            DB::table('users')->updateOrInsert(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
