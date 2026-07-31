<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Transaction;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $today = now()->setTimezone('Asia/Jakarta')->format('Y-m-d');

        $heroProgram = Program::with('activities')->where('start_date', '<=', $today)
                ->where(function($q) use ($today) {
                    $q->where('end_date', '>=', $today)
                      ->orWhereNull('end_date');
                })->first() 
            ?? Program::with('activities')->where('start_date', '>', $today)->orderBy('start_date', 'asc')->first()
            ?? Program::with('activities')->whereNotNull('start_date')->orderBy('start_date', 'asc')->first();

        $activeProgramsQuery = Program::with('activities')
            ->whereNotNull('start_date')
            ->where(function($q) use ($today) {
                $q->where('end_date', '>=', $today)
                  ->orWhereNull('end_date');
            })
            ->orderBy('start_date', 'asc');
            
        if ($heroProgram) {
            $activeProgramsQuery->where('id', '!=', $heroProgram->id);
        }
            
        $activePrograms = $activeProgramsQuery->get();

        return Inertia::render('public/Home', [
            'heroProgram' => $heroProgram,
            'activePrograms' => $activePrograms,
        ]);
    }

    public function organization()
    {
        return Inertia::render('public/Organization');
    }

    public function finance(\Illuminate\Http\Request $request)
    {
        $query = Transaction::with('program')->orderBy('date', 'desc');

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        $transactions = $query->paginate(20)->withQueryString();
        
        $totalIncome = (clone $query)->where('type', 'income')->sum('amount');
        $totalExpense = (clone $query)->where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        $programs = Program::select('id', 'title')->get();

        return Inertia::render('public/Finance', [
            'transactions' => $transactions,
            'programs' => $programs,
            'filters' => $request->only(['program_id']),
            'summary' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'balance' => $balance,
            ],
        ]);
    }

    public function programs()
    {
        $programs = Program::with([
            'activities' => fn($q) => $q->orderBy('activity_date', 'desc'),
            'activities.documents',
            'documents' => fn($q) => $q->whereNull('program_activity_id')
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('public/Programs', [
            'programs' => $programs,
        ]);
    }
}
