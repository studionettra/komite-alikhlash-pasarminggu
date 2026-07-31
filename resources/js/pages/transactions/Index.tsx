import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Wallet, ArrowDownRight, ArrowUpRight, Faders, FileText, Trash } from '@phosphor-icons/react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

export default function TransactionsIndex({ transactions, programs, filters, summary }: any) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManageFinance = ['Superadmin', 'Bendahara'].includes(userRole);
    const [selectedProgram, setSelectedProgram] = useState(filters?.program_id || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'income',
        amount: '',
        description: '',
        date: '',
        program_id: '',
        receipt_file: null as File | null,
    });

    // Handle filter change
    const handleFilterChange = (val: string | number) => {
        setSelectedProgram(val);
        
        router.get('/transactions', { program_id: val }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/transactions', {
            onSuccess: () => reset(),
        });
    };

    const deleteTransaction = (id: number) => {
        confirmDelete('Hapus transaksi ini?', () => {
            router.delete(`/transactions/${id}`, {
                preserveScroll: true
            });
        });
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
    };

    const formatInputRupiah = (value: string | number) => {
        if (!value) {
return '';
}

        const stringValue = value.toString().replace(/\D/g, '');

        return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
return '-';
}

        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <DashboardLayout>
            <Head title="Keuangan" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Keuangan</h1>
                    <p className="text-slate-500 mt-1">Catat dan pantau arus kas komite.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {/* Saldo Bersih */}
                <div className="bg-slate-900 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-8 -mt-8 pointer-events-none"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                            <Wallet weight="duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-white/70 text-sm font-medium mb-1">Total Saldo Bersih</div>
                            <div className="text-white text-2xl font-bold tracking-tight">{formatRupiah(summary?.balance || 0)}</div>
                        </div>
                    </div>
                </div>

                {/* Pemasukan */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ArrowDownRight weight="bold" className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-medium mb-1">Total Pemasukan</div>
                        <div className="text-slate-900 text-2xl font-bold tracking-tight">{formatRupiah(summary?.income || 0)}</div>
                    </div>
                </div>

                {/* Pengeluaran */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <ArrowUpRight weight="bold" className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-medium mb-1">Total Pengeluaran</div>
                        <div className="text-slate-900 text-2xl font-bold tracking-tight">{formatRupiah(summary?.expense || 0)}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                {canManageFinance && (
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Catat Transaksi Baru</h2>
                        
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Transaksi</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'income')}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                                            data.type === 'income' 
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm' 
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 font-medium'
                                        }`}
                                    >
                                        <ArrowDownRight weight={data.type === 'income' ? "bold" : "regular"} className="w-5 h-5" />
                                        Pemasukan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'expense')}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                                            data.type === 'expense' 
                                            ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm' 
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 font-medium'
                                        }`}
                                    >
                                        <ArrowUpRight weight={data.type === 'expense' ? "bold" : "regular"} className="w-5 h-5" />
                                        Pengeluaran
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
                                <input
                                    type={data.date ? "date" : "text"}
                                    placeholder="dd/mm/yyyy"
                                    value={data.date}
                                    onFocus={(e) => {
                                        e.target.type = 'date';

                                        if (e.target.showPicker) {
e.target.showPicker();
}
                                    }}
                                    onBlur={(e) => {
                                        if (!e.target.value) {
e.target.type = 'text';
}
                                    }}
                                    onClick={(e) => {
                                        if (e.target.type === 'date' && e.target.showPicker) {
e.target.showPicker();
}
                                    }}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                                {errors.date && <div className="text-rose-500 text-xs mt-1">{errors.date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nominal (Rp)</label>
                                <input
                                    type="text"
                                    value={formatInputRupiah(data.amount)}
                                    onChange={e => setData('amount', e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    placeholder="Contoh: 1.500.000"
                                    required
                                />
                                {errors.amount && <div className="text-rose-500 text-xs mt-1">{errors.amount}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={2}
                                    placeholder="Contoh: Iuran bulanan"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors resize-none"
                                    required
                                ></textarea>
                                {errors.description && <div className="text-rose-500 text-xs mt-1">{errors.description}</div>}
                            </div>
                            <div className="relative z-20">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Terkait Program?</label>
                                <Select
                                    value={data.program_id}
                                    onChange={val => setData('program_id', val as string)}
                                    options={[
                                        { value: '', label: '-- Kas Umum (Tidak Terkait) --' },
                                        ...programs.map((p: any) => ({ value: p.id, label: p.title }))
                                    ]}
                                    placeholder="Pilih Program..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bukti / Struk (Opsional)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="receipt_upload"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="hidden"
                                        onChange={e => setData('receipt_file', e.target.files ? e.target.files[0] : null)}
                                    />
                                    <label 
                                        htmlFor="receipt_upload" 
                                        className="flex flex-col items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 font-medium hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all cursor-pointer active:scale-[0.98]"
                                    >
                                        <FileText weight="duotone" className="w-8 h-8 text-slate-400" />
                                        <span className="text-sm text-center">
                                            {data.receipt_file ? data.receipt_file.name : 'Pilih File (JPG, PNG, PDF)'}
                                        </span>
                                    </label>
                                </div>
                                {errors.receipt_file && <div className="text-rose-500 text-xs mt-1">{errors.receipt_file}</div>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm mt-2"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                            </button>
                        </form>
                    </div>
                </div>
                )}

                {/* Right Column: Filter & Table */}
                <div className={canManageFinance ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
                    
                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                            <Faders weight="bold" className="w-5 h-5" />
                            <span className="font-semibold text-sm">Filter:</span>
                        </div>
                        <div className="w-full sm:w-72">
                            <Select 
                                value={selectedProgram}
                                onChange={handleFilterChange}
                                options={[
                                    { value: '', label: 'Semua Transaksi' },
                                    ...programs.map((p: any) => ({ value: p.id, label: `Program: ${p.title}` }))
                                ]}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Ket</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Program Kerja</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Nominal</th>
                                        {canManageFinance && (
                                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td colSpan={canManageFinance ? 4 : 3} className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Wallet weight="duotone" className="w-12 h-12 text-slate-300 mb-3" />
                                                    <p>Belum ada data transaksi untuk filter ini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {transactions.data.map((trx: any) => (
                                        <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{formatDate(trx.date)}</div>
                                                <div className="text-sm font-semibold text-slate-900">{trx.description}</div>
                                                {trx.receipt_path && (
                                                    <a href={`/storage/${trx.receipt_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                                        <FileText weight="bold" />
                                                        Lihat Struk
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {trx.program ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {trx.program.title}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium">Kas Umum</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className={`text-sm font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                                                </div>
                                            </td>
                                            {canManageFinance && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                                                <button 
                                                    onClick={() => deleteTransaction(trx.id)} 
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Hapus Transaksi"
                                                >
                                                    <Trash weight="bold" className="w-4 h-4" />
                                                </button>
                                            </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {transactions.total > 0 && (
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                                Menampilkan {transactions.data.length} dari total {transactions.total} transaksi
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
