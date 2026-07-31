<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProgramActivityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/pengurus', [HomeController::class, 'organization'])->name('public.organization');
Route::get('/keuangan', [HomeController::class, 'finance'])->name('public.finance');
Route::get('/program', [HomeController::class, 'programs'])->name('public.programs');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});

Route::middleware(['auth', 'prevent-back-history'])->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Read-only routes (accessible by all authenticated users)
    Route::get('/programs', [ProgramController::class, 'index'])->name('programs.index');
    Route::get('/programs/{program}', [ProgramController::class, 'show'])->name('programs.show');
    Route::get('/meetings', [MeetingController::class, 'index'])->name('meetings.index');

    // Superadmin | Sekretaris restricted routes
    Route::middleware(['role:Superadmin|Sekretaris'])->group(function () {
        Route::post('/programs', [ProgramController::class, 'store'])->name('programs.store');
        Route::put('/programs/{program}', [ProgramController::class, 'update'])->name('programs.update');
        Route::delete('/programs/{program}', [ProgramController::class, 'destroy'])->name('programs.destroy');

        Route::post('/program-activities', [ProgramActivityController::class, 'store'])->name('program_activities.store');
        Route::put('/program-activities/{programActivity}', [ProgramActivityController::class, 'update'])->name('program_activities.update');
        Route::delete('/program-activities/{programActivity}', [ProgramActivityController::class, 'destroy'])->name('program_activities.destroy');

        Route::post('/meetings', [MeetingController::class, 'store'])->name('meetings.store');
        Route::put('/meetings/{meeting}', [MeetingController::class, 'update'])->name('meetings.update');
        Route::delete('/meetings/{meeting}', [MeetingController::class, 'destroy'])->name('meetings.destroy');

        Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
        Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
    });
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::middleware(['role:Superadmin|Bendahara'])->group(function () {
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
    });

    Route::middleware(['role:Superadmin'])->group(function () {
        Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
        Route::resource('roles', RoleController::class)->only(['index', 'store', 'destroy']);
    });
});
