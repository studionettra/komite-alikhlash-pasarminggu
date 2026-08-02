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
        $roleKorlas = Role::firstOrCreate(['name' => 'Korlas']);

        // Create Users

        // Pengurus Harian
        User::updateOrCreate(['email' => 'superadmin@komite.com'], [
            'name' => 'Mamah Una - BL2 (Eka Putri)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleSuperadmin);

        User::updateOrCreate(['email' => 'wakil_ketua@komite.com'], [
            'name' => 'Mamah Ghani - BL1 (Noval Aysha)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        User::updateOrCreate(['email' => 'sekretaris@komite.com'], [
            'name' => 'Mamah Daania - KBIT (Denissa)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleSekretaris);

        User::updateOrCreate(['email' => 'bendahara@komite.com'], [
            'name' => 'Mamah Sarah - B (Karima)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleBendahara);

        // Bidang Sosial Media
        User::updateOrCreate(['email' => 'ketua_sosmed@komite.com'], [
            'name' => 'Mamah Athar - KBIT (Novita Diah)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        User::updateOrCreate(['email' => 'anggota_sosmed_1@komite.com'], [
            'name' => 'Mamah Shanum - BL1 (Widiya)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        User::updateOrCreate(['email' => 'anggota_sosmed_2@komite.com'], [
            'name' => 'Mamah Baarik - B (Rosmanih)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        // Bidang Konsumsi
        User::updateOrCreate(['email' => 'ketua_konsumsi@komite.com'], [
            'name' => 'Mamah Razka - BL2 (Rahmawati)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        User::updateOrCreate(['email' => 'anggota_konsumsi_1@komite.com'], [
            'name' => 'Mamah Ryu - A1 (Tuti Alawiyah)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        User::updateOrCreate(['email' => 'anggota_konsumsi_2@komite.com'], [
            'name' => 'Mamah Rayya - A1 (Nabila Rivmi)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        // Bidang Humas
        User::updateOrCreate(['email' => 'ketua_humas@komite.com'], [
            'name' => 'Mamah Fath - A2 (Nurlaila Zahra)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        User::updateOrCreate(['email' => 'anggota_humas@komite.com'], [
            'name' => 'Mamah Thariq - A2 (Kunairoh)',
            'password' => Hash::make('password123'),
        ])->assignRole($roleAnggota);

        // Default Korlas
        User::updateOrCreate(['email' => 'korlas@komite.com'], [
            'name' => 'Korlas',
            'password' => Hash::make('password123'),
        ])->assignRole($roleKorlas);
    }
}
