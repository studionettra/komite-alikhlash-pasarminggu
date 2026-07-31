import { Head } from '@inertiajs/react';
import {
    X,
    FileText,
    CalendarBlank,
    Clock,
    FolderOpen,
} from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import PublicLayout from '../../layouts/PublicLayout';

export default function Programs({ programs }: any) {
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'jadwal' | 'laporan'>('jadwal');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (id && programs) {
            const program = programs.find((p: any) => p.id === parseInt(id));

            if (program) {
                openProgram(program);
            }
        }
    }, [programs]);

    function openProgram(program: any) {
        setSelectedProgram(program);
        setActiveTab('jadwal');
    }

    const hasReports = (program: any) => {
        const hasDirectDocs = program.documents && program.documents.length > 0;
        const hasActivityDocs =
            program.activities &&
            program.activities.some(
                (act: any) => act.documents && act.documents.length > 0,
            );

        return hasDirectDocs || hasActivityDocs;
    };

    const renderJadwal = (program: any) => {
        if (!program.activities || program.activities.length === 0) {
            return (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
                    <CalendarBlank
                        className="mx-auto mb-3 h-12 w-12 text-slate-300"
                        weight="duotone"
                    />
                    Belum ada rincian jadwal / sesi untuk program ini.
                </div>
            );
        }

        // Sort activities by date ASC for timeline
        const sortedActivities = [...program.activities].sort(
            (a: any, b: any) =>
                new Date(a.activity_date).getTime() -
                new Date(b.activity_date).getTime(),
        );

        // Group by month
        const grouped: { [key: string]: any[] } = {};
        sortedActivities.forEach((act) => {
            const date = new Date(act.activity_date);
            const monthYear = date.toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
            });

            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }

            grouped[monthYear].push(act);
        });

        return (
            <div className="space-y-6">
                {Object.entries(grouped).map(([monthYear, activities]) => (
                    <div
                        key={monthYear}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold tracking-wider text-slate-700 uppercase">
                            <CalendarBlank
                                weight="bold"
                                className="text-blue-600"
                            />
                            {monthYear}
                        </div>
                        <div className="divide-y divide-slate-100">
                            {activities.map((act: any, idx: number) => (
                                <div
                                    key={act.id}
                                    className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-blue-600 shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-base leading-snug font-bold text-slate-900">
                                                {act.title}
                                            </h4>
                                            {act.description && (
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {act.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-col rounded-lg border border-slate-100 bg-white px-4 py-2 text-sm shadow-sm sm:items-end">
                                        <span className="mb-0.5 text-xs font-bold tracking-wide text-slate-800 uppercase">
                                            {new Date(
                                                act.activity_date,
                                            ).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                            })}
                                        </span>
                                        <span className="mb-1 font-medium text-slate-500">
                                            {new Date(
                                                act.activity_date,
                                            ).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        {act.start_time && (
                                            <span className="mt-0.5 flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
                                                <Clock
                                                    weight="bold"
                                                    className="h-3 w-3"
                                                />
                                                {act.start_time.substring(0, 5)}{' '}
                                                -{' '}
                                                {act.end_time
                                                    ? act.end_time.substring(
                                                          0,
                                                          5,
                                                      )
                                                    : 'Selesai'}{' '}
                                                WIB
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderReports = (program: any) => {
        if (!hasReports(program)) {
            return (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
                    <FolderOpen
                        className="mx-auto mb-3 h-12 w-12 text-slate-300"
                        weight="duotone"
                    />
                    Belum ada arsip dokumentasi atau laporan.
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Direct Documents */}
                {program.documents && program.documents.length > 0 && (
                    <div>
                        <h4 className="mb-3 text-sm font-bold tracking-wider text-slate-700 uppercase">
                            Laporan Umum
                        </h4>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {program.documents.map((doc: any) => (
                                <DocumentCard key={doc.id} doc={doc} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Activity Documents */}
                {program.activities &&
                    program.activities
                        .filter(
                            (act: any) =>
                                act.documents && act.documents.length > 0,
                        )
                        .map((act: any) => (
                            <div key={act.id}>
                                <div className="mb-3 flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-800">
                                        {act.title}
                                    </h4>
                                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                        <CalendarBlank weight="bold" />
                                        {new Date(
                                            act.activity_date,
                                        ).toLocaleDateString('id-ID', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {act.documents.map((doc: any) => (
                                        <DocumentCard key={doc.id} doc={doc} />
                                    ))}
                                </div>
                            </div>
                        ))}
            </div>
        );
    };

    return (
        <PublicLayout>
            <Head title="Program Kerja - Komite KBIT-TKIT Al-Ikhlash Pasar Minggu" />

            <section className="bg-slate-900 py-20 text-center text-white">
                <div className="mx-auto max-w-4xl px-4">
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
                        Daftar Program Kerja
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                        Seluruh inisiatif dan program Komite KBIT-TKIT
                        Al-Ikhlash Pasar Minggu disusun untuk mendukung
                        perkembangan peserta didik secara optimal.
                    </p>
                </div>
            </section>

            <section className="-mt-10 py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
                        {programs.length === 0 ? (
                            <div className="py-20 text-center text-slate-500">
                                Belum ada data program kerja.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {programs.map((program: any) => (
                                    <div
                                        key={program.id}
                                        onClick={() => openProgram(program)}
                                        className="group flex cursor-pointer flex-col rounded-2xl border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider text-slate-600 uppercase transition-colors group-hover:bg-blue-100 group-hover:text-blue-700">
                                                {program.frequency === 'monthly'
                                                    ? 'Bulanan'
                                                    : program.frequency ===
                                                        'holiday'
                                                      ? 'PHBI'
                                                      : 'Insidental'}
                                            </span>
                                            <span className="text-sm font-medium text-slate-400">
                                                {program.start_date
                                                    ? new Date(
                                                          program.start_date,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              month: 'short',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '-'}
                                            </span>
                                        </div>
                                        <h3 className="mb-3 text-xl leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                                            {program.title}
                                        </h3>
                                        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                                            {program.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                Status:
                                                {program.status ===
                                                'ongoing' ? (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>{' '}
                                                        Berlangsung
                                                    </span>
                                                ) : program.status ===
                                                  'planned' ? (
                                                    <span className="flex items-center gap-1 text-orange-500">
                                                        <div className="h-2 w-2 rounded-full bg-orange-400"></div>{' '}
                                                        Akan Datang
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-slate-500">
                                                        <div className="h-2 w-2 rounded-full bg-slate-400"></div>{' '}
                                                        Selesai
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-sm font-bold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                                                Lihat Detail &rarr;
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal Detail Program */}
            {selectedProgram && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6">
                    <div className="animate-in fade-in zoom-in-95 my-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-200">
                        <div className="z-10 flex shrink-0 items-start justify-between border-b border-slate-100 bg-white px-6 py-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">
                                    {selectedProgram.title}
                                </h2>
                                <div className="mt-2 flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-500">
                                        {selectedProgram.frequency === 'monthly'
                                            ? 'Program Bulanan'
                                            : selectedProgram.frequency ===
                                                'holiday'
                                              ? 'Program PHBI'
                                              : 'Program Insidental'}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                    {selectedProgram.status === 'ongoing' ? (
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>{' '}
                                            Sedang Berlangsung
                                        </span>
                                    ) : selectedProgram.status === 'planned' ? (
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-orange-500">
                                            <div className="h-2 w-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50"></div>{' '}
                                            Akan Datang
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                            <div className="h-2 w-2 rounded-full bg-slate-400"></div>{' '}
                                            Selesai
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedProgram(null)}
                                className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X weight="bold" className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex shrink-0 gap-6 border-b border-slate-200 bg-slate-50 px-6 pt-4">
                            <button
                                onClick={() => setActiveTab('jadwal')}
                                className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors ${activeTab === 'jadwal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <Clock
                                    weight={
                                        activeTab === 'jadwal'
                                            ? 'fill'
                                            : 'regular'
                                    }
                                    className="h-5 w-5"
                                />
                                Jadwal / Agenda
                            </button>
                            <button
                                onClick={() => setActiveTab('laporan')}
                                className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors ${activeTab === 'laporan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <FolderOpen
                                    weight={
                                        activeTab === 'laporan'
                                            ? 'fill'
                                            : 'regular'
                                    }
                                    className="h-5 w-5"
                                />
                                Arsip Laporan
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            {selectedProgram.description && (
                                <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
                                    {selectedProgram.description}
                                </div>
                            )}

                            <div>
                                {activeTab === 'jadwal'
                                    ? renderJadwal(selectedProgram)
                                    : renderReports(selectedProgram)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

function DocumentCard({ doc }: { doc: any }) {
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(
        doc.file_type.toLowerCase(),
    );

    return (
        <div className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
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
                        className="mb-2 h-8 w-8 text-slate-400 transition-colors group-hover:text-blue-500"
                    />
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        {doc.file_type}
                    </span>
                </div>
            )}

            <a
                href={`/storage/${doc.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            >
                <span className="translate-y-2 transform rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-slate-100">
                    Lihat
                </span>
            </a>
        </div>
    );
}
