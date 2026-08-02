<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use RealRashid\SweetAlert\Facades\Alert;

class SettingController extends Controller
{
    /**
     * Tampilkan halaman Pengaturan.
     */
    public function index()
    {
        $settingsPath = storage_path('app/settings.json');
        $settings = [];

        if (File::exists($settingsPath)) {
            $settings = json_decode(File::get($settingsPath), true) ?? [];
        }

        // Tampilkan Spreadsheet ID atau URL yang tersimpan
        $googleSpreadsheetId = $settings['google_spreadsheet_id'] ?? env('GOOGLE_SPREADSHEET_ID', '');

        // Buat format URL penuh agar mudah dipahami user
        $googleSpreadsheetUrl = $googleSpreadsheetId ? "https://docs.google.com/spreadsheets/d/{$googleSpreadsheetId}/edit" : '';

        return Inertia::render('admin/Settings', [
            'settings' => [
                'google_spreadsheet_url' => $googleSpreadsheetUrl,
            ],
        ]);
    }

    /**
     * Simpan pengaturan.
     */
    public function store(Request $request)
    {
        $request->validate([
            'google_spreadsheet_url' => 'required|url',
        ], [
            'google_spreadsheet_url.required' => 'URL Google Sheet wajib diisi.',
            'google_spreadsheet_url.url' => 'Format URL tidak valid.',
        ]);

        $url = $request->google_spreadsheet_url;
        $spreadsheetId = $this->extractSpreadsheetId($url);

        if (! $spreadsheetId) {
            return back()->withErrors(['google_spreadsheet_url' => 'URL Google Sheet tidak valid. Pastikan Anda mengkopi link langsung dari Google Sheets.']);
        }

        $settingsPath = storage_path('app/settings.json');
        $settings = [];

        if (File::exists($settingsPath)) {
            $settings = json_decode(File::get($settingsPath), true) ?? [];
        }

        $settings['google_spreadsheet_id'] = $spreadsheetId;

        File::put($settingsPath, json_encode($settings, JSON_PRETTY_PRINT));

        Alert::success('Berhasil', 'Pengaturan berhasil disimpan.');

        return back();
    }

    /**
     * Ekstrak ID dari URL Google Spreadsheet
     */
    private function extractSpreadsheetId($url)
    {
        // Contoh URL: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
        $pattern = '/\/d\/([a-zA-Z0-9-_]+)/';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
