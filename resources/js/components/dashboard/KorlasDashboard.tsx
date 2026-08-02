import { Link } from '@inertiajs/react';
import {
    Users,
    Wallet,
    CheckCircle,
    WarningCircle,
    Info,
    ArrowRight,
} from '@phosphor-icons/react';

export default function KorlasDashboard({
    classroom,
    students_count,
    current_collection,
    formatRupiah,
}: any) {
    if (!classroom) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Info weight="duotone" className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Belum Ada Kelas
                </h3>
                <p className="max-w-md text-slate-500">
                    Akun Anda saat ini belum ditautkan ke kelas mana pun. Silakan hubungi Admin untuk penugasan kelas agar Anda dapat mengelola data siswa dan setoran kas.
                </p>
            </div>
        );
    }

    const getCollectionStatus = () => {
        if (!current_collection) {
return { label: 'Belum Ada Draf', color: 'bg-slate-100 text-slate-600', icon: Info };
}

        switch (current_collection.status) {
            case 'draft':
                return { label: 'Draf (Sedang Berjalan)', color: 'bg-amber-100 text-amber-700', icon: WarningCircle };
            case 'submitted':
                return { label: 'Menunggu Verifikasi', color: 'bg-blue-100 text-blue-700', icon: Info };
            case 'verified':
                return { label: 'Lunas & Terverifikasi', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle };
            case 'rejected':
                return { label: 'Ditolak (Perlu Perbaikan)', color: 'bg-rose-100 text-rose-700', icon: WarningCircle };
            default:
                return { label: current_collection.status, color: 'bg-slate-100 text-slate-700', icon: Info };
        }
    };

    const StatusIcon = getCollectionStatus().icon;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="px-1 text-lg font-semibold text-slate-900">
                    Ringkasan Kelas {classroom.name}
                </h2>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Bulan: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Siswa */}
                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Users weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Total Siswa Aktif
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {students_count || 0}
                    </div>
                    <div className="mt-4">
                        <Link
                            href="/korlas/students"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        >
                            Kelola Siswa <ArrowRight weight="bold" />
                        </Link>
                    </div>
                </div>

                {/* Status Setoran */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Wallet weight="duotone" className="h-6 w-6" />
                        </div>
                        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${getCollectionStatus().color}`}>
                            <StatusIcon weight="bold" className="h-3.5 w-3.5" />
                            {getCollectionStatus().label}
                        </span>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Terkumpul Bulan Ini
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {formatRupiah((current_collection?.total_kas || 0) + (current_collection?.total_jumat_berkah || 0))}
                    </div>
                    <div className="mt-4">
                        <Link
                            href="/korlas/collections"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                        >
                            Laporan Setoran <ArrowRight weight="bold" />
                        </Link>
                    </div>
                </div>

                {/* Info Tambahan */}
                <div className="group rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
                            <Info weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="mb-2 font-bold">Panduan Korlas</h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                        Pastikan seluruh data siswa sudah terinput sebelum Anda membuat tagihan setoran. Setoran wajib disubmit ke Bendahara setiap akhir bulan.
                    </p>
                </div>
            </div>
        </div>
    );
}
