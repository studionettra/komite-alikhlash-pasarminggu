import { Link } from '@inertiajs/react';
import {
    Briefcase,
    Users,
    FileText,
    CalendarBlank,
} from '@phosphor-icons/react';

export default function SekretarisDashboard({
    metrics,
    recentMeetings,
    upcomingPrograms,
}: any) {
    return (
        <div className="space-y-8">
            <h2 className="px-1 text-lg font-semibold text-slate-900">
                Ringkasan Administratif
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Users weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Total Notulensi Rapat
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {metrics?.meetings || 0}
                    </div>
                </div>

                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Briefcase weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Program Kerja
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {metrics?.programs || 0}
                    </div>
                </div>

                <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <FileText weight="duotone" className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-500">
                        Total Dokumen Lampiran
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                        {metrics?.documents || 0}
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Rapat Terakhir */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <h3 className="font-bold text-slate-900">
                            Rapat Terakhir
                        </h3>
                        <Link
                            href="/meetings"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Kelola Rapat
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentMeetings?.map((meeting: any) => (
                            <div
                                key={meeting.id}
                                className="flex items-start gap-4 p-6 transition-colors hover:bg-slate-50/50"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <CalendarBlank weight="bold" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">
                                        {meeting.title}
                                    </div>
                                    <div className="mt-1 text-xs font-medium text-slate-500">
                                        {new Date(
                                            meeting.date,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    {meeting.notes && (
                                        <div className="mt-2 line-clamp-2 text-sm text-slate-600">
                                            {meeting.notes.substring(0, 100)}...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agenda Program */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <h3 className="font-bold text-slate-900">
                            Agenda Program Mendatang
                        </h3>
                        <Link
                            href="/programs"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {upcomingPrograms?.map((program: any) => (
                            <div
                                key={program.id}
                                className="p-6 transition-colors hover:bg-slate-50/50"
                            >
                                <Link
                                    href={`/programs/${program.id}`}
                                    className="block"
                                >
                                    <div className="font-bold text-slate-900 transition-colors hover:text-blue-600">
                                        {program.title}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                        <CalendarBlank
                                            weight="duotone"
                                            className="h-4 w-4 text-slate-400"
                                        />
                                        {program.start_date
                                            ? new Date(
                                                  program.start_date,
                                              ).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : '-'}
                                        {program.status === 'completed' ? (
                                            <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-700 uppercase">
                                                Selesai
                                            </span>
                                        ) : program.status === 'planned' ? (
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                                                Akan Datang
                                            </span>
                                        ) : (
                                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                                                Berlangsung
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
