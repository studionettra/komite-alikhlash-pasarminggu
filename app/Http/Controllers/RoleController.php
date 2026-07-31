<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:roles,name']);

        Role::create(['name' => $request->name]);

        Alert::success('Berhasil', 'Role baru ditambahkan.');

        return back();
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'Superadmin') {
            Alert::error('Gagal', 'Role Superadmin tidak dapat dihapus.');

            return back();
        }

        $role->delete();
        Alert::success('Berhasil', 'Role dihapus.');

        return back();
    }
}
