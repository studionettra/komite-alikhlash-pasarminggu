<?php

namespace App\Http\Controllers\Korlas;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $classroom = $user->classrooms()->first();

        if (! $classroom) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelas yang ditugaskan.');
        }

        $students = Student::where('classroom_id', $classroom->id)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('korlas/students/Index', [
            'classroom' => $classroom,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_name' => 'nullable|string|max:255',
        ]);

        $classroom = $request->user()->classrooms()->firstOrFail();

        Student::create([
            'classroom_id' => $classroom->id,
            'name' => $request->name,
            'parent_name' => $request->parent_name,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_name' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $classroom = $request->user()->classrooms()->firstOrFail();

        if ($student->classroom_id !== $classroom->id) {
            abort(403, 'Unauthorized action.');
        }

        $student->update([
            'name' => $request->name,
            'parent_name' => $request->parent_name,
            'is_active' => $request->is_active ?? $student->is_active,
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(Request $request, Student $student)
    {
        $classroom = $request->user()->classrooms()->firstOrFail();

        if ($student->classroom_id !== $classroom->id) {
            abort(403, 'Unauthorized action.');
        }

        $student->delete();

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus.');
    }
}
