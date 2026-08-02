<?php

namespace App\Http\Controllers;

use App\Models\ClassCollection;
use App\Models\Document;
use App\Models\Meeting;
use App\Models\Program;
use App\Models\Student;
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

            $pendingCollections = ClassCollection::where('status', 'submitted')->count();

            $data['metrics'] = [
                'income_month' => $incomeThisMonth,
                'expense_month' => $expenseThisMonth,
                'balance' => $totalIncome - $totalExpense,
                'pending_collections' => $pendingCollections,
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
        } elseif ($role === 'Korlas') {
            $classroom = $request->user()->classrooms()->first();
            if ($classroom) {
                $month = (int) now()->format('m');
                $year = (int) now()->format('Y');
                $collection = ClassCollection::where('classroom_id', $classroom->id)
                    ->where('month', $month)
                    ->where('year', $year)
                    ->first();

                $data['classroom'] = $classroom;
                $data['students_count'] = Student::where('classroom_id', $classroom->id)->where('is_active', true)->count();
                $data['current_collection'] = $collection;
            } else {
                $data['classroom'] = null;
                $data['students_count'] = 0;
                $data['current_collection'] = null;
            }
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
