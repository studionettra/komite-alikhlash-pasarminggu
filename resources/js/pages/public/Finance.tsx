import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import PublicLayout from '../../layouts/PublicLayout';

export default function Finance({
    transactions,
    programs,
    filters,
    summary,
}: any) {
    const [selectedProgram, setSelectedProgram] = useState(
        filters?.program_id || '',
    );

    const handleFilterChange = (val: string | number) => {
        setSelectedProgram(val);

        router.get(
            '/keuangan',
            { program_id: val },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <PublicLayout>
            <Head title="Transparansi Keuangan - Komite KBIT-TKIT Al-Ikhlash Pasar Minggu" />

            <section className="bg-slate-900 py-20 text-center text-white">
                <div className="mx-auto max-w-4xl px-4">
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
                        Transparansi Keuangan
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                        Laporan kas Komite yang dilaporkan secara jujur,
                        akuntabel, dan real-time kepada seluruh wali murid.
                    </p>
                </div>
            </section>

            <section className="-mt-16 py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="flex flex-col justify-center rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
                            <p className="mb-2 text-sm font-medium text-slate-500">
                                Total Saldo Kas
                            </p>
                            <p className="text-4xl font-extrabold tracking-tight text-slate-900">
                                {formatRupiah(summary.balance)}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg shadow-green-900/5">
                            <p className="mb-2 text-sm font-bold tracking-wider text-green-700 uppercase">
                                Total Pemasukan
                            </p>
                            <p className="text-3xl font-bold tracking-tight text-green-900">
                                {formatRupiah(summary.income)}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 to-rose-50 p-8 shadow-lg shadow-red-900/5">
                            <p className="mb-2 text-sm font-bold tracking-wider text-red-700 uppercase">
                                Total Pengeluaran
                            </p>
                            <p className="text-3xl font-bold tracking-tight text-red-900">
                                {formatRupiah(summary.expense)}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 px-8 py-6 sm:flex-row sm:items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                Rincian Transaksi
                            </h2>
                            <div className="flex w-full items-center gap-3 sm:w-auto">
                                <span className="text-sm font-semibold whitespace-nowrap text-slate-500">
                                    Filter:
                                </span>
                                <div className="w-full sm:w-72">
                                    <Select
                                        value={selectedProgram}
                                        onChange={handleFilterChange}
                                        options={[
                                            {
                                                value: '',
                                                label: 'Semua Kas (Umum & Program)',
                                            },
                                            ...programs.map((p: any) => ({
                                                value: p.id,
                                                label: `Program: ${p.title}`,
                                            })),
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-8 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Tanggal
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-8 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Keterangan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-8 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Program
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-8 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Pemasukan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-8 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Pengeluaran
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 bg-white text-sm">
                                    {transactions.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-8 py-12 text-center text-slate-500"
                                            >
                                                Belum ada data transaksi.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.data.map((trx: any) => (
                                            <tr
                                                key={trx.id}
                                                className="transition-colors hover:bg-slate-50"
                                            >
                                                <td className="px-8 py-5 font-medium whitespace-nowrap text-slate-600">
                                                    {trx.date
                                                        ? new Date(
                                                              trx.date,
                                                          ).toLocaleDateString(
                                                              'id-ID',
                                                              {
                                                                  day: 'numeric',
                                                                  month: 'long',
                                                                  year: 'numeric',
                                                              },
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className="px-8 py-5 font-medium text-slate-900">
                                                    {trx.description}
                                                </td>
                                                <td className="px-8 py-5">
                                                    {trx.program ? (
                                                        <span className="inline-flex items-center rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                            {trx.program.title}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-slate-400">
                                                            Kas Umum
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right font-bold whitespace-nowrap text-green-600">
                                                    {trx.type === 'income'
                                                        ? formatRupiah(
                                                              trx.amount,
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className="px-8 py-5 text-right font-bold whitespace-nowrap text-red-600">
                                                    {trx.type === 'expense'
                                                        ? formatRupiah(
                                                              trx.amount,
                                                          )
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-8 py-5 text-sm text-slate-500">
                            <span>
                                Halaman {transactions.current_page} dari{' '}
                                {transactions.last_page}
                            </span>
                            <span>Total Data: {transactions.total}</span>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
