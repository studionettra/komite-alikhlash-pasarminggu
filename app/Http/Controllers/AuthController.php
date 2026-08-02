<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'cf-turnstile-response' => ['required'],
        ], [
            'cf-turnstile-response.required' => 'Silakan verifikasi keamanan terlebih dahulu.',
        ]);

        $verifyResponse = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => env('TURNSTILE_SECRET_KEY'),
            'response' => $request->input('cf-turnstile-response'),
            'remoteip' => $request->ip(),
        ]);

        if (! $verifyResponse->json('success')) {
            throw ValidationException::withMessages([
                'cf-turnstile-response' => 'Validasi keamanan gagal. Silakan coba lagi.',
            ]);
        }

        // Remove turnstile response before attempt
        unset($credentials['cf-turnstile-response']);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            Alert::success('Berhasil Login', 'Selamat datang di Dashboard Komite');

            // Force full page reload to clear Inertia history state across auth boundaries
            return Inertia::location(session()->pull('url.intended', route('dashboard')));
        }

        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Alert::success('Logout Berhasil', 'Anda telah keluar dari sistem.');

        // Force full page reload to clear Inertia history state
        return Inertia::location(route('login'));
    }
}
