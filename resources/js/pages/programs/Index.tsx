import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { PencilSimple, Trash, Target, CheckCircle, Clock, FlagBanner, FileText } from '@phosphor-icons/react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

export default function ProgramsIndex({ programs }: { programs: any }) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const canManageProgram = ['Superadmin', 'Sekretaris'].includes(userRole);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        frequency: 'monthly',
        status: 'planned',
        start_date: '',
        end_date: '',
    });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (program: any) => {
        setIsEditing(true);
        setEditingId(program.id);
        clearErrors();
        setData({
            title: program.title,
            description: program.description,
            frequency: program.frequency,
            status: program.status,
            start_date: program.start_date ? program.start_date.split('T')[0] : '',
            end_date: program.end_date ? program.end_date.split('T')[0] : '',
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            put(`/programs/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
            });
        } else {
            post('/programs', {
                onSuccess: () => reset(),
            });
        }
    };

    const deleteProgram = (id: number, title: string) => {
        confirmDelete(`Hapus program ${title}?`, () => {
            router.delete(`/programs/${id}`);
        });
    };

    const frequencyLabel = (freq: string) => {
        const labels: any = { monthly: 'Bulanan', holiday: 'PHBI', incidental: 'Insidental' };

        return labels[freq] || freq;
    };

    const statusBadge = (status: string) => {
        if (status === 'planned') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <Clock weight="bold" className="w-3.5 h-3.5" />
                    Akan Datang
                </span>
            );
        }

        if (status === 'ongoing') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                    <FlagBanner weight="bold" className="w-3.5 h-3.5" />
                    Sedang Berlangsung
                </span>
            );
        }

        if (status === 'completed') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle weight="bold" className="w-3.5 h-3.5" />
                    Selesai
                </span>
            );
        }

        return status;
    };

    return (
        <DashboardLayout>
            <Head title="Program Kerja" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Program Kerja</h1>
                    <p className="text-slate-500 mt-1">Daftar agenda dan pelaksanaan program komite.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {canManageProgram && (
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Target weight="duotone" className="w-5 h-5 text-blue-600" />
                                {isEditing ? 'Edit Program' : 'Tambah Program'}
                            </h2>
                            {isEditing && (
                                <button onClick={openCreate} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Batal</button>
                            )}
                        </div>
                        
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Program</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                                {errors.title && <div className="text-rose-500 text-xs mt-1">{errors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors resize-none"
                                    required
                                ></textarea>
                                {errors.description && <div className="text-rose-500 text-xs mt-1">{errors.description}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-20">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                                    <Select
                                        value={data.frequency}
                                        onChange={val => setData('frequency', val as string)}
                                        options={[
                                            { value: 'monthly', label: 'Bulanan' },
                                            { value: 'holiday', label: 'Peringatan Hari Besar' },
                                            { value: 'incidental', label: 'Insidental' }
                                        ]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                                    <Select
                                        value={data.status}
                                        onChange={val => setData('status', val as string)}
                                        options={[
                                            { value: 'planned', label: 'Akan Datang' },
                                            { value: 'ongoing', label: 'Sedang Berlangsung' },
                                            { value: 'completed', label: 'Selesai' }
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-xs font-medium text-slate-500 mb-3 leading-relaxed">
                                    Isi tanggal di bawah jika ini adalah acara 1x jalan <span className="text-slate-400 italic">(Contoh: Market Day, Lomba HUT RI)</span>. Kosongkan jika program rutin memiliki sesi berulang <span className="text-slate-400 italic">(Contoh: Jumat Berkah, Renang)</span>.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Mulai (Opsional)</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Selesai (Opsional)</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm mt-2"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Program'}
                            </button>
                        </form>
                    </div>
                </div>
                )}

                <div className={canManageProgram ? "lg:col-span-2" : "lg:col-span-3"}>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Kategori</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {programs.data.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Target weight="duotone" className="w-12 h-12 text-slate-300 mb-3" />
                                                    <p>Belum ada data program kerja.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {programs.data.map((program: any) => (
                                        <tr key={program.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={`/programs/${program.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                                    {program.title}
                                                </Link>
                                                <div className="text-sm text-slate-500 line-clamp-1 mt-1">{program.description}</div>
                                                {program.users && program.users.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {program.users.map((u: any) => (
                                                            <span key={u.id} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.id === auth?.user?.id ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                                {u.id === auth?.user?.id ? '★ Anda' : u.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="mb-1">{statusBadge(program.status)}</div>
                                                <div className="text-xs text-slate-500">{frequencyLabel(program.frequency)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                                                <div className="flex justify-end gap-2">
                                                    <Link 
                                                        href={`/programs/${program.id}`} 
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                                        title="Detail & Laporan"
                                                    >
                                                        <FileText weight="bold" className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Laporan</span>
                                                    </Link>
                                                    {canManageProgram && (
                                                        <>
                                                            <button 
                                                                onClick={() => openEdit(program)} 
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                                title="Edit Program"
                                                            >
                                                                <PencilSimple weight="bold" className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteProgram(program.id, program.title)} 
                                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                                title="Hapus Program"
                                                            >
                                                                <Trash weight="bold" className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {programs.total > 0 && (
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                                Menampilkan {programs.data.length} dari total {programs.total} program
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
