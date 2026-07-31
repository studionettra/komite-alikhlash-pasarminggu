import { Link } from '@inertiajs/react';
import { Briefcase, Users, FileText, CalendarBlank } from '@phosphor-icons/react';

export default function SekretarisDashboard({ metrics, recentMeetings, upcomingPrograms }: any) {
    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold text-slate-900 px-1">Ringkasan Administratif</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <Users weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Total Notulensi Rapat</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{metrics?.meetings || 0}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Briefcase weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Program Kerja</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{metrics?.programs || 0}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <FileText weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Total Dokumen Lampiran</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{metrics?.documents || 0}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Rapat Terakhir */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900">Rapat Terakhir</h3>
                        <Link href="/meetings" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Kelola Rapat</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentMeetings?.map((meeting: any) => (
                            <div key={meeting.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                    <CalendarBlank weight="bold" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{meeting.title}</div>
                                    <div className="text-xs font-medium text-slate-500 mt-1">{new Date(meeting.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                                    {meeting.notes && (
                                        <div className="text-sm text-slate-600 mt-2 line-clamp-2">{meeting.notes.substring(0, 100)}...</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agenda Program */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900">Agenda Program Mendatang</h3>
                        <Link href="/programs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {upcomingPrograms?.map((program: any) => (
                            <div key={program.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <Link href={`/programs/${program.id}`} className="block">
                                    <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">{program.title}</div>
                                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                        <CalendarBlank weight="duotone" className="w-4 h-4 text-slate-400" />
                                        {program.start_date ? new Date(program.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}
                                        {program.status === 'completed' ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">Selesai</span>
                                        ) : program.status === 'planned' ? (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">Akan Datang</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider">Berlangsung</span>
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
