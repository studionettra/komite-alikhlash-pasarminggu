import { useState, useMemo, useEffect } from 'react';
import { CaretLeft, CaretRight, CalendarBlank, Clock } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';

export default function ProgramCalendar({ activePrograms }: { activePrograms: any[] }) {
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
                            date: new Date(act.activity_date.split('T')[0] + 'T00:00:00'),
                            startTime: act.start_time,
                            endTime: act.end_time,
                            type: p.frequency === 'monthly' ? 'Bulanan' : p.frequency === 'holiday' ? 'PHBI' : 'Insidental'
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
                    type: p.frequency === 'monthly' ? 'Bulanan' : p.frequency === 'holiday' ? 'PHBI' : 'Insidental'
                });
            }
        });
        return evts.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [activePrograms]);

    // Automatically select the next upcoming event date if today has no events
    useEffect(() => {
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const hasEventToday = events.some(e => e.dateStr === todayStr);
        if (!hasEventToday && events.length > 0) {
            const upcoming = events.find(e => e.date >= new Date(new Date().setHours(0,0,0,0)));
            if (upcoming) {
                setSelectedDate(upcoming.date);
                setCurrentDate(upcoming.date);
            } else {
                // if no upcoming, just select the last one
                setSelectedDate(events[events.length - 1].date);
                setCurrentDate(events[events.length - 1].date);
            }
        }
    }, [events]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days = [];
        const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        // Headers
        weekDays.forEach(day => {
            days.push(
                <div key={`header-${day}`} className="text-center font-semibold text-xs text-slate-500 py-2">
                    {day}
                </div>
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
            const isSelected = selectedDate && selectedDate.toLocaleDateString('en-CA') === dateStr;
            
            const dayEvents = events.filter(e => e.dateStr === dateStr);
            const hasEvent = dayEvents.length > 0;

            days.push(
                <button
                    key={`day-${i}`}
                    onClick={() => setSelectedDate(dateObj)}
                    className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-200
                        ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-slate-100 text-slate-700'}
                        ${isToday && !isSelected ? 'text-blue-600 font-bold bg-blue-50/50' : ''}
                    `}
                >
                    <span>{i}</span>
                    {hasEvent && (
                        <div className="flex gap-1 absolute bottom-1.5">
                            {dayEvents.slice(0, 3).map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></div>
                            ))}
                        </div>
                    )}
                </button>
            );
        }

        return <div className="grid grid-cols-7 gap-1">{days}</div>;
    };

    const selectedEvents = selectedDate 
        ? events.filter(e => e.dateStr === `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`)
        : [];

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return (
        <section className="py-24 bg-white relative border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Jadwal Terdekat</h2>
                        <p className="text-slate-600 mt-3 text-lg leading-relaxed">
                            Pantau agenda dan sesi kegiatan komite secara interaktif melalui kalender program kami.
                        </p>
                    </div>
                    <Link 
                        href="/program" 
                        className="inline-flex px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-[1px] transition-all whitespace-nowrap shadow-sm"
                    >
                        Lihat Semua Program
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Col: Calendar */}
                    <div className="lg:col-span-5 bg-slate-50 rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm h-fit">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button onClick={prevMonth} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm">
                                    <CaretLeft weight="bold" />
                                </button>
                                <button onClick={nextMonth} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm">
                                    <CaretRight weight="bold" />
                                </button>
                            </div>
                        </div>
                        {renderCalendarGrid()}
                    </div>

                    {/* Right Col: Event Details */}
                    <div className="lg:col-span-7 flex flex-col h-full">
                        <div className="mb-8 pb-5 border-b border-slate-200 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <CalendarBlank weight="duotone" className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                                    {selectedDate ? selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih Tanggal'}
                                </h4>
                                <p className="text-sm font-medium text-slate-500 mt-1">
                                    {selectedEvents.length} kegiatan dijadwalkan
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            {selectedEvents.length === 0 ? (
                                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[2rem] border border-slate-200 border-dashed">
                                    <CalendarBlank weight="duotone" className="w-12 h-12 text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-medium text-lg">Tidak ada kegiatan di tanggal ini.</p>
                                    <p className="text-slate-400 text-sm mt-2">Pilih tanggal dengan indikator titik untuk melihat jadwal.</p>
                                </div>
                            ) : (
                                selectedEvents.map((evt, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col sm:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                                                    {evt.type}
                                                </span>
                                                {evt.startTime && (
                                                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                                                        <Clock weight="fill" />
                                                        {evt.startTime.substring(0, 5)} {evt.endTime ? `- ${evt.endTime.substring(0, 5)}` : ''} WIB
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                                                {evt.title}
                                            </h3>
                                            <p className="text-slate-600 text-base leading-relaxed mb-6 line-clamp-2">
                                                {evt.description || 'Tidak ada deskripsi rinci untuk kegiatan ini.'}
                                            </p>
                                        </div>
                                        <div className="sm:w-auto flex items-center justify-start sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-6 sm:pt-0 sm:pl-8">
                                            <Link 
                                                href={`/program?id=${evt.programId}`}
                                                className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 hover:-translate-y-[1px] transition-all whitespace-nowrap shadow-sm"
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
