<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAcademicYearController extends Controller
{
    public function index()
    {
        $years = AcademicYear::withCount('months')->orderBy('name', 'desc')->get();

        return Inertia::render('academic-calendars/Index', [
            'years' => $years,
        ]);
    }

    public function show(AcademicYear $academicYear)
    {
        $academicYear->load(['months' => function ($query) {
            $query->orderBy('order_index');
        }]);

        return Inertia::render('academic-calendars/Show', [
            'academicYear' => $academicYear,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($data['is_active'] ?? false) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        AcademicYear::create($data);

        Alert::success('Berhasil', 'Tahun Ajaran berhasil ditambahkan.');

        return back();
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($data['is_active'] ?? false) {
            AcademicYear::where('is_active', true)->where('id', '!=', $academicYear->id)->update(['is_active' => false]);
        }

        $academicYear->update($data);

        Alert::success('Berhasil', 'Tahun Ajaran berhasil diperbarui.');

        return back();
    }

    public function destroy(AcademicYear $academicYear)
    {
        if ($academicYear->months()->exists()) {
            Alert::error('Gagal', 'Tidak dapat menghapus Tahun Ajaran karena masih berisi data bulan.');

            return back();
        }

        $academicYear->delete();
        Alert::deleteSuccess('Berhasil', 'Tahun Ajaran berhasil dihapus.');

        return back();
    }
}
