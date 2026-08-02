<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'title' => 'Kas Umum / Belum Terikat',
                'description' => 'Dana kas umum atau yang belum terikat pada program tertentu.',
                'frequency' => 'incidental',
                'status' => 'ongoing',
                'start_date' => null,
            ],
            [
                'title' => 'Jumat Berkah',
                'description' => 'Program Jumat Berkah rutin.',
                'frequency' => 'monthly',
                'status' => 'planned',
                'start_date' => null,
            ],
            [
                'title' => 'Lomba HUT RI ke 81',
                'description' => 'Kegiatan perlombaan dalam rangka memperingati HUT RI ke-81.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2026-08-18',
            ],
            [
                'title' => 'Makan Sehat Bersama',
                'description' => 'Kegiatan makan sehat bersama anak-anak dan guru.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => null,
            ],
            [
                'title' => 'Sumbangan Kesehatan',
                'description' => 'Penggalangan dana dan pemberian sumbangan untuk kesehatan.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => null,
            ],
            [
                'title' => 'Renang',
                'description' => 'Kegiatan ekstrakurikuler atau rutin renang siswa.',
                'frequency' => 'monthly',
                'status' => 'planned',
                'start_date' => null,
            ],
            [
                'title' => 'Market Day',
                'description' => 'Kegiatan Market Day melatih jiwa wirausaha anak.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2026-09-24',
            ],
            [
                'title' => 'Peringatan Hari Guru',
                'description' => 'Peringatan Hari Guru Nasional.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2026-11-25',
            ],
            [
                'title' => 'Family Gathering',
                'description' => 'Kegiatan kumpul bersama keluarga (Family Gathering).',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2027-01-16', // Adjusting year to be future (2027) instead of past 2026
            ],
            [
                'title' => 'Halal Bihalal',
                'description' => 'Kegiatan silaturahmi dan Halal Bihalal.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2027-03-08',
            ],
            [
                'title' => 'Piknik Akhir Tahun',
                'description' => 'Piknik penutup akhir tahun ajaran.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2027-05-05',
            ],
            [
                'title' => 'Pelepasan & Pentas Seni',
                'description' => 'Acara pelepasan siswa dan pentas seni.',
                'frequency' => 'incidental',
                'status' => 'planned',
                'start_date' => '2027-06-19', // Adjusting year to 2027
            ],
        ];

        foreach ($programs as $data) {
            Program::firstOrCreate(
                ['title' => $data['title']],
                $data
            );
        }
    }
}
