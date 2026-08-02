<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $role = $request->user()->roles->first()->name ?? '';
        if (! in_array($role, ['Superadmin', 'Sekretaris'])) {
            Alert::error('Akses Ditolak', 'Hanya Sekretaris dan Ketua Komite yang dapat mengunggah dokumen.');

            return back();
        }

        $request->validate([
            'program_id' => 'nullable|exists:programs,id',
            'program_activity_id' => 'nullable|exists:program_activities,id',
            'meeting_id' => 'nullable|exists:meetings,id',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120', // Max 5MB
        ]);

        if (! $request->program_id && ! $request->meeting_id && ! $request->program_activity_id) {
            Alert::error('Gagal', 'Dokumen harus terhubung dengan program, sesi program, atau rapat.');

            return back();
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('documents', 'public');

            Document::create([
                'program_id' => $request->program_id,
                'program_activity_id' => $request->program_activity_id,
                'meeting_id' => $request->meeting_id,
                'file_path' => $path,
                'file_type' => $file->getClientOriginalExtension(),
            ]);

            Alert::success('Berhasil', 'Dokumen berhasil diunggah.');
        }

        return back();
    }

    public function destroy(Request $request, Document $document)
    {
        $role = $request->user()->roles->first()->name ?? '';
        if (! in_array($role, ['Superadmin', 'Sekretaris'])) {
            Alert::error('Akses Ditolak', 'Hanya Sekretaris dan Ketua Komite yang dapat menghapus dokumen.');

            return back();
        }

        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();
        Alert::deleteSuccess('Berhasil', 'Dokumen berhasil dihapus.');

        return back();
    }
}
