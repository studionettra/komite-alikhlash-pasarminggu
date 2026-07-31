<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index()
    {
        $meetings = Meeting::with('documents')->orderBy('date', 'desc')->paginate(10);

        return Inertia::render('meetings/Index', [
            'meetings' => $meetings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'agenda' => 'required|string|max:255',
            'attendees' => 'nullable|string',
            'decisions' => 'required|string',
            'follow_up' => 'nullable|string',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $meeting = Meeting::create($validated);

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->storePublicly('meetings', 'public');
                $meeting->documents()->create([
                    'file_path' => $path,
                    'file_type' => $file->getClientOriginalExtension(),
                ]);
            }
        }

        Alert::success('Berhasil', 'Notulensi rapat berhasil ditambahkan.');

        return back();
    }

    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'agenda' => 'required|string|max:255',
            'attendees' => 'nullable|string',
            'decisions' => 'required|string',
            'follow_up' => 'nullable|string',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $meeting->update($validated);

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->storePublicly('meetings', 'public');
                $meeting->documents()->create([
                    'file_path' => $path,
                    'file_type' => $file->getClientOriginalExtension(),
                ]);
            }
        }

        Alert::success('Berhasil', 'Notulensi rapat diperbarui.');

        return back();
    }

    public function destroy(Meeting $meeting)
    {
        foreach ($meeting->documents as $doc) {
            if ($doc->file_path) {
                Storage::disk('public')->delete($doc->file_path);
            }
            $doc->delete();
        }
        
        $meeting->delete();
        Alert::success('Berhasil', 'Notulensi rapat dihapus.');

        return back();
    }
}
