import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import PublicLayout from '../../layouts/PublicLayout';

export default function Finance({ transactions, programs, filters, summary }: any) {
    const [selectedProgram, setSelectedProgram] = useState(filters?.program_id || '');

    const handleFilterChange = (val: string | number) => {
        setSelectedProgram(val);
        
        router.get('/keuangan', { program_id: val }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
    };

    return (
        <PublicLayout>
            <Head title="Transparansi Keuangan - Komite KBIT-TKIT Al-Ikhlash Pasar Minggu" />
            
            <section className="bg-slate-900 py-20 text-center text-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Transparansi Keuangan</h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Laporan kas Komite yang dilaporkan secara jujur, akuntabel, dan real-time kepada seluruh wali murid.
                    </p>
                </div>
            </section>

            <section className="py-12 -mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
                            <p className="text-sm font-medium text-slate-500 mb-2">Total Saldo Kas</p>
                            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatRupiah(summary.balance)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg shadow-green-900/5 border border-green-100 flex flex-col justify-center">
                            <p className="text-sm font-bold text-green-700 uppercase tracking-wider mb-2">Total Pemasukan</p>
                            <p className="text-3xl font-bold text-green-900 tracking-tight">{formatRupiah(summary.income)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 shadow-lg shadow-red-900/5 border border-red-100 flex flex-col justify-center">
                            <p className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">Total Pengeluaran</p>
                            <p className="text-3xl font-bold text-red-900 tracking-tight">{formatRupiah(summary.expense)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-xl font-bold text-slate-900">Rincian Transaksi</h2>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Filter:</span>
                                <div className="w-full sm:w-72">
                                    <Select 
                                        value={selectedProgram}
                                        onChange={handleFilterChange}
                                        options={[
                                            { value: '', label: 'Semua Kas (Umum & Program)' },
                                            ...programs.map((p: any) => ({ value: p.id, label: `Program: ${p.title}` }))
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                                        <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Pemasukan</th>
                                        <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Pengeluaran</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50 text-sm">
                                    {transactions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                                                Belum ada data transaksi.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.data.map((trx: any) => (
                                            <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-8 py-5 whitespace-nowrap text-slate-600 font-medium">
                                                    {trx.date ? new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="px-8 py-5 text-slate-900 font-medium">
                                                    {trx.description}
                                                </td>
                                                <td className="px-8 py-5">
                                                    {trx.program ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {trx.program.title}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">Kas Umum</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-right font-bold text-green-600">
                                                    {trx.type === 'income' ? formatRupiah(trx.amount) : '-'}
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-right font-bold text-red-600">
                                                    {trx.type === 'expense' ? formatRupiah(trx.amount) : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                            <span>Halaman {transactions.current_page} dari {transactions.last_page}</span>
                            <span>Total Data: {transactions.total}</span>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
