<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            [
                'name' => 'Sekretariat Daerah',
                'code' => 'SETDA-01',
                'category' => 'Daerah',
                'pic_name' => 'Sekretaris Daerah',
                'pic_contact' => 'setda@pemda.go.id',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dinas Komunikasi, Informatika, dan Statistik',
                'code' => 'DISKOMINFO-01',
                'category' => 'Daerah',
                'pic_name' => 'Kepala Dinas Kominfo',
                'pic_contact' => 'diskominfo@pemda.go.id',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Badan Perencanaan Pembangunan Daerah (BAPPEDA)',
                'code' => 'BAPPEDA-01',
                'category' => 'Daerah',
                'pic_name' => 'Kepala Bappeda',
                'pic_contact' => 'bappeda@pemda.go.id',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Inspektorat Daerah',
                'code' => 'INSPEKTORAT-01',
                'category' => 'Daerah',
                'pic_name' => 'Inspektur Daerah',
                'pic_contact' => 'inspektorat@pemda.go.id',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dinas Kependudukan dan Pencatatan Sipil',
                'code' => 'DISDUKCAPIL-01',
                'category' => 'Daerah',
                'pic_name' => 'Kepala Disdukcapil',
                'pic_contact' => 'disdukcapil@pemda.go.id',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM)',
                'code' => 'BKPSDM-01',
                'category' => 'Daerah',
                'pic_name' => 'Kepala BKPSDM',
                'pic_contact' => 'bkpsdm@pemda.go.id',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('work_units')->upsert($units, ['code'], ['name', 'category', 'pic_name', 'pic_contact', 'updated_at']);
    }
}
