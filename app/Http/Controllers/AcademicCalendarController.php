<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    public function index(Request $request)
    {
        // Get the requested year or default to active
        $query = AcademicYear::with(['months.activities', 'months.learningPrograms']);

        if ($request->has('year_id')) {
            $year = $query->findOrFail($request->year_id);
        } else {
            $year = $query->where('is_active', true)->first();
            if (! $year) {
                $year = $query->latest()->first();
            }
        }

        $allYears = AcademicYear::orderBy('name', 'desc')->get();

        return Inertia::render('public/AcademicCalendar', [
            'academicYear' => $year,
            'allYears' => $allYears,
        ]);
    }
}
