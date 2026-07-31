import { Link } from '@inertiajs/react';
import { Wallet, ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react';

export default function BendaharaDashboard({
    metrics,
    recentTransactions,
    formatRupiah,
}: any) {
    return (
        <div className="space-y-8">
            <h2 className="px-1 text-lg font-semibold text-slate-900">
                Ringkasan Keuangan
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-1">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-bl-full bg-emerald-50 opacity-50 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="relative z-10 mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Wallet weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="relative z-10 mb-1 text-sm font-medium text-slate-500">
                        Saldo Kas Tersedia
                    </div>
                    <div className="relative z-10 text-3xl font-semibold tracking-tight text-slate-900">
                        {formatRupiah(metrics?.balance || 0)}
                    </div>
                </div>

                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <ArrowDownRight
                                weight="duotone"
                                className="h-6 w-6"
                            />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Pemasukan Bulan Ini
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {formatRupiah(metrics?.income_month || 0)}
                    </div>
                </div>

                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <ArrowUpRight
                                weight="duotone"
                                className="h-6 w-6"
                            />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Pengeluaran Bulan Ini
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {formatRupiah(metrics?.expense_month || 0)}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                    <h3 className="font-bold text-slate-900">
                        Riwayat Transaksi Terakhir
                    </h3>
                    <div className="flex gap-2">
                        <Link
                            href="/transactions"
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                        >
                            Kelola Transaksi
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    Tanggal
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    Keterangan
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    Program
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    Nominal
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {recentTransactions?.map((trx: any) => (
                                <tr
                                    key={trx.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                                        {new Date(trx.date).toLocaleDateString(
                                            'id-ID',
                                            {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            },
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {trx.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                        {trx.program ? (
                                            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                                                {trx.program.title}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">
                                                Umum
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        className={`px-6 py-4 text-right text-sm font-bold whitespace-nowrap ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                                    >
                                        {trx.type === 'income' ? '+' : '-'}
                                        {formatRupiah(trx.amount)}
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
