import { Head } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';
import { useState, useEffect } from 'react';
import { X, FileText, CalendarBlank, Clock, FolderOpen } from '@phosphor-icons/react';

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

    const openProgram = (program: any) => {
        setSelectedProgram(program);
        setActiveTab('jadwal');
    };

    const hasReports = (program: any) => {
        const hasDirectDocs = program.documents && program.documents.length > 0;
        const hasActivityDocs = program.activities && program.activities.some((act: any) => act.documents && act.documents.length > 0);
        return hasDirectDocs || hasActivityDocs;
    };

    const renderJadwal = (program: any) => {
        if (!program.activities || program.activities.length === 0) {
            return (
                <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <CalendarBlank className="w-12 h-12 mx-auto text-slate-300 mb-3" weight="duotone" />
                    Belum ada rincian jadwal / sesi untuk program ini.
                </div>
            );
        }

        // Sort activities by date ASC for timeline
        const sortedActivities = [...program.activities].sort((a: any, b: any) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime());

        // Group by month
        const grouped: { [key: string]: any[] } = {};
        sortedActivities.forEach((act) => {
            const date = new Date(act.activity_date);
            const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            if (!grouped[monthYear]) grouped[monthYear] = [];
            grouped[monthYear].push(act);
        });

        return (
            <div className="space-y-6">
                {Object.entries(grouped).map(([monthYear, activities]) => (
                    <div key={monthYear} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-sm flex items-center gap-2">
                            <CalendarBlank weight="bold" className="text-blue-600" />
                            {monthYear}
                        </div>
                        <div className="divide-y divide-slate-100">
                            {activities.map((act: any, idx: number) => (
                                <div key={act.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 leading-snug">{act.title}</h4>
                                            {act.description && <p className="text-sm text-slate-500 mt-1">{act.description}</p>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end text-sm shrink-0 bg-white border border-slate-100 rounded-lg px-4 py-2 shadow-sm">
                                        <span className="font-bold text-slate-800 uppercase tracking-wide text-xs mb-0.5">
                                            {new Date(act.activity_date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                        </span>
                                        <span className="text-slate-500 font-medium mb-1">
                                            {new Date(act.activity_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </span>
                                        {act.start_time && (
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 mt-0.5">
                                                <Clock weight="bold" className="w-3 h-3" />
                                                {act.start_time.substring(0,5)} - {act.end_time ? act.end_time.substring(0,5) : 'Selesai'} WIB
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
                <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" weight="duotone" />
                    Belum ada arsip dokumentasi atau laporan.
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Direct Documents */}
                {program.documents && program.documents.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Laporan Umum</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {program.documents.map((doc: any) => (
                                <DocumentCard key={doc.id} doc={doc} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Activity Documents */}
                {program.activities && program.activities.filter((act: any) => act.documents && act.documents.length > 0).map((act: any) => (
                    <div key={act.id}>
                        <div className="flex items-center gap-2 mb-3">
                            <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CalendarBlank weight="bold" />
                                {new Date(act.activity_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Daftar Program Kerja</h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Seluruh inisiatif dan program Komite KBIT-TKIT Al-Ikhlash Pasar Minggu disusun untuk mendukung perkembangan peserta didik secara optimal.
                    </p>
                </div>
            </section>

            <section className="py-20 -mt-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        {programs.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                Belum ada data program kerja.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {programs.map((program: any) => (
                                    <div 
                                        key={program.id} 
                                        onClick={() => openProgram(program)}
                                        className="group flex flex-col p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider transition-colors">
                                                {program.frequency === 'monthly' ? 'Bulanan' : program.frequency === 'holiday' ? 'PHBI' : 'Insidental'}
                                            </span>
                                            <span className="text-sm font-medium text-slate-400">
                                                {program.start_date ? new Date(program.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors">{program.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{program.description}</p>
                                        
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                            <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                                Status:
                                                {program.status === 'ongoing' ? (
                                                    <span className="text-green-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Berlangsung</span>
                                                ) : program.status === 'planned' ? (
                                                    <span className="text-orange-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Akan Datang</span>
                                                ) : (
                                                    <span className="text-slate-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Selesai</span>
                                                )}
                                            </span>
                                            <span className="text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
                        <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-start z-10">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">{selectedProgram.title}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm text-slate-500 font-medium">{selectedProgram.frequency === 'monthly' ? 'Program Bulanan' : selectedProgram.frequency === 'holiday' ? 'Program PHBI' : 'Program Insidental'}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    {selectedProgram.status === 'ongoing' ? (
                                        <span className="text-green-600 text-sm font-bold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div> Sedang Berlangsung</span>
                                    ) : selectedProgram.status === 'planned' ? (
                                        <span className="text-orange-500 text-sm font-bold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50"></div> Akan Datang</span>
                                    ) : (
                                        <span className="text-slate-500 text-sm font-bold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Selesai</span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => setSelectedProgram(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                                <X weight="bold" className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="shrink-0 bg-slate-50 border-b border-slate-200 px-6 pt-4 flex gap-6">
                            <button 
                                onClick={() => setActiveTab('jadwal')}
                                className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'jadwal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <Clock weight={activeTab === 'jadwal' ? 'fill' : 'regular'} className="w-5 h-5" />
                                Jadwal / Agenda
                            </button>
                            <button 
                                onClick={() => setActiveTab('laporan')}
                                className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'laporan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <FolderOpen weight={activeTab === 'laporan' ? 'fill' : 'regular'} className="w-5 h-5" />
                                Arsip Laporan
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto flex-1">
                            {selectedProgram.description && (
                                <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-slate-700 leading-relaxed text-sm">
                                    {selectedProgram.description}
                                </div>
                            )}

                            <div>
                                {activeTab === 'jadwal' ? renderJadwal(selectedProgram) : renderReports(selectedProgram)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

function DocumentCard({ doc }: { doc: any }) {
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(doc.file_type.toLowerCase());
    
    return (
        <div className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            {isImage ? (
                <img src={`/storage/${doc.file_path}`} alt="Dokumentasi" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3">
                    <FileText weight="duotone" className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{doc.file_type}</span>
                </div>
            )}
            
            <a 
                href={`/storage/${doc.file_path}`} 
                target="_blank" 
                rel="noreferrer" 
                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
            >
                <span className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-slate-100 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Lihat
                </span>
            </a>
        </div>
    );
}
