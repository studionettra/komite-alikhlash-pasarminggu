import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import {
    CalendarBlank,
    PencilSimple,
    Trash,
    Plus,
    CaretLeft,
} from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/alertManager';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);

export default function AcademicCalendarsShow({
    academicYear,
}: {
    academicYear: any;
}) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManage = ['Superadmin', 'Sekretaris'].includes(userRole);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        year: '',
        effective_days: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/academic-calendar/${academicYear.id}/months`, {
            onSuccess: () => reset(),
        });
    };

    const deleteMonth = (id: number, name: string) => {
        confirmDelete(
            `Hapus bulan ${name}? Semua data agenda dan program di dalamnya akan hilang.`,
            () => {
                router.delete(`/academic-calendar/months/${id}`);
            },
        );
    };

    return (
        <DashboardLayout>
            <Head title={`Kelola Tahun Ajaran ${academicYear.name}`} />

            <div className="mb-6">
                <Link
                    href="/academic-calendar"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                    <CaretLeft weight="bold" />
                    Kembali ke Daftar Tahun Ajaran
                </Link>
            </div>

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Tahun Ajaran {academicYear.name}
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Daftar bulan dan agenda dalam kalender akademik ini.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {canManage && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <Plus
                                    weight="bold"
                                    className="h-5 w-5 text-blue-600"
                                />
                                Tambah Bulan Baru
                            </h2>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Nama Bulan <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="" disabled>Pilih Bulan</option>
                                        {MONTHS.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    {errors.name && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Tahun <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.year}
                                        onChange={(e) =>
                                            setData('year', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="" disabled>Pilih Tahun</option>
                                        {YEARS.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    {errors.year && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.year}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Hari Efektif (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.effective_days}
                                        onChange={(e) =>
                                            setData(
                                                'effective_days',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Contoh: 15 hari"
                                    />
                                    {errors.effective_days && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.effective_days}
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
                                        : 'Tambah Bulan'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className={canManage ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {academicYear.months?.length === 0 && (
                            <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
                                <CalendarBlank
                                    weight="duotone"
                                    className="mx-auto mb-3 h-12 w-12 text-slate-300"
                                />
                                <p>Belum ada data bulan di tahun ajaran ini.</p>
                            </div>
                        )}
                        {academicYear.months?.map((month: any) => (
                            <div
                                key={month.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                            >
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {month.name} {month.year}
                                        </h3>
                                        {canManage && (
                                            <button
                                                onClick={() =>
                                                    deleteMonth(
                                                        month.id,
                                                        month.name,
                                                    )
                                                }
                                                className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
                                                title="Hapus Bulan"
                                            >
                                                <Trash
                                                    weight="bold"
                                                    className="h-4 w-4"
                                                />
                                            </button>
                                        )}
                                    </div>
                                    {month.effective_days ? (
                                        <p className="text-sm font-medium text-slate-500">
                                            Hari Efektif: {month.effective_days}
                                        </p>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-400">
                                            -
                                        </p>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <Link
                                        href={`/academic-calendar/months/${month.id}/edit`}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                                    >
                                        <PencilSimple weight="bold" />
                                        Kelola Agenda & Program
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
