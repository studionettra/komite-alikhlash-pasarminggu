import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import {
    PencilSimple,
    Trash,
    Target,
    CheckCircle,
    Clock,
    FlagBanner,
    FileText,
} from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

export default function ProgramsIndex({ programs }: { programs: any }) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManageProgram = ['Superadmin', 'Sekretaris'].includes(userRole);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            description: '',
            frequency: 'monthly',
            status: 'planned',
            start_date: '',
            end_date: '',
        });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (program: any) => {
        setIsEditing(true);
        setEditingId(program.id);
        clearErrors();
        setData({
            title: program.title,
            description: program.description,
            frequency: program.frequency,
            status: program.status,
            start_date: program.start_date
                ? program.start_date.split('T')[0]
                : '',
            end_date: program.end_date ? program.end_date.split('T')[0] : '',
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            put(`/programs/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
            });
        } else {
            post('/programs', {
                onSuccess: () => reset(),
            });
        }
    };

    const deleteProgram = (id: number, title: string) => {
        confirmDelete(`Hapus program ${title}?`, () => {
            router.delete(`/programs/${id}`);
        });
    };

    const frequencyLabel = (freq: string) => {
        const labels: any = {
            monthly: 'Bulanan',
            holiday: 'PHBI',
            incidental: 'Insidental',
        };

        return labels[freq] || freq;
    };

    const statusBadge = (status: string) => {
        if (status === 'planned') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wider text-slate-700 uppercase">
                    <Clock weight="bold" className="h-3.5 w-3.5" />
                    Akan Datang
                </span>
            );
        }

        if (status === 'ongoing') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
                    <FlagBanner weight="bold" className="h-3.5 w-3.5" />
                    Sedang Berlangsung
                </span>
            );
        }

        if (status === 'completed') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase">
                    <CheckCircle weight="bold" className="h-3.5 w-3.5" />
                    Selesai
                </span>
            );
        }

        return status;
    };

    return (
        <DashboardLayout>
            <Head title="Program Kerja" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Program Kerja
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Daftar agenda dan pelaksanaan program komite.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {canManageProgram && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <Target
                                        weight="duotone"
                                        className="h-5 w-5 text-blue-600"
                                    />
                                    {isEditing
                                        ? 'Edit Program'
                                        : 'Tambah Program'}
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
                                        Nama Program
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.title && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    ></textarea>
                                    {errors.description && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-20 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                            Kategori
                                        </label>
                                        <Select
                                            value={data.frequency}
                                            onChange={(val) =>
                                                setData(
                                                    'frequency',
                                                    val as string,
                                                )
                                            }
                                            options={[
                                                {
                                                    value: 'monthly',
                                                    label: 'Bulanan',
                                                },
                                                {
                                                    value: 'holiday',
                                                    label: 'Peringatan Hari Besar',
                                                },
                                                {
                                                    value: 'incidental',
                                                    label: 'Insidental',
                                                },
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                            Status
                                        </label>
                                        <Select
                                            value={data.status}
                                            onChange={(val) =>
                                                setData('status', val as string)
                                            }
                                            options={[
                                                {
                                                    value: 'planned',
                                                    label: 'Akan Datang',
                                                },
                                                {
                                                    value: 'ongoing',
                                                    label: 'Sedang Berlangsung',
                                                },
                                                {
                                                    value: 'completed',
                                                    label: 'Selesai',
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 pt-2">
                                    <p className="mb-3 text-xs leading-relaxed font-medium text-slate-500">
                                        Isi tanggal di bawah jika ini adalah
                                        acara 1x jalan{' '}
                                        <span className="text-slate-400 italic">
                                            (Contoh: Market Day, Lomba HUT RI)
                                        </span>
                                        . Kosongkan jika program rutin memiliki
                                        sesi berulang{' '}
                                        <span className="text-slate-400 italic">
                                            (Contoh: Jumat Berkah, Renang)
                                        </span>
                                        .
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                Tanggal Mulai (Opsional)
                                            </label>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'start_date',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                Tanggal Selesai (Opsional)
                                            </label>
                                            <input
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'end_date',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Program'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div
                    className={
                        canManageProgram ? 'lg:col-span-2' : 'lg:col-span-3'
                    }
                >
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Program
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Status & Kategori
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
                                    {programs.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <Target
                                                        weight="duotone"
                                                        className="mb-3 h-12 w-12 text-slate-300"
                                                    />
                                                    <p>
                                                        Belum ada data program
                                                        kerja.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {programs.data.map((program: any) => (
                                        <tr
                                            key={program.id}
                                            className="transition-colors hover:bg-slate-50/80"
                                        >
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/programs/${program.id}`}
                                                    className="font-bold text-slate-900 transition-colors hover:text-blue-600"
                                                >
                                                    {program.title}
                                                </Link>
                                                <div className="mt-1 line-clamp-1 text-sm text-slate-500">
                                                    {program.description}
                                                </div>
                                                {program.users &&
                                                    program.users.length >
                                                        0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {program.users.map(
                                                                (u: any) => (
                                                                    <span
                                                                        key={
                                                                            u.id
                                                                        }
                                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.id === auth?.user?.id ? 'border border-blue-200 bg-blue-100 text-blue-700' : 'border border-slate-200 bg-slate-100 text-slate-600'}`}
                                                                    >
                                                                        {u.id ===
                                                                        auth
                                                                            ?.user
                                                                            ?.id
                                                                            ? '★ Anda'
                                                                            : u.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="mb-1">
                                                    {statusBadge(
                                                        program.status,
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {frequencyLabel(
                                                        program.frequency,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/programs/${program.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100"
                                                        title="Detail & Laporan"
                                                    >
                                                        <FileText
                                                            weight="bold"
                                                            className="h-4 w-4"
                                                        />
                                                        <span className="hidden sm:inline">
                                                            Laporan
                                                        </span>
                                                    </Link>
                                                    {canManageProgram && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    openEdit(
                                                                        program,
                                                                    )
                                                                }
                                                                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                                                                title="Edit Program"
                                                            >
                                                                <PencilSimple
                                                                    weight="bold"
                                                                    className="h-4 w-4"
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteProgram(
                                                                        program.id,
                                                                        program.title,
                                                                    )
                                                                }
                                                                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                                title="Hapus Program"
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
                        {programs.total > 0 && (
                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500">
                                Menampilkan {programs.data.length} dari total{' '}
                                {programs.total} program
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
