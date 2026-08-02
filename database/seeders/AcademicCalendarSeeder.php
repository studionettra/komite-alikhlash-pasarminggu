<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class AcademicCalendarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $yearName = '2026/2027';

        $academicYear = AcademicYear::firstOrCreate(
            ['name' => $yearName],
            ['is_active' => true]
        );

        // Delete old months to ensure clean re-seeding
        $academicYear->months()->delete();

        $filePath = base_path('docs/kalender-pendidikan-2026-2027.md');
        if (! File::exists($filePath)) {
            $this->command->warn("Markdown file not found at {$filePath}");

            return;
        }

        $content = File::get($filePath);

        // Split by month headers (e.g. ## JULI 2026)
        preg_match_all('/##\s+([A-Z]+)\s+(\d{4})\n(.*?)(?=\n##\s+[A-Z]+|\z)/s', $content, $matches, PREG_SET_ORDER);

        $orderIndex = 1;
        foreach ($matches as $match) {
            $monthName = ucfirst(strtolower($match[1]));
            $year = (int) $match[2];
            $monthBody = $match[3];

            // Extract HE
            $he = null;
            if (preg_match('/\*\*HE:\s*(.*?)\*\*/', $monthBody, $heMatch)) {
                $he = trim($heMatch[1]);
            }

            $month = $academicYear->months()->firstOrCreate([
                'name' => $monthName,
                'year' => $year,
            ], [
                'effective_days' => $he,
                'order_index' => $orderIndex++,
            ]);

            // Extract Kegiatan Table
            if (preg_match('/###\s+Kegiatan\s*\n.*?\|---\|---\|---\|\n(.*?)(?=\n###|\n\n\n|\z)/s', $monthBody, $kegiatanMatch)) {
                $kegiatanRows = explode("\n", trim($kegiatanMatch[1]));
                foreach ($kegiatanRows as $row) {
                    $cols = array_map('trim', explode('|', trim($row, '|')));
                    if (count($cols) >= 3) {
                        $month->activities()->firstOrCreate([
                            'date_string' => $cols[0] === '-' ? null : $cols[0],
                            'name' => $cols[1],
                            'description' => $cols[2] === '-' ? null : $cols[2],
                        ]);
                    }
                }
            }

            // Extract Program Pembelajaran Table
            if (preg_match('/###\s+Program Pembelajaran\s*\n.*?\|---\|---\|---\|---\|---\|\n(.*?)(?=\n###|\n---|\z)/s', $monthBody, $programMatch)) {
                $programRows = explode("\n", trim($programMatch[1]));
                foreach ($programRows as $row) {
                    $cols = array_map('trim', explode('|', trim($row, '|')));
                    if (count($cols) >= 5) {
                        $month->learningPrograms()->firstOrCreate([
                            'week_string' => $cols[0] === '-' ? null : $cols[0],
                            'topic' => $cols[1] === '-' ? null : $cols[1],
                            'date_string' => $cols[2] === '-' ? null : $cols[2],
                            'sub_topic' => $cols[3] === '-' ? null : $cols[3],
                            'description' => $cols[4] === '-' ? null : $cols[4],
                        ]);
                    }
                }
            }
        }
    }
}
