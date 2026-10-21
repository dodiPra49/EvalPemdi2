<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            WorkUnitSeeder::class,
            UserSeeder::class,
            AspectIndicatorSeeder::class,
            MaturityLevelCriteriaSeeder::class,
            MaturityTemplateSeeder::class,
        ]);
    }
}
