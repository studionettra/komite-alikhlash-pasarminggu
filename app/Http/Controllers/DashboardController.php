<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Meeting;
use App\Models\Program;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()->roles->first()->name ?? 'Anggota Komite';
        
        $data = [
            'role' => $role,
        ];
        
        if ($role === 'Superadmin') {
            $data['metrics'] = [
                'programs' => Program::count(),
                'meetings' => Meeting::count(),
                'balance' => Transaction::where('type', 'income')->sum('amount') - Transaction::where('type', 'expense')->sum('amount'),
            ];
            $data['recent_transactions'] = Transaction::with('program')->orderBy('date', 'desc')->take(5)->get();
            $data['ongoing_programs'] = Program::where('status', 'ongoing')->orderBy('start_date', 'desc')->take(5)->get();
        } elseif ($role === 'Bendahara') {
            $incomeThisMonth = Transaction::where('type', 'income')->whereMonth('date', date('m'))->sum('amount');
            $expenseThisMonth = Transaction::where('type', 'expense')->whereMonth('date', date('m'))->sum('amount');
            $totalIncome = Transaction::where('type', 'income')->sum('amount');
            $totalExpense = Transaction::where('type', 'expense')->sum('amount');
            
            $data['metrics'] = [
                'income_month' => $incomeThisMonth,
                'expense_month' => $expenseThisMonth,
                'balance' => $totalIncome - $totalExpense,
            ];
            $data['recent_transactions'] = Transaction::with('program')->orderBy('date', 'desc')->take(10)->get();
        } elseif ($role === 'Sekretaris') {
            $data['metrics'] = [
                'programs' => Program::count(),
                'meetings' => Meeting::count(),
                'documents' => Document::count(),
            ];
            $data['recent_meetings'] = Meeting::orderBy('date', 'desc')->take(5)->get();
            $data['upcoming_programs'] = Program::whereIn('status', ['planned', 'ongoing'])->orderBy('start_date', 'asc')->take(5)->get();
        } else {
            // Anggota Komite
            $totalIncome = Transaction::where('type', 'income')->sum('amount');
            $totalExpense = Transaction::where('type', 'expense')->sum('amount');
            
            $data['metrics'] = [
                'balance' => $totalIncome - $totalExpense,
            ];
            $data['active_programs'] = Program::where('status', 'ongoing')->orderBy('start_date', 'desc')->take(5)->get();
            $data['recent_meetings'] = Meeting::orderBy('date', 'desc')->take(3)->get();
        }
        
        return Inertia::render('Dashboard', $data);
    }
}
