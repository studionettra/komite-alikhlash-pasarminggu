import { Link } from '@inertiajs/react';
import { Wallet, Megaphone, CalendarBlank } from '@phosphor-icons/react';

export default function AnggotaDashboard({
    metrics,
    activePrograms,
    recentMeetings,
    formatRupiah,
}: any) {
    return (
        <div className="space-y-8">
            <h2 className="px-1 text-lg font-semibold text-slate-900">
                Informasi Komite
            </h2>

            {/* Transparency Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-xl shadow-emerald-900/20">
                <div className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                            <Wallet weight="bold" /> Transparansi Kas
                        </div>
                        <div className="mb-1 text-sm font-medium text-emerald-100">
                            Total Saldo Kas Tersedia
                        </div>
                        <div className="text-4xl font-extrabold tracking-tight md:text-5xl">
                            {formatRupiah(metrics?.balance || 0)}
                        </div>
                    </div>
                    <Link
                        href="/programs"
                        className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
                    >
                        Lihat Program Kerja
                    </Link>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pengumuman Program */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <Megaphone
                            weight="duotone"
                            className="h-5 w-5 text-amber-500"
                        />
                        <h3 className="font-bold text-slate-900">
                            Agenda Program Sedang Berlangsung
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {activePrograms?.length > 0 ? (
                            activePrograms.map((prog: any) => (
                                <div key={prog.id} className="p-6">
                                    <div className="mb-2 text-lg font-bold text-slate-900">
                                        {prog.title}
                                    </div>
                                    <p className="mb-3 text-sm text-slate-600">
                                        {prog.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                        <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-700">
                                            {prog.frequency === 'monthly'
                                                ? 'Bulanan'
                                                : prog.frequency === 'holiday'
                                                  ? 'Hari Besar'
                                                  : 'Insidental'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Belum ada agenda program saat ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* Notulensi Rapat */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <CalendarBlank
                                weight="duotone"
                                className="h-5 w-5 text-blue-500"
                            />
                            <h3 className="font-bold text-slate-900">
                                Hasil Rapat Terakhir
                            </h3>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentMeetings?.length > 0 ? (
                            recentMeetings.map((meeting: any) => (
                                <div key={meeting.id} className="p-6">
                                    <div className="font-bold text-slate-900">
                                        {meeting.title}
                                    </div>
                                    <div className="mt-1 mb-3 text-xs font-medium text-slate-500">
                                        {new Date(
                                            meeting.date,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div className="line-clamp-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 italic">
                                        "
                                        {meeting.notes ||
                                            'Belum ada notulensi tertulis.'}
                                        "
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Belum ada catatan rapat.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
