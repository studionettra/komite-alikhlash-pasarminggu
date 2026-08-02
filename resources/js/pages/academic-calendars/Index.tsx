import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import {
    CalendarBlank,
    PencilSimple,
    Trash,
    CaretRight,
} from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/alertManager';

export default function AcademicCalendarsIndex({ years }: { years: any[] }) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManage = ['Superadmin', 'Sekretaris'].includes(userRole);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            is_active: false,
        });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (year: any) => {
        setIsEditing(true);
        setEditingId(year.id);
        clearErrors();
        setData({
            name: year.name,
            is_active: year.is_active,
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            put(`/academic-calendar/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
            });
        } else {
            post('/academic-calendar', {
                onSuccess: () => reset(),
            });
        }
    };

    const deleteYear = (id: number, name: string) => {
        confirmDelete(
            `Hapus Tahun Ajaran ${name}? Semua data bulan di dalamnya akan ikut terhapus.`,
            () => {
                router.delete(`/academic-calendar/${id}`);
            },
        );
    };

    return (
        <DashboardLayout>
            <Head title="Kelola Kalender Akademik" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Kalender Akademik
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola tahun ajaran dan bulan untuk kalender pendidikan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {canManage && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <CalendarBlank
                                        weight="duotone"
                                        className="h-5 w-5 text-blue-600"
                                    />
                                    {isEditing
                                        ? 'Edit Tahun Ajaran'
                                        : 'Tambah Tahun Ajaran'}
                                </h2>
                                {isEditing && (
                                    <button
                                        onClick={openCreate}
                                        className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Tahun Ajaran (Contoh: 2026/2027)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                        placeholder="2026/2027"
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="is_active"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Tahun Ajaran Aktif (Ditampilkan Publik)
                                    </label>
                                </div>
                                {errors.is_active && (
                                    <div className="mt-1 text-xs text-rose-500">
                                        {errors.is_active}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className={canManage ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Tahun Ajaran
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Jumlah Bulan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {years.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <CalendarBlank
                                                        weight="duotone"
                                                        className="mb-3 h-12 w-12 text-slate-300"
                                                    />
                                                    <p>
                                                        Belum ada data tahun
                                                        ajaran.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {years.map((year: any) => (
                                        <tr
                                            key={year.id}
                                            className="transition-colors hover:bg-slate-50/80"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/academic-calendar/${year.id}`}
                                                    className="font-bold text-slate-900 transition-colors hover:text-blue-600"
                                                >
                                                    {year.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {year.is_active ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                                        Tidak Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-slate-600">
                                                {year.months_count} Bulan
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/academic-calendar/${year.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100"
                                                    >
                                                        Kelola{' '}
                                                        <CaretRight weight="bold" />
                                                    </Link>
                                                    {canManage && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    openEdit(
                                                                        year,
                                                                    )
                                                                }
                                                                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                                                                title="Edit Tahun Ajaran"
                                                            >
                                                                <PencilSimple
                                                                    weight="bold"
                                                                    className="h-4 w-4"
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteYear(
                                                                        year.id,
                                                                        year.name,
                                                                    )
                                                                }
                                                                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                                title="Hapus Tahun Ajaran"
                                                            >
                                                                <Trash
                                                                    weight="bold"
                                                                    className="h-4 w-4"
                                                                />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
