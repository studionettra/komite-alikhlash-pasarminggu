<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassCollection;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClassCollectionController extends Controller
{
    public function index()
    {
        $collections = ClassCollection::with(['classroom'])
            ->whereIn('status', ['submitted', 'verified', 'rejected'])
            ->orderByRaw("FIELD(status, 'submitted', 'verified', 'rejected')")
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/collections/Index', [
            'collections' => $collections,
        ]);
    }

    public function show(ClassCollection $collection)
    {
        $collection->load(['classroom', 'details.student', 'verifier']);

        return Inertia::render('admin/collections/Show', [
            'collection' => $collection,
        ]);
    }

    public function verify(Request $request, ClassCollection $collection)
    {
        if ($collection->status !== 'submitted') {
            abort(403, 'Hanya setoran dengan status submitted yang bisa diverifikasi.');
        }

        DB::transaction(function () use ($collection, $request) {
            $collection->update([
                'status' => 'verified',
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
            ]);

            // Buat transaksi untuk uang kas
            if ($collection->total_kas > 0) {
                Transaction::create([
                    'type' => 'income',
                    'amount' => $collection->total_kas,
                    'description' => "Pemasukan Uang Kas - Kelas {$collection->classroom->name} - Bulan {$collection->month}/{$collection->year}",
                    'date' => now(),
                ]);
            }

            // Buat transaksi untuk jumat berbagi
            if ($collection->total_jumat_berkah > 0) {
                $jumatBerbagiProgram = Program::where('title', 'like', '%Jumat Berbagi%')->first();
                if ($jumatBerbagiProgram) {
                    Transaction::create([
                        'program_id' => $jumatBerbagiProgram->id,
                        'amount' => $collection->total_jumat_berkah,
                        'description' => "Donasi Jumat Berbagi - Kelas {$collection->classroom->name} - Bulan {$collection->month}/{$collection->year}",
                        'date' => now(),
                    ]);
                }
            }
        });

        return redirect()->route('admin.collections.index')->with('success', 'Setoran kelas berhasil diverifikasi dan masuk ke saldo utama.');
    }
}
