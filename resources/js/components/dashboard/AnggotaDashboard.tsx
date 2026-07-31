import { Link } from '@inertiajs/react';
import { Wallet, Megaphone, CalendarBlank } from '@phosphor-icons/react';

export default function AnggotaDashboard({ metrics, activePrograms, recentMeetings, formatRupiah }: any) {
    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold text-slate-900 px-1">Informasi Komite</h2>
            
            {/* Transparency Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm">
                            <Wallet weight="bold" /> Transparansi Kas
                        </div>
                        <div className="text-sm font-medium text-emerald-100 mb-1">Total Saldo Kas Tersedia</div>
                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{formatRupiah(metrics?.balance || 0)}</div>
                    </div>
                    <Link href="/programs" className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors">
                        Lihat Program Kerja
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Pengumuman Program */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                        <Megaphone weight="duotone" className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-900">Agenda Program Sedang Berlangsung</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {activePrograms?.length > 0 ? activePrograms.map((prog: any) => (
                            <div key={prog.id} className="p-6">
                                <div className="font-bold text-slate-900 text-lg mb-2">{prog.title}</div>
                                <p className="text-sm text-slate-600 mb-3">{prog.description}</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg">{prog.frequency === 'monthly' ? 'Bulanan' : prog.frequency === 'holiday' ? 'Hari Besar' : 'Insidental'}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-500 text-sm">Belum ada agenda program saat ini.</div>
                        )}
                    </div>
                </div>

                {/* Notulensi Rapat */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-3">
                            <CalendarBlank weight="duotone" className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-slate-900">Hasil Rapat Terakhir</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentMeetings?.length > 0 ? recentMeetings.map((meeting: any) => (
                            <div key={meeting.id} className="p-6">
                                <div className="font-bold text-slate-900">{meeting.title}</div>
                                <div className="text-xs font-medium text-slate-500 mt-1 mb-3">{new Date(meeting.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                                <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic line-clamp-3">
                                    "{meeting.notes || 'Belum ada notulensi tertulis.'}"
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-500 text-sm">Belum ada catatan rapat.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
