<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->paginate(10);
        $roles = Role::all();

        return Inertia::render('users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|exists:roles,name',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole($request->role);
            DB::commit();
            Alert::success('Berhasil', 'Pengguna baru ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Alert::error('Gagal', 'Terjadi kesalahan saat menyimpan data.');
        }

        return back();
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|string|exists:roles,name',
        ]);

        DB::beginTransaction();
        try {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }

            $user->syncRoles([$request->role]);
            DB::commit();
            Alert::success('Berhasil', 'Data pengguna diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Alert::error('Gagal', 'Terjadi kesalahan saat menyimpan data.');
        }

        return back();
    }

    public function destroy(User $user)
    {
        if ($user->hasRole('Superadmin') && User::role('Superadmin')->count() === 1) {
            Alert::error('Gagal', 'Tidak dapat menghapus satu-satunya Superadmin.');

            return back();
        }

        $user->delete();
        Alert::success('Berhasil', 'Pengguna dihapus.');

        return back();
    }
}
