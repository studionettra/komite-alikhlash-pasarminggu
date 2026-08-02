<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\ProgramActivity;
use Illuminate\Http\Request;

class ProgramActivityController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'title' => 'required|string|max:255',
            'activity_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'description' => 'nullable|string',
        ]);

        ProgramActivity::create($validated);
        Alert::success('Berhasil', 'Sesi program berhasil ditambahkan.');

        return back();
    }

    public function update(Request $request, ProgramActivity $programActivity)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'activity_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'description' => 'nullable|string',
        ]);

        $programActivity->update($validated);
        Alert::success('Berhasil', 'Sesi program diperbarui.');

        return back();
    }

    public function destroy(ProgramActivity $programActivity)
    {
        if ($programActivity->transactions()->exists()) {
            Alert::error('Gagal', 'Sesi program tidak dapat dihapus karena masih memiliki riwayat transaksi keuangan. Hapus transaksi terlebih dahulu.');

            return back();
        }

        if ($programActivity->documents()->exists()) {
            Alert::error('Gagal', 'Sesi program tidak dapat dihapus karena masih memiliki lampiran dokumen/laporan. Hapus laporan terlebih dahulu.');

            return back();
        }

        $programActivity->delete();
        Alert::deleteSuccess('Berhasil', 'Sesi program dihapus.');

        return back();
    }
}
