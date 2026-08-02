<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index()
    {
        $classrooms = Classroom::with('korlas')->orderBy('name', 'asc')->get();
        $korlasUsers = User::role('Korlas')->orderBy('name', 'asc')->get();

        return Inertia::render('admin/classrooms/Index', [
            'classrooms' => $classrooms,
            'korlasUsers' => $korlasUsers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:classrooms,name',
            'korlas_id' => 'nullable|exists:users,id',
        ]);

        Classroom::create([
            'name' => $request->name,
            'korlas_id' => $request->korlas_id,
        ]);

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Classroom $classroom)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:classrooms,name,'.$classroom->id,
            'korlas_id' => 'nullable|exists:users,id',
        ]);

        $classroom->update([
            'name' => $request->name,
            'korlas_id' => $request->korlas_id,
        ]);

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }
}
