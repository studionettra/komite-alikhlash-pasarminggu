<?php

namespace App\Http\Controllers\Korlas;

use App\Http\Controllers\Controller;
use App\Models\ClassCollection;
use App\Models\CollectionDetail;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $classroom = $user->classrooms()->first();

        if (! $classroom) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelas yang ditugaskan.');
        }

        $month = (int) now()->format('m');
        $year = (int) now()->format('Y');

        $collection = ClassCollection::with(['details.student'])
            ->where('classroom_id', $classroom->id)
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        if (! $collection) {
            $collection = ClassCollection::create([
                'classroom_id' => $classroom->id,
                'month' => $month,
                'year' => $year,
                'status' => 'draft',
            ]);

            $students = Student::where('classroom_id', $classroom->id)
                ->where('is_active', true)
                ->get();

            foreach ($students as $student) {
                $unpaidMonthsCount = CollectionDetail::where('student_id', $student->id)
                    ->where('is_paid', false)
                    ->count();

                $arrears = $unpaidMonthsCount * 75000;
                $defaultAmount = 75000 + $arrears;

                CollectionDetail::create([
                    'class_collection_id' => $collection->id,
                    'student_id' => $student->id,
                    'kas_amount' => $defaultAmount,
                    'jumat_berkah_amount' => 0,
                    'is_paid' => false,
                ]);
            }

            $collection->load('details.student');
        }

        // Calculate totals dynamically from UI edits or DB
        $totalKas = $collection->details->where('is_paid', true)->sum('kas_amount');
        $totalJumat = $collection->details->where('is_paid', true)->sum('jumat_berkah_amount');

        return Inertia::render('korlas/collections/Index', [
            'classroom' => $classroom,
            'collection' => $collection,
            'details' => $collection->details,
            'totals' => [
                'kas' => $totalKas,
                'jumat' => $totalJumat,
            ],
            'history' => ClassCollection::where('classroom_id', $classroom->id)
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get(),
        ]);
    }

    public function updateDetail(Request $request, CollectionDetail $detail)
    {
        $request->validate([
            'is_paid' => 'required|boolean',
            'kas_amount' => 'required|numeric|min:0',
            'jumat_berkah_amount' => 'required|numeric|min:0',
        ]);

        $collection = $detail->collection;
        $classroom = $request->user()->classrooms()->firstOrFail();

        if ($collection->classroom_id !== $classroom->id || $collection->status !== 'draft') {
            abort(403, 'Unauthorized action or collection is not in draft status.');
        }

        $detail->update([
            'is_paid' => $request->is_paid,
            'kas_amount' => $request->kas_amount,
            'jumat_berkah_amount' => $request->jumat_berkah_amount,
        ]);

        // If marked as paid, we should also clear previous arrears (set them to paid)
        if ($request->is_paid) {
            CollectionDetail::where('student_id', $detail->student_id)
                ->where('id', '!=', $detail->id)
                ->where('is_paid', false)
                ->update(['is_paid' => true, 'kas_amount' => 0]); // Zero out old amounts so they don't double count if we sum later, or just mark paid.
        }

        return redirect()->back();
    }

    public function submit(Request $request, ClassCollection $collection)
    {
        $request->validate([
            'transfer_proof' => 'required|image|max:2048',
        ]);

        $classroom = $request->user()->classrooms()->firstOrFail();

        if ($collection->classroom_id !== $classroom->id || $collection->status !== 'draft') {
            abort(403, 'Unauthorized action.');
        }

        $totalKas = $collection->details()->where('is_paid', true)->sum('kas_amount');
        $totalJumat = $collection->details()->where('is_paid', true)->sum('jumat_berkah_amount');

        $path = $request->file('transfer_proof')->store('proofs', 'public');

        $collection->update([
            'total_kas' => $totalKas,
            'total_jumat_berkah' => $totalJumat,
            'transfer_proof' => $path,
            'status' => 'submitted',
        ]);

        return redirect()->back()->with('success', 'Laporan bulan ini berhasil disubmit ke Bendahara.');
    }
}
