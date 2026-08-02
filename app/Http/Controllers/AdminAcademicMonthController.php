<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\AcademicMonth;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminAcademicMonthController extends Controller
{
    public function store(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer',
            'effective_days' => 'nullable|string|max:255',
        ]);

        $maxOrder = $academicYear->months()->max('order_index') ?? 0;
        $data['order_index'] = $maxOrder + 1;

        $academicYear->months()->create($data);

        Alert::success('Berhasil', 'Bulan berhasil ditambahkan.');

        return back();
    }

    public function edit(AcademicMonth $academicMonth)
    {
        $academicMonth->load(['activities', 'learningPrograms']);

        return Inertia::render('academic-calendars/EditMonth', [
            'month' => $academicMonth,
            'academicYear' => $academicMonth->academicYear,
        ]);
    }

    public function update(Request $request, AcademicMonth $academicMonth)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer',
            'effective_days' => 'nullable|string|max:255',
            'activities' => 'array',
            'activities.*.id' => 'nullable|integer',
            'activities.*.date_string' => 'nullable|string',
            'activities.*.name' => 'required|string',
            'activities.*.description' => 'nullable|string',
            'activities.*.is_committee_program' => 'boolean',
            'learning_programs' => 'array',
            'learning_programs.*.id' => 'nullable|integer',
            'learning_programs.*.week_string' => 'nullable|string',
            'learning_programs.*.topic' => 'nullable|string',
            'learning_programs.*.date_string' => 'nullable|string',
            'learning_programs.*.sub_topic' => 'nullable|string',
            'learning_programs.*.description' => 'nullable|string',
        ]);

        DB::transaction(function () use ($data, $academicMonth) {
            $academicMonth->fill([
                'name' => $data['name'],
                'year' => $data['year'],
                'effective_days' => $data['effective_days'],
            ])->save();

            // Sync activities
            $existingActivityIds = $academicMonth->activities()->pluck('id')->toArray();
            $incomingActivityIds = collect($data['activities'] ?? [])->pluck('id')->filter()->toArray();

            // Delete removed activities
            $activitiesToDelete = array_diff($existingActivityIds, $incomingActivityIds);
            if (! empty($activitiesToDelete)) {
                $academicMonth->activities()->whereIn('id', $activitiesToDelete)->delete();
            }

            // Update or create activities
            foreach ($data['activities'] ?? [] as $activity) {
                if (isset($activity['id'])) {
                    $academicMonth->activities()->where('id', $activity['id'])->update($activity);
                } else {
                    $academicMonth->activities()->create($activity);
                }
            }

            // Sync learning programs
            $existingProgramIds = $academicMonth->learningPrograms()->pluck('id')->toArray();
            $incomingProgramIds = collect($data['learning_programs'] ?? [])->pluck('id')->filter()->toArray();

            // Delete removed programs
            $programsToDelete = array_diff($existingProgramIds, $incomingProgramIds);
            if (! empty($programsToDelete)) {
                $academicMonth->learningPrograms()->whereIn('id', $programsToDelete)->delete();
            }

            // Update or create programs
            foreach ($data['learning_programs'] ?? [] as $program) {
                if (isset($program['id'])) {
                    $academicMonth->learningPrograms()->where('id', $program['id'])->update($program);
                } else {
                    $academicMonth->learningPrograms()->create($program);
                }
            }
        });

        Alert::success('Berhasil', 'Data bulan berhasil diperbarui.');

        return back();
    }

    public function destroy(AcademicMonth $academicMonth)
    {
        if ($academicMonth->activities()->exists() || $academicMonth->learningPrograms()->exists()) {
            Alert::error('Gagal', 'Tidak dapat menghapus bulan ini karena masih memiliki kegiatan atau program pembelajaran.');

            return back();
        }

        AcademicMonth::destroy($academicMonth->id);

        Alert::deleteSuccess('Berhasil', 'Bulan berhasil dihapus.');

        return back();
    }
}
