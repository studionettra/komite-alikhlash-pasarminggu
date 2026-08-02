<?php

namespace App\Http\Controllers\Korlas;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isSuperadmin = $user->hasRole('Superadmin');
        $allClassrooms = [];

        if ($isSuperadmin) {
            $allClassrooms = Classroom::orderBy('name', 'asc')->get();
            $classroomId = $request->input('classroom_id');
            
            if ($classroomId) {
                $classroom = Classroom::find($classroomId);
            } else {
                $classroom = $allClassrooms->first();
            }
        } else {
            $classroom = $user->classrooms()->first();
        }

        if (! $classroom) {
            return redirect()->back()->with('error', $isSuperadmin ? 'Belum ada kelas satupun di dalam sistem.' : 'Anda belum memiliki kelas yang ditugaskan.');
        }

        $students = Student::where('classroom_id', $classroom->id)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('korlas/students/Index', [
            'classroom' => $classroom,
            'students' => $students,
            'allClassrooms' => $allClassrooms,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_name' => 'nullable|string|max:255',
            'classroom_id' => 'sometimes|exists:classrooms,id',
        ]);

        $user = $request->user();
        if ($user->hasRole('Superadmin')) {
            $classroom = Classroom::findOrFail($request->input('classroom_id'));
        } else {
            $classroom = $user->classrooms()->firstOrFail();
        }

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

        if (! $request->user()->hasRole('Superadmin')) {
            $classroom = $request->user()->classrooms()->firstOrFail();
            if ($student->classroom_id !== $classroom->id) {
                abort(403, 'Unauthorized action.');
            }
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
        if (! $request->user()->hasRole('Superadmin')) {
            $classroom = $request->user()->classrooms()->firstOrFail();
            if ($student->classroom_id !== $classroom->id) {
                abort(403, 'Unauthorized action.');
            }
        }

        $student->delete();

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus.');
    }
}
