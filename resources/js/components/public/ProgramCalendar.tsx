import { Link } from '@inertiajs/react';
import {
    CaretLeft,
    CaretRight,
    CalendarBlank,
    Clock,
} from '@phosphor-icons/react';
import { useState, useMemo, useEffect } from 'react';

export default function ProgramCalendar({
    activePrograms,
}: {
    activePrograms: any[];
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const events = useMemo(() => {
        const evts: any[] = [];
        activePrograms.forEach((p) => {
            if (p.activities && p.activities.length > 0) {
                p.activities.forEach((act: any) => {
                    if (act.activity_date) {
                        evts.push({
                            id: `act-${act.id}`,
                            programId: p.id,
                            title: act.title || p.title,
                            description: p.description,
                            dateStr: act.activity_date.split('T')[0],
                            date: new Date(
                                act.activity_date.split('T')[0] + 'T00:00:00',
                            ),
                            startTime: act.start_time,
                            endTime: act.end_time,
                            type:
                                p.frequency === 'monthly'
                                    ? 'Bulanan'
                                    : p.frequency === 'holiday'
                                      ? 'PHBI'
                                      : 'Insidental',
                        });
                    }
                });
            } else if (p.start_date) {
                evts.push({
                    id: `prog-${p.id}`,
                    programId: p.id,
                    title: p.title,
                    description: p.description,
                    dateStr: p.start_date.split('T')[0],
                    date: new Date(p.start_date.split('T')[0] + 'T00:00:00'),
                    startTime: null,
                    endTime: null,
                    type:
                        p.frequency === 'monthly'
                            ? 'Bulanan'
                            : p.frequency === 'holiday'
                              ? 'PHBI'
                              : 'Insidental',
                });
            }
        });

        return evts.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [activePrograms]);

    // Automatically select the next upcoming event date if today has no events
    useEffect(() => {
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const hasEventToday = events.some((e) => e.dateStr === todayStr);

        if (!hasEventToday && events.length > 0) {
            const upcoming = events.find(
                (e) => e.date >= new Date(new Date().setHours(0, 0, 0, 0)),
            );

            /* eslint-disable react-hooks/set-state-in-effect */
            if (upcoming) {
                setSelectedDate(upcoming.date);
                setCurrentDate(upcoming.date);
            } else {
                // if no upcoming, just select the last one
                setSelectedDate(events[events.length - 1].date);
                setCurrentDate(events[events.length - 1].date);
            }
            /* eslint-enable react-hooks/set-state-in-effect */
        }
    }, [events]);

    const prevMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        );
    const nextMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        );

    const getDaysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) =>
        new Date(year, month, 1).getDay();

    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        // Headers
        weekDays.forEach((day) => {
            days.push(
                <div
                    key={`header-${day}`}
                    className="py-2 text-center text-xs font-semibold text-slate-500"
                >
                    {day}
                </div>,
            );
        });

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = new Date().toLocaleDateString('en-CA') === dateStr;
            const isSelected =
                selectedDate &&
                selectedDate.toLocaleDateString('en-CA') === dateStr;

            const dayEvents = events.filter((e) => e.dateStr === dateStr);
            const hasEvent = dayEvents.length > 0;

            days.push(
                <button
                    key={`day-${i}`}
                    onClick={() => setSelectedDate(dateObj)}
                    className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-700 hover:bg-slate-100'} ${isToday && !isSelected ? 'bg-blue-50/50 font-bold text-blue-600' : ''} `}
                >
                    <span>{i}</span>
                    {hasEvent && (
                        <div className="absolute bottom-1.5 flex gap-1">
                            {dayEvents.slice(0, 3).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}
                                ></div>
                            ))}
                        </div>
                    )}
                </button>,
            );
        }

        return <div className="grid grid-cols-7 gap-1">{days}</div>;
    };

    const selectedEvents = selectedDate
        ? events.filter(
              (e) =>
                  e.dateStr ===
                  `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
          )
        : [];

    const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];

    return (
        <section className="relative border-t border-slate-100 bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Jadwal Terdekat
                        </h2>
                        <p className="mt-3 text-lg leading-relaxed text-slate-600">
                            Pantau agenda dan sesi kegiatan komite secara
                            interaktif melalui kalender program kami.
                        </p>
                    </div>
                    <Link
                        href="/program"
                        className="inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold whitespace-nowrap text-slate-700 shadow-sm transition-all hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50"
                    >
                        Lihat Semua Program
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Col: Calendar */}
                    <div className="h-fit rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8 lg:col-span-5">
                        <div className="mb-8 flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                {monthNames[currentDate.getMonth()]}{' '}
                                {currentDate.getFullYear()}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevMonth}
                                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
                                >
                                    <CaretLeft weight="bold" />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
                                >
                                    <CaretRight weight="bold" />
                                </button>
                            </div>
                        </div>
                        {renderCalendarGrid()}
                    </div>

                    {/* Right Col: Event Details */}
                    <div className="flex h-full flex-col lg:col-span-7">
                        <div className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                <CalendarBlank
                                    weight="duotone"
                                    className="h-6 w-6"
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold tracking-tight text-slate-900">
                                    {selectedDate
                                        ? selectedDate.toLocaleDateString(
                                              'id-ID',
                                              {
                                                  weekday: 'long',
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              },
                                          )
                                        : 'Pilih Tanggal'}
                                </h4>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    {selectedEvents.length} kegiatan dijadwalkan
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            {selectedEvents.length === 0 ? (
                                <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                    <CalendarBlank
                                        weight="duotone"
                                        className="mb-4 h-12 w-12 text-slate-300"
                                    />
                                    <p className="text-lg font-medium text-slate-500">
                                        Tidak ada kegiatan di tanggal ini.
                                    </p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Pilih tanggal dengan indikator titik
                                        untuk melihat jadwal.
                                    </p>
                                </div>
                            ) : (
                                selectedEvents.map((evt, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:flex-row sm:p-8"
                                    >
                                        <div className="flex-1">
                                            <div className="mb-4 flex items-center gap-3">
                                                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                                                    {evt.type}
                                                </span>
                                                {evt.startTime && (
                                                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                                                        <Clock weight="fill" />
                                                        {evt.startTime.substring(
                                                            0,
                                                            5,
                                                        )}{' '}
                                                        {evt.endTime
                                                            ? `- ${evt.endTime.substring(0, 5)}`
                                                            : ''}{' '}
                                                        WIB
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="mb-3 text-2xl leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                                {evt.title}
                                            </h3>
                                            <p className="mb-6 line-clamp-2 text-base leading-relaxed text-slate-600">
                                                {evt.description ||
                                                    'Tidak ada deskripsi rinci untuk kegiatan ini.'}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-start border-t border-slate-100 pt-6 sm:w-auto sm:justify-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                                            <Link
                                                href={`/program?id=${evt.programId}`}
                                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 font-semibold whitespace-nowrap text-white shadow-sm transition-all hover:-translate-y-[1px] hover:bg-slate-800"
                                            >
                                                Lihat Program
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
