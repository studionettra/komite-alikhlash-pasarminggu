<?php

namespace App\Http\Controllers;

use App\Helpers\Alert;
use App\Models\Program;
use App\Models\Transaction;
use App\Services\GoogleSheetsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('program')->orderBy('date', 'desc');

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        $transactions = $query->paginate(15)->withQueryString();

        $totalIncome = (clone $query)->where('type', 'income')->sum('amount');
        $totalExpense = (clone $query)->where('type', 'expense')->sum('amount');

        $programs = Program::select('id', 'title')->get();

        return Inertia::render('transactions/Index', [
            'transactions' => $transactions,
            'programs' => $programs,
            'filters' => $request->only(['program_id']),
            'summary' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'balance' => $totalIncome - $totalExpense,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'date' => 'required|date',
            'program_id' => 'nullable|exists:programs,id',
            'program_activity_id' => 'nullable|exists:program_activities,id',
            'receipt_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('receipt_file')) {
            $path = $request->file('receipt_file')->store('receipts', 'public');
            $validated['receipt_path'] = $path;
        }

        unset($validated['receipt_file']); // Don't try to save the file object to db

        Transaction::create($validated);
        Alert::success('Berhasil', 'Transaksi kas berhasil dicatat.');

        return back();
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        Alert::deleteSuccess('Berhasil', 'Transaksi dihapus.');

        return back();
    }

    public function exportToSheets(GoogleSheetsService $sheetsService)
    {
        try {
            $transactions = Transaction::with('program')->orderBy('date', 'asc')->get();

            // Header row
            $values = [
                ['Tanggal', 'Tipe', 'Keterangan', 'Program', 'Nominal', 'Link Lampiran'],
            ];

            foreach ($transactions as $trx) {
                $attachmentLink = $trx->receipt_path ? asset('storage/'.$trx->receipt_path) : 'Tidak ada';
                $programName = $trx->program ? $trx->program->title : 'Umum';

                $values[] = [
                    Carbon::parse($trx->date)->format('d-M-Y'),
                    $trx->type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                    $trx->description,
                    $programName,
                    $trx->amount,
                    $attachmentLink,
                ];
            }

            $sheetsService->clearRange('Sheet1!A:F'); // Clear previous data
            $success = $sheetsService->appendData('Sheet1!A1', $values);

            if ($success) {
                Alert::success('Berhasil', 'Data berhasil diekspor ke Google Sheets.');
            } else {
                Alert::error('Gagal', 'Tidak ada data yang diupdate di Google Sheets.');
            }
        } catch (\Exception $e) {
            Alert::error('Error Export', $e->getMessage());
        }

        return back();
    }
}
