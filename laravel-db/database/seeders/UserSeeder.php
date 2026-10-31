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
        $bappedaId = DB::table('work_units')->where('code', 'BAPPEDA-01')->value('id');
        $inspektoratId = DB::table('work_units')->where('code', 'INSPEKTORAT-01')->value('id');
        $disdukcapilId = DB::table('work_units')->where('code', 'DISDUKCAPIL-01')->value('id');
        $bkpsdmId = DB::table('work_units')->where('code', 'BKPSDM-01')->value('id');

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
                'name' => 'Operator Evaluasi Diskominfo',
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
                'name' => 'Penanggung Jawab Diskominfo',
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
                'name' => 'Operator Evaluasi BAPPEDA',
                'nip' => '199103142016021001',
                'email' => 'operator.bappeda@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'pelaksana_entri',
                'work_unit_id' => $bappedaId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Operator Evaluasi Inspektorat',
                'nip' => '198809222014031002',
                'email' => 'operator.inspektorat@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'pelaksana_entri',
                'work_unit_id' => $inspektoratId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Operator Evaluasi Disdukcapil',
                'nip' => '199307182019012003',
                'email' => 'operator.disdukcapil@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'pelaksana_entri',
                'work_unit_id' => $disdukcapilId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Operator Evaluasi BKPSDM',
                'nip' => '199011052015041004',
                'email' => 'operator.bkpsdm@pemdi.go.id',
                'password' => Hash::make('password123'),
                'role' => 'pelaksana_entri',
                'work_unit_id' => $bkpsdmId,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            if ($userData['work_unit_id']) {
                DB::table('users')->updateOrInsert(
                    ['email' => $userData['email']],
                    $userData
                );
            }
        }
    }
}
