import { Head, usePage, Link, useForm, router } from '@inertiajs/react';
import {
    CalendarBlank,
    FileText,
    UploadSimple,
    Trash,
    Image as ImageIcon,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    ArrowLeft,
    Plus,
    X,
} from '@phosphor-icons/react';
import { useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

function ActivityCard({ activity, programId, canManageProgram }: any) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { errors } = usePage().props as any;

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            router.post(
                '/documents',
                {
                    program_id: programId,
                    program_activity_id: activity.id,
                    file: e.target.files[0],
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    },
                    onFinish: () => setIsUploading(false),
                },
            );
        }
    };

    const deleteDocument = (id: number) => {
        confirmDelete('Yakin ingin menghapus dokumen ini?', () => {
            router.delete(`/documents/${id}`, { preserveScroll: true });
        });
    };

    const deleteActivity = (id: number) => {
        confirmDelete(
            'Yakin ingin menghapus sesi program ini? Pastikan sesi ini sudah kosong dari laporan dan transaksi.',
            () => {
                router.delete(`/program-activities/${id}`, {
                    preserveScroll: true,
                });
            },
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return '-';
        }

        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 p-5">
                <div>
                    <h4 className="text-lg font-bold text-slate-900">
                        {activity.title}
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CalendarBlank
                                weight="duotone"
                                className="h-4 w-4"
                            />
                            {formatDate(activity.activity_date)}
                        </div>
                        {activity.start_time && (
                            <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">
                                {activity.start_time.substring(0, 5)} —{' '}
                                {activity.end_time?.substring(0, 5) ||
                                    'Selesai'}{' '}
                                WIB
                            </div>
                        )}
                    </div>
                    {activity.description && (
                        <p className="mt-2 text-sm text-slate-600">
                            {activity.description}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm ${activity.status === 'completed' ? 'border-slate-200 bg-slate-100 text-slate-700' : activity.status === 'ongoing' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' : 'border-amber-200 bg-amber-100 text-amber-700'}`}
                    >
                        {activity.status === 'completed'
                            ? 'Selesai'
                            : activity.status === 'ongoing'
                              ? 'Sedang Berlangsung'
                              : 'Akan Datang'}
                    </span>
                    {canManageProgram && (
                        <button
                            onClick={() => deleteActivity(activity.id)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition-colors hover:text-rose-600"
                            title="Hapus Sesi"
                        >
                            <Trash weight="bold" className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-slate-700">
                        Lampiran & Dokumen ({activity.documents?.length || 0})
                    </h5>
                    {canManageProgram && (
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                            >
                                <UploadSimple weight="bold" />
                                {isUploading ? 'Mengunggah...' : 'Unggah File'}
                            </button>
                        </div>
                    )}
                </div>

                {errors?.file && (
                    <div className="mb-4 text-sm font-medium text-rose-600">
                        {errors.file}
                    </div>
                )}

                {activity.documents?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center">
                        <ImageIcon
                            weight="duotone"
                            className="mb-2 h-6 w-6 text-slate-300"
                        />
                        <p className="text-xs text-slate-500">
                            Belum ada lampiran di sesi ini.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {activity.documents?.map((doc: any) => {
                            const isImage = ['jpg', 'jpeg', 'png'].includes(
                                doc.file_type.toLowerCase(),
                            );

                            return (
                                <div
                                    key={doc.id}
                                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                                >
                                    {isImage ? (
                                        <img
                                            src={`/storage/${doc.file_path}`}
                                            alt="Dokumentasi"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center p-3">
                                            <FileText
                                                weight="duotone"
                                                className="mb-1 h-8 w-8 text-slate-400"
                                            />
                                            <span className="text-[10px] font-medium text-slate-500 uppercase">
                                                {doc.file_type}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                        <a
                                            href={`/storage/${doc.file_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 hover:bg-slate-100"
                                        >
                                            Lihat
                                        </a>
                                        {canManageProgram && (
                                            <button
                                                onClick={() =>
                                                    deleteDocument(doc.id)
                                                }
                                                className="rounded-full bg-rose-500 p-1.5 text-white hover:bg-rose-600"
                                                title="Hapus"
                                            >
                                                <Trash
                                                    weight="bold"
                                                    className="h-3.5 w-3.5"
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Show({ program, summary }: any) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManageProgram = ['Superadmin', 'Sekretaris'].includes(userRole);

    const [showActivityModal, setShowActivityModal] = useState(false);

    const {
        data: activityData,
        setData: setActivityData,
        post: postActivity,
        processing: processingActivity,
        errors: activityErrors,
        reset: resetActivity,
    } = useForm({
        program_id: program.id,
        title: '',
        activity_date: '',
        start_time: '',
        end_time: '',
        description: '',
    });

    const submitActivity = (e: any) => {
        e.preventDefault();
        postActivity('/program-activities', {
            preserveScroll: true,
            onSuccess: () => {
                setShowActivityModal(false);
                resetActivity();
            },
        });
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return '-';
        }

        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planned':
                return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'ongoing':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'planned':
                return 'Akan Datang';
            case 'ongoing':
                return 'Sedang Berlangsung';
            case 'completed':
                return 'Selesai';
            default:
                return status;
        }
    };

    const getFrequencyText = (freq: string) => {
        switch (freq) {
            case 'monthly':
                return 'Bulanan';
            case 'holiday':
                return 'Hari Besar';
            case 'incidental':
                return 'Insidental';
            default:
                return freq;
        }
    };

    return (
        <DashboardLayout>
            <Head title={`Laporan: ${program.title}`} />

            {/* Modal Create Activity */}
            {showActivityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <h3 className="text-lg font-bold text-slate-900">
                                Buat Sesi Program
                            </h3>
                            <button
                                onClick={() => setShowActivityModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X weight="bold" className="h-5 w-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={submitActivity}
                            className="space-y-4 p-6"
                        >
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Judul Sesi
                                </label>
                                <input
                                    type="text"
                                    value={activityData.title}
                                    placeholder="Contoh: Laporan Januari 2026"
                                    onChange={(e) =>
                                        setActivityData('title', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {activityErrors.title && (
                                    <div className="mt-1 text-xs text-rose-500">
                                        {activityErrors.title}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Tanggal Pelaksanaan
                                </label>
                                <input
                                    type="date"
                                    value={activityData.activity_date}
                                    onChange={(e) =>
                                        setActivityData(
                                            'activity_date',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {activityErrors.activity_date && (
                                    <div className="mt-1 text-xs text-rose-500">
                                        {activityErrors.activity_date}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Jam Mulai (WIB)
                                    </label>
                                    <input
                                        type="time"
                                        value={activityData.start_time}
                                        onChange={(e) =>
                                            setActivityData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {activityErrors.start_time && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {activityErrors.start_time}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Jam Selesai (WIB)
                                    </label>
                                    <input
                                        type="time"
                                        value={activityData.end_time}
                                        onChange={(e) =>
                                            setActivityData(
                                                'end_time',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {activityErrors.end_time && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {activityErrors.end_time}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Keterangan (Opsional)
                                </label>
                                <textarea
                                    value={activityData.description}
                                    onChange={(e) =>
                                        setActivityData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processingActivity}
                                    className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {processingActivity
                                        ? 'Menyimpan...'
                                        : 'Simpan Sesi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-6xl space-y-6">
                {/* Top Nav */}
                <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                    <ArrowLeft weight="bold" />
                    Kembali ke Daftar Program
                </Link>

                {/* Header Card */}
                <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 md:flex-row">
                    <div className="max-w-2xl space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(program.status)}`}
                            >
                                {getStatusText(program.status)}
                            </span>
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                {getFrequencyText(program.frequency)}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            {program.title}
                        </h1>
                        <p className="text-lg leading-relaxed text-slate-600">
                            {program.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CalendarBlank
                                    weight="duotone"
                                    className="h-5 w-5 text-slate-400"
                                />
                                {formatDate(program.start_date)} —{' '}
                                {formatDate(program.end_date) || 'Berlanjut'}
                            </div>
                        </div>

                        {/* Panitia Assignment */}
                        {program.users && program.users.length > 0 && (
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                <div className="mb-2 text-sm font-semibold text-slate-700">
                                    Tim Panitia:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {program.users.map((u: any) => (
                                        <div
                                            key={u.id}
                                            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${u.id === auth?.user?.id ? 'border border-blue-200 bg-blue-100 text-blue-800' : 'border border-slate-200 bg-slate-100 text-slate-700'}`}
                                        >
                                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-600 shadow-sm">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            {u.id === auth?.user?.id
                                                ? '★ Anda'
                                                : u.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Finance Summary & Documents Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Finance Summary Column (Col 1) */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Keuangan Program
                                </h3>
                                <Wallet
                                    weight="duotone"
                                    className="h-6 w-6 text-slate-400"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                            <ArrowDownRight weight="bold" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                                                Pemasukan
                                            </div>
                                            <div className="font-bold text-slate-900">
                                                {formatRupiah(summary.income)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                                            <ArrowUpRight weight="bold" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                                                Pengeluaran
                                            </div>
                                            <div className="font-bold text-slate-900">
                                                {formatRupiah(summary.expense)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <div className="mb-1 text-sm font-medium text-slate-500">
                                    Total Saldo Bersih
                                </div>
                                <div
                                    className={`text-3xl font-bold tracking-tight ${summary.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                                >
                                    {formatRupiah(summary.balance)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Program Activities (Col 2 & 3) */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                Laporan Program
                            </h3>
                            {canManageProgram && (
                                <button
                                    onClick={() => setShowActivityModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                                >
                                    <Plus weight="bold" />
                                    Sesi Baru
                                </button>
                            )}
                        </div>

                        {program.activities?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                                    <FileText
                                        weight="duotone"
                                        className="h-8 w-8 text-slate-400"
                                    />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">
                                    Belum ada sesi program
                                </h4>
                                <p className="mt-1 max-w-sm text-sm text-slate-500">
                                    Buat sesi untuk mengelompokkan laporan per
                                    bulan atau per pelaksanaan program.
                                </p>
                                {canManageProgram && (
                                    <button
                                        onClick={() =>
                                            setShowActivityModal(true)
                                        }
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                    >
                                        <Plus
                                            weight="bold"
                                            className="h-4 w-4"
                                        />
                                        Buat Sesi Pertama
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {program.activities?.map((activity: any) => (
                                    <ActivityCard
                                        key={activity.id}
                                        activity={activity}
                                        programId={program.id}
                                        canManageProgram={canManageProgram}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
