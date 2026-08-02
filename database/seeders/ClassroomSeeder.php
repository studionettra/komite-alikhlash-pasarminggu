<?php

namespace Database\Seeders;

use App\Models\Classroom;
use Illuminate\Database\Seeder;

class ClassroomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = ['KBIT', 'A1', 'A2', 'B', 'BL1', 'BL2'];

        foreach ($classes as $className) {
            Classroom::firstOrCreate([
                'name' => $className,
            ], [
                'korlas_id' => null,
            ]);
        }
    }
}
