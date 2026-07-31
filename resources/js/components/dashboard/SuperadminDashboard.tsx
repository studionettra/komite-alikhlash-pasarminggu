import { Link } from '@inertiajs/react';
import { Briefcase, Users, Wallet, ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react';

export default function SuperadminDashboard({ metrics, recentTransactions, ongoingPrograms, formatRupiah }: any) {
    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold text-slate-900 px-1">Ringkasan Aktivitas Komite</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Wallet weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1 relative z-10">Saldo Kas Tersedia</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight relative z-10">{formatRupiah(metrics?.balance || 0)}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Briefcase weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Total Program Kerja</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{metrics?.programs || 0}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <Users weight="duotone" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Notulensi Rapat</div>
                    <div className="text-3xl font-semibold text-slate-900 tracking-tight">{metrics?.meetings || 0}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Transaksi Terakhir */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900">Transaksi Terakhir</h3>
                        <Link href="/transactions" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentTransactions?.map((trx: any) => (
                            <div key={trx.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {trx.type === 'income' ? <ArrowDownRight weight="bold" /> : <ArrowUpRight weight="bold" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{trx.description}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-0.5">{new Date(trx.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
                                    </div>
                                </div>
                                <div className={`font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Program Ongoing */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900">Program Berlangsung</h3>
                        <Link href="/programs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {ongoingPrograms?.map((prog: any) => (
                            <div key={prog.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link href={`/programs/${prog.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">{prog.title}</Link>
                                        <div className="text-sm text-slate-500 line-clamp-1 mt-1">{prog.description}</div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold shrink-0">Ongoing</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
