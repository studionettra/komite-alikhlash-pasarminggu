import { Head, usePage, Link, useForm, router } from '@inertiajs/react';
import type { File } from '@phosphor-icons/react';
import { 
    CalendarBlank, 
    FileText, 
    UploadSimple,
    Trash,
    Image as ImageIcon,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    ArrowLeft,
    Plus,
    X
} from '@phosphor-icons/react';
import { useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

function ActivityCard({ activity, programId, canManageProgram }: any) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { errors } = usePage().props as any;

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            router.post('/documents', {
                program_id: programId,
                program_activity_id: activity.id,
                file: e.target.files[0]
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
                onFinish: () => setIsUploading(false)
            });
        }
    };

    const deleteDocument = (id: number) => {
        confirmDelete('Yakin ingin menghapus dokumen ini?', () => {
            router.delete(`/documents/${id}`, { preserveScroll: true });
        });
    };
    
    const deleteActivity = (id: number) => {
        confirmDelete('Yakin ingin menghapus sesi program ini? Pastikan sesi ini sudah kosong dari laporan dan transaksi.', () => {
            router.delete(`/program-activities/${id}`, { preserveScroll: true });
        });
    }



    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-900 text-lg">{activity.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mt-1">
                        <div className="flex items-center gap-2">
                            <CalendarBlank weight="duotone" className="w-4 h-4" />
                            {formatDate(activity.activity_date)}
                        </div>
                        {activity.start_time && (
                            <div className="flex items-center gap-1.5 font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                {activity.start_time.substring(0,5)} — {activity.end_time?.substring(0,5) || 'Selesai'} WIB
                            </div>
                        )}
                    </div>
                    {activity.description && <p className="text-sm text-slate-600 mt-2">{activity.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border shadow-sm ${activity.status === 'completed' ? 'bg-slate-100 text-slate-700 border-slate-200' : activity.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {activity.status === 'completed' ? 'Selesai' : activity.status === 'ongoing' ? 'Sedang Berlangsung' : 'Akan Datang'}
                    </span>
                    {canManageProgram && (
                        <button onClick={() => deleteActivity(activity.id)} className="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors" title="Hapus Sesi">
                            <Trash weight="bold" className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-semibold text-slate-700">Lampiran & Dokumen ({activity.documents?.length || 0})</h5>
                    {canManageProgram && (
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                <UploadSimple weight="bold" />
                                {isUploading ? 'Mengunggah...' : 'Unggah File'}
                            </button>
                        </div>
                    )}
                </div>

                {errors?.file && <div className="text-sm text-rose-600 font-medium mb-4">{errors.file}</div>}

                {activity.documents?.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <ImageIcon weight="duotone" className="w-6 h-6 text-slate-300 mb-2" />
                        <p className="text-xs text-slate-500">Belum ada lampiran di sesi ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {activity.documents?.map((doc: any) => {
                            const isImage = ['jpg', 'jpeg', 'png'].includes(doc.file_type.toLowerCase());
                            return (
                                <div key={doc.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    {isImage ? (
                                        <img src={`/storage/${doc.file_path}`} alt="Dokumentasi" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-3">
                                            <FileText weight="duotone" className="w-8 h-8 text-slate-400 mb-1" />
                                            <span className="text-[10px] font-medium text-slate-500 uppercase">{doc.file_type}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                        <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded-full hover:bg-slate-100">
                                            Lihat
                                        </a>
                                        {canManageProgram && (
                                            <button onClick={() => deleteDocument(doc.id)} className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600" title="Hapus">
                                                <Trash weight="bold" className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Show({ program, summary }: any) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManageProgram = ['Superadmin', 'Sekretaris'].includes(userRole);
    
    const [showActivityModal, setShowActivityModal] = useState(false);
    
    const { data: activityData, setData: setActivityData, post: postActivity, processing: processingActivity, errors: activityErrors, reset: resetActivity, clearErrors: clearActivityErrors } = useForm({
        program_id: program.id,
        title: '',
        activity_date: '',
        start_time: '',
        end_time: '',
        description: '',
    });

    const submitActivity = (e: any) => {
        e.preventDefault();
        postActivity('/program-activities', {
            preserveScroll: true,
            onSuccess: () => {
                setShowActivityModal(false);
                resetActivity();
            }
        });
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'planned': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'ongoing': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'planned': return 'Akan Datang';
            case 'ongoing': return 'Sedang Berlangsung';
            case 'completed': return 'Selesai';
            default: return status;
        }
    };

    const getFrequencyText = (freq: string) => {
        switch(freq) {
            case 'monthly': return 'Bulanan';
            case 'holiday': return 'Hari Besar';
            case 'incidental': return 'Insidental';
            default: return freq;
        }
    };

    return (
        <DashboardLayout>
            <Head title={`Laporan: ${program.title}`} />

            {/* Modal Create Activity */}
            {showActivityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Buat Sesi Program</h3>
                            <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                <X weight="bold" className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={submitActivity} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Sesi</label>
                                <input
                                    type="text"
                                    value={activityData.title}
                                    placeholder="Contoh: Laporan Januari 2026"
                                    onChange={e => setActivityData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                                {activityErrors.title && <div className="text-rose-500 text-xs mt-1">{activityErrors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Pelaksanaan</label>
                                <input
                                    type="date"
                                    value={activityData.activity_date}
                                    onChange={e => setActivityData('activity_date', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                                {activityErrors.activity_date && <div className="text-rose-500 text-xs mt-1">{activityErrors.activity_date}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Mulai (WIB)</label>
                                    <input
                                        type="time"
                                        value={activityData.start_time}
                                        onChange={e => setActivityData('start_time', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                        required
                                    />
                                    {activityErrors.start_time && <div className="text-rose-500 text-xs mt-1">{activityErrors.start_time}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Selesai (WIB)</label>
                                    <input
                                        type="time"
                                        value={activityData.end_time}
                                        onChange={e => setActivityData('end_time', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                        required
                                    />
                                    {activityErrors.end_time && <div className="text-rose-500 text-xs mt-1">{activityErrors.end_time}</div>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan (Opsional)</label>
                                <textarea
                                    value={activityData.description}
                                    onChange={e => setActivityData('description', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors resize-none"
                                ></textarea>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processingActivity}
                                    className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm"
                                >
                                    {processingActivity ? 'Menyimpan...' : 'Simpan Sesi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-6xl space-y-6">
                {/* Top Nav */}
                <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft weight="bold" />
                    Kembali ke Daftar Program
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row gap-8 justify-between items-start">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(program.status)}`}>
                                {getStatusText(program.status)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {getFrequencyText(program.frequency)}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{program.title}</h1>
                        <p className="text-slate-600 leading-relaxed text-lg">{program.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <CalendarBlank weight="duotone" className="w-5 h-5 text-slate-400" />
                                {formatDate(program.start_date)} — {formatDate(program.end_date) || 'Berlanjut'}
                            </div>
                        </div>

                        {/* Panitia Assignment */}
                        {program.users && program.users.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="text-sm font-semibold text-slate-700 mb-2">Tim Panitia:</div>
                                <div className="flex flex-wrap gap-2">
                                    {program.users.map((u: any) => (
                                        <div key={u.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${u.id === auth?.user?.id ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] text-slate-600 shadow-sm shrink-0">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            {u.id === auth?.user?.id ? '★ Anda' : u.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Finance Summary & Documents Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Finance Summary Column (Col 1) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 text-lg">Keuangan Program</h3>
                                <Wallet weight="duotone" className="w-6 h-6 text-slate-400" />
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <ArrowDownRight weight="bold" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pemasukan</div>
                                            <div className="font-bold text-slate-900">{formatRupiah(summary.income)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                            <ArrowUpRight weight="bold" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pengeluaran</div>
                                            <div className="font-bold text-slate-900">{formatRupiah(summary.expense)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="text-sm font-medium text-slate-500 mb-1">Total Saldo Bersih</div>
                                <div className={`text-3xl font-bold tracking-tight ${summary.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {formatRupiah(summary.balance)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Program Activities (Col 2 & 3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="font-bold text-slate-900 text-lg">Laporan Program</h3>
                            {canManageProgram && (
                                <button 
                                    onClick={() => setShowActivityModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <Plus weight="bold" />
                                    Sesi Baru
                                </button>
                            )}
                        </div>

                        {program.activities?.length === 0 ? (
                            <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <FileText weight="duotone" className="w-8 h-8 text-slate-400" />
                                </div>
                                <h4 className="text-slate-900 font-bold text-lg">Belum ada sesi program</h4>
                                <p className="text-sm text-slate-500 mt-1 max-w-sm">Buat sesi untuk mengelompokkan laporan per bulan atau per pelaksanaan program.</p>
                                {canManageProgram && (
                                    <button 
                                        onClick={() => setShowActivityModal(true)}
                                        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <Plus weight="bold" className="w-4 h-4" />
                                        Buat Sesi Pertama
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {program.activities?.map((activity: any) => (
                                    <ActivityCard key={activity.id} activity={activity} programId={program.id} canManageProgram={canManageProgram} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
