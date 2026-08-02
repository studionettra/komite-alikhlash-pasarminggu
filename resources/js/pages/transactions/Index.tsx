import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import {
    Wallet,
    ArrowDownRight,
    ArrowUpRight,
    Faders,
    FileText,
    Trash,
    CloudArrowUp,
} from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/alertManager';

export default function TransactionsIndex({
    transactions,
    programs,
    filters,
    summary,
}: any) {
    const { auth, flash } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManageFinance = ['Superadmin', 'Bendahara'].includes(userRole);

    const [selectedProgram, setSelectedProgram] = useState(
        filters?.program_id || '',
    );

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

        router.get(
            '/transactions',
            { program_id: val },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
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
                preserveScroll: true,
            });
        });
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(angka);
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

        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <Head title="Keuangan" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Manajemen Keuangan
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Catat dan pantau arus kas komite.
                    </p>
                </div>
                {canManageFinance && (
                    <Link
                        href="/transactions/export"
                        method="post"
                        as="button"
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                        <CloudArrowUp weight="bold" className="h-5 w-5" />
                        Export ke Google Sheets
                    </Link>
                )}
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Saldo Bersih */}
                <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-sm">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur-sm">
                            <Wallet weight="duotone" className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="mb-1 text-sm font-medium text-white/70">
                                Total Saldo Bersih
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-white">
                                {formatRupiah(summary?.balance || 0)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pemasukan */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <ArrowDownRight weight="bold" className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="mb-1 text-sm font-medium text-slate-500">
                            Total Pemasukan
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900">
                            {formatRupiah(summary?.income || 0)}
                        </div>
                    </div>
                </div>

                {/* Pengeluaran */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <ArrowUpRight weight="bold" className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="mb-1 text-sm font-medium text-slate-500">
                            Total Pengeluaran
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900">
                            {formatRupiah(summary?.expense || 0)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Form */}
                {canManageFinance && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-bold text-slate-900">
                                Catat Transaksi Baru
                            </h2>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Jenis Transaksi
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData('type', 'income')
                                            }
                                            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                                                data.type === 'income'
                                                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700 shadow-sm'
                                                    : 'border-slate-200 bg-white font-medium text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <ArrowDownRight
                                                weight={
                                                    data.type === 'income'
                                                        ? 'bold'
                                                        : 'regular'
                                                }
                                                className="h-5 w-5"
                                            />
                                            Pemasukan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData('type', 'expense')
                                            }
                                            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                                                data.type === 'expense'
                                                    ? 'border-rose-500 bg-rose-50 font-bold text-rose-700 shadow-sm'
                                                    : 'border-slate-200 bg-white font-medium text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <ArrowUpRight
                                                weight={
                                                    data.type === 'expense'
                                                        ? 'bold'
                                                        : 'regular'
                                                }
                                                className="h-5 w-5"
                                            />
                                            Pengeluaran
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Tanggal
                                    </label>
                                    <input
                                        type={data.date ? 'date' : 'text'}
                                        placeholder="dd/mm/yyyy"
                                        value={data.date}
                                        onFocus={(e: any) => {
                                            e.target.type = 'date';

                                            if (e.target.showPicker) {
                                                e.target.showPicker();
                                            }
                                        }}
                                        onBlur={(e: any) => {
                                            if (!e.target.value) {
                                                e.target.type = 'text';
                                            }
                                        }}
                                        onClick={(e: any) => {
                                            if (
                                                e.target.type === 'date' &&
                                                e.target.showPicker
                                            ) {
                                                e.target.showPicker();
                                            }
                                        }}
                                        onChange={(e) =>
                                            setData('date', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.date && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.date}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Nominal (Rp)
                                    </label>
                                    <input
                                        type="text"
                                        value={formatInputRupiah(data.amount)}
                                        onChange={(e) =>
                                            setData(
                                                'amount',
                                                e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                ),
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Contoh: 1.500.000"
                                        required
                                    />
                                    {errors.amount && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.amount}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Keterangan
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                        placeholder="Contoh: Iuran bulanan"
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    ></textarea>
                                    {errors.description && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-20">
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Terkait Program?
                                    </label>
                                    <Select
                                        value={data.program_id}
                                        onChange={(val) =>
                                            setData('program_id', val as string)
                                        }
                                        options={[
                                            {
                                                value: '',
                                                label: '-- Kas Umum (Tidak Terkait) --',
                                            },
                                            ...programs.map((p: any) => ({
                                                value: p.id,
                                                label: p.title,
                                            })),
                                        ]}
                                        placeholder="Pilih Program..."
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Bukti / Struk (Opsional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="receipt_upload"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            className="hidden"
                                            onChange={(e) =>
                                                setData(
                                                    'receipt_file',
                                                    e.target.files
                                                        ? e.target.files[0]
                                                        : null,
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="receipt_upload"
                                            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 font-medium text-slate-500 transition-all hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98]"
                                        >
                                            <FileText
                                                weight="duotone"
                                                className="h-8 w-8 text-slate-400"
                                            />
                                            <span className="text-center text-sm">
                                                {data.receipt_file
                                                    ? data.receipt_file.name
                                                    : 'Pilih File (JPG, PNG, PDF)'}
                                            </span>
                                        </label>
                                    </div>
                                    {errors.receipt_file && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.receipt_file}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Transaksi'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Right Column: Filter & Table */}
                <div
                    className={
                        canManageFinance
                            ? 'space-y-6 lg:col-span-2'
                            : 'space-y-6 lg:col-span-3'
                    }
                >
                    {/* Filter Bar */}
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                        <div className="flex items-center gap-2 whitespace-nowrap text-slate-500">
                            <Faders weight="bold" className="h-5 w-5" />
                            <span className="text-sm font-semibold">
                                Filter:
                            </span>
                        </div>
                        <div className="w-full sm:w-72">
                            <Select
                                value={selectedProgram}
                                onChange={handleFilterChange}
                                options={[
                                    { value: '', label: 'Semua Transaksi' },
                                    ...programs.map((p: any) => ({
                                        value: p.id,
                                        label: p.title,
                                    })),
                                ]}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="w-[15%] px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Tanggal
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-[35%] px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Keterangan
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-[25%] px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Program Kerja
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-[25%] px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Nominal
                                        </th>
                                        {canManageFinance && (
                                            <th
                                                scope="col"
                                                className="w-auto px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                            >
                                                Aksi
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={canManageFinance ? 5 : 4}
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <Wallet
                                                        weight="duotone"
                                                        className="mb-3 h-12 w-12 text-slate-300"
                                                    />
                                                    <p>
                                                        Belum ada data transaksi
                                                        untuk filter ini.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {transactions.data.map((trx: any) => (
                                        <tr
                                            key={trx.id}
                                            className="transition-colors hover:bg-slate-50/80"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                                    {formatDate(trx.date)}
                                                </div>
                                                {trx.receipt_path && (
                                                    <a
                                                        href={`/storage/${trx.receipt_path}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                                    >
                                                        <FileText weight="bold" />
                                                        Lihat Struk
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-slate-900">
                                                    {trx.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
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
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div
                                                    className={`text-sm font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                                                >
                                                    {trx.type === 'income' ? '+' : '-'}
                                                    {formatRupiah(trx.amount)}
                                                </div>
                                            </td>
                                            {canManageFinance && (
                                                <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            deleteTransaction(trx.id)
                                                        }
                                                        className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus Transaksi"
                                                    >
                                                        <Trash
                                                            weight="bold"
                                                            className="h-4 w-4"
                                                        />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {transactions.total > 0 && (
                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500">
                                Menampilkan {transactions.data.length} dari
                                total {transactions.total} transaksi
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
