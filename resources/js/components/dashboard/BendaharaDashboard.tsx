import { Link } from '@inertiajs/react';
import { Wallet, ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react';

export default function BendaharaDashboard({ metrics, recentTransactions, formatRupiah }: any) {
    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold text-slate-900 px-1">Ringkasan Keuangan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden lg:col-span-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Wallet weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1 relative z-10">Saldo Kas Tersedia</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight relative z-10">{formatRupiah(metrics?.balance || 0)}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <ArrowDownRight weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Pemasukan Bulan Ini</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{formatRupiah(metrics?.income_month || 0)}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                            <ArrowUpRight weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Pengeluaran Bulan Ini</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{formatRupiah(metrics?.expense_month || 0)}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Riwayat Transaksi Terakhir</h3>
                    <div className="flex gap-2">
                        <Link href="/transactions" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                            Kelola Transaksi
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Nominal</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {recentTransactions?.map((trx: any) => (
                                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        {new Date(trx.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {trx.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {trx.program ? <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">{trx.program.title}</span> : <span className="text-slate-400">Umum</span>}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
