import { Head, router } from '@inertiajs/react';
import {
    CaretDown,
    CalendarBlank,
    Clock,
    BookOpen,
    CheckCircle,
} from '@phosphor-icons/react';
import { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';

export default function AcademicCalendar({ academicYear, allYears }: any) {
    const [openMonths, setOpenMonths] = useState<number[]>(
        academicYear?.months?.length > 0 ? [academicYear.months[0].id] : [],
    );

    const toggleMonth = (id: number) => {
        setOpenMonths((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
        );
    };

    const handleYearChange = (e: any) => {
        router.get(
            '/kalender-akademik',
            { year_id: e.target.value },
            { preserveState: true },
        );
    };

    if (!academicYear) {
        return (
            <PublicLayout>
                <Head title="Kalender Akademik - KBIT-TKIT Al-Ikhlash" />
                <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="text-slate-500">
                        Belum ada data kalender akademik.
                    </p>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head
                title={`Kalender Akademik ${academicYear.name} - KBIT-TKIT Al-Ikhlash`}
            />

            {/* Header Section */}
            <div className="bg-slate-50 py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-extrabold text-blue-700">
                            <CalendarBlank className="h-4 w-4" weight="bold" />
                            Tahun Ajaran {academicYear.name}
                        </span>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                        Kalender Akademik
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600">
                        Agenda kegiatan sekolah dan program pembelajaran selama
                        satu tahun penuh. Jadwal dapat berubah sewaktu-waktu
                        sesuai dengan kondisi dan kebijakan sekolah.
                    </p>

                    {allYears.length > 1 && (
                        <div className="mt-8">
                            <select
                                value={academicYear.id}
                                onChange={handleYearChange}
                                className="rounded-full border-2 border-slate-200 py-3 pr-10 pl-5 text-sm font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                {allYears.map((year: any) => (
                                    <option key={year.id} value={year.id}>
                                        Tahun Ajaran {year.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white py-12 md:py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {academicYear.months?.map((month: any) => {
                            const isOpen = openMonths.includes(month.id);

                            return (
                                <div
                                    key={month.id}
                                    className="hover-float overflow-hidden rounded-[2.5rem] border-2 border-slate-100 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-lg"
                                >
                                    <button
                                        onClick={() => toggleMonth(month.id)}
                                        className="flex w-full items-center justify-between bg-slate-50 p-6 text-left transition-colors hover:bg-slate-100 sm:p-8"
                                    >
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-slate-900">
                                                {month.name} {month.year}
                                            </h2>
                                            {month.effective_days && (
                                                <p className="mt-1 text-sm font-medium text-slate-500">
                                                    Hari Efektif:{' '}
                                                    {month.effective_days}
                                                </p>
                                            )}
                                        </div>
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        >
                                            <CaretDown className="h-5 w-5 text-slate-500" />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 p-6 md:p-8">
                                            <div className="grid gap-12 md:grid-cols-2">
                                                {/* Kegiatan */}
                                                <div>
                                                    <h3 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-slate-900">
                                                        <Clock className="h-6 w-6 text-blue-500" weight="fill" />
                                                        Kegiatan & Agenda
                                                    </h3>
                                                    {month.activities?.length >
                                                    0 ? (
                                                        <ul className="space-y-4">
                                                            {month.activities.map(
                                                                (
                                                                    activity: any,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            activity.id
                                                                        }
                                                                        className="relative flex gap-4"
                                                                    >
                                                                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-start gap-3">
                                                                                {activity.date_string && (
                                                                                    <span className="inline-flex mt-0.5 whitespace-nowrap rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-extrabold tracking-wide text-blue-700">
                                                                                        Tgl. {
                                                                                            activity.date_string
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                                <span className="text-lg font-bold text-slate-900 leading-snug">
                                                                                    {
                                                                                        activity.name
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            {activity.description && (
                                                                                <div className="mt-1 text-sm text-slate-600">
                                                                                    {
                                                                                        activity.description
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                            {activity.is_committee_program && (
                                                                                <div className="mt-2 inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                                                                    Program
                                                                                    Komite
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-slate-500">
                                                            Tidak ada agenda
                                                            khusus di bulan ini.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Program Pembelajaran */}
                                                <div>
                                                    <h3 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-slate-900">
                                                        <BookOpen className="h-6 w-6 text-emerald-500" weight="fill" />
                                                        Program Pembelajaran
                                                    </h3>
                                                    {month.learning_programs
                                                        ?.length > 0 ? (
                                                        <ul className="space-y-4">
                                                            {month.learning_programs.map(
                                                                (
                                                                    program: any,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            program.id
                                                                        }
                                                                        className="rounded-3xl border-2 border-slate-100 bg-slate-50 p-6"
                                                                    >
                                                                        <div className="mb-2 flex items-center justify-between">
                                                                            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                                                Minggu{' '}
                                                                                {
                                                                                    program.week_string
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs font-medium text-slate-500">
                                                                                Tgl. {
                                                                                    program.date_string
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <h4 className="font-semibold text-slate-900">
                                                                            {
                                                                                program.topic
                                                                            }
                                                                        </h4>
                                                                        {program.sub_topic && (
                                                                            <p className="mt-1 text-sm text-slate-600">
                                                                                {
                                                                                    program.sub_topic
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {program.description && (
                                                                            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700">
                                                                                <CheckCircle
                                                                                    className="h-4 w-4"
                                                                                    weight="fill"
                                                                                />
                                                                                {
                                                                                    program.description
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-slate-500">
                                                            Tidak ada data
                                                            program
                                                            pembelajaran.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
