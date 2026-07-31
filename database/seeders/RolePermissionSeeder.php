<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles
        $roleSuperadmin = Role::firstOrCreate(['name' => 'Superadmin']);
        $roleBendahara = Role::firstOrCreate(['name' => 'Bendahara']);
        $roleSekretaris = Role::firstOrCreate(['name' => 'Sekretaris']);
        $roleAnggota = Role::firstOrCreate(['name' => 'Anggota Komite']);

        // Create Superadmin User
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@komite.com'],
            [
                'name' => 'Ketua Komite',
                'password' => Hash::make('password123'),
            ]
        );
        $superadmin->assignRole($roleSuperadmin);

        $bendahara = User::firstOrCreate(
            ['email' => 'bendahara@komite.com'],
            [
                'name' => 'Bendahara Komite',
                'password' => Hash::make('password123'),
            ]
        );
        $bendahara->assignRole($roleBendahara);

        $sekretaris = User::firstOrCreate(
            ['email' => 'sekretaris@komite.com'],
            [
                'name' => 'Sekretaris Komite',
                'password' => Hash::make('password123'),
            ]
        );
        $sekretaris->assignRole($roleSekretaris);

        $anggota = User::firstOrCreate(
            ['email' => 'anggota@komite.com'],
            [
                'name' => 'Anggota Biasa',
                'password' => Hash::make('password123'),
            ]
        );
        $anggota->assignRole($roleAnggota);
    }
}
