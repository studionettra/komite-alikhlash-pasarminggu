import { Link } from '@inertiajs/react';
import {
    Briefcase,
    Users,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
} from '@phosphor-icons/react';

export default function SuperadminDashboard({
    metrics,
    recentTransactions,
    ongoingPrograms,
    formatRupiah,
}: any) {
    return (
        <div className="space-y-8">
            <h2 className="px-1 text-lg font-semibold text-slate-900">
                Ringkasan Aktivitas Komite
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Briefcase weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Total Program Kerja
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {metrics?.programs || 0}
                    </div>
                </div>

                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Users weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Notulensi Rapat
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {metrics?.meetings || 0}
                    </div>
                </div>

                <div className="group rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
                            <Users weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-2 text-sm font-medium text-slate-300">
                        Aksi Cepat Superadmin
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <Link
                            href="/admin/classrooms"
                            className="inline-flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                        >
                            Kelola Kelas & Korlas <ArrowUpRight weight="bold" />
                        </Link>
                        <Link
                            href="/users"
                            className="inline-flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                        >
                            Kelola Pengguna <ArrowUpRight weight="bold" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Transaksi Terakhir */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <h3 className="font-bold text-slate-900">
                            Transaksi Terakhir
                        </h3>
                        <Link
                            href="/transactions"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentTransactions?.map((trx: any) => (
                            <div
                                key={trx.id}
                                className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
                                    >
                                        {trx.type === 'income' ? (
                                            <ArrowDownRight weight="bold" />
                                        ) : (
                                            <ArrowUpRight weight="bold" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">
                                            {trx.description}
                                        </div>
                                        <div className="mt-0.5 text-xs font-medium text-slate-500">
                                            {new Date(
                                                trx.date,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                                >
                                    {trx.type === 'income' ? '+' : '-'}
                                    {formatRupiah(trx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Program Ongoing */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <h3 className="font-bold text-slate-900">
                            Program Berlangsung
                        </h3>
                        <Link
                            href="/programs"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {ongoingPrograms?.map((prog: any) => (
                            <div
                                key={prog.id}
                                className="p-6 transition-colors hover:bg-slate-50/50"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link
                                            href={`/programs/${prog.id}`}
                                            className="font-bold text-slate-900 transition-colors hover:text-blue-600"
                                        >
                                            {prog.title}
                                        </Link>
                                        <div className="mt-1 line-clamp-1 text-sm text-slate-500">
                                            {prog.description}
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        Ongoing
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
