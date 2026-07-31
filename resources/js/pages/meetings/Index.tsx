import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { UsersThree, CalendarBlank, ListChecks, PencilSimple, Trash, Note, CheckCircle, X, CaretDown, Paperclip, FilePdf, Image as ImageIcon } from '@phosphor-icons/react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

const COMMITTEE_MEMBERS = [
    'Mama Una BL2 (Eka)',
    'Mama Gani BL1 (Nova)',
    'Mama Daania KBIT (Denissa)',
    'Mama Sarah B (Rima)',
    'Mama Athar B (Vita)',
    'Mama Shanum BL1 (Widya)',
    'Mama Baarik B (Rosmanih)',
    'Mama Thariq A2 (Kunairoh)',
    'Mama Fath A2 (Sarah)',
    'Mama Razka BL2 (Rahma)',
    'Mama Rayya A1 (Bella)',
    'Mama Ryu A1 (Tuti A.)',
];

export default function MeetingsIndex({ meetings }: { meetings: any }) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const isAnggota = userRole === 'Anggota Komite';
    const canManageMeeting = ['Superadmin', 'Sekretaris'].includes(userRole);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        date: '',
        agenda: '',
        attendees: '',
        decisions: '',
        follow_up: '',
        documents: [] as File[],
    });

    const selectedAttendees = data.attendees ? data.attendees.split(',').map(s => s.trim()).filter(Boolean) : [];

    const toggleAttendee = (name: string) => {
        let newSelected;

        if (selectedAttendees.includes(name)) {
            newSelected = selectedAttendees.filter(a => a !== name);
        } else {
            newSelected = [...selectedAttendees, name];
        }

        setData('attendees', newSelected.join(', '));
    };

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (meeting: any) => {
        setIsEditing(true);
        setEditingId(meeting.id);
        clearErrors();
        setData({
            date: meeting.date ? meeting.date.split('T')[0] : '',
            agenda: meeting.agenda,
            attendees: meeting.attendees || '',
            decisions: meeting.decisions,
            follow_up: meeting.follow_up || '',
            documents: [],
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            router.post(`/meetings/${editingId}`, {
                ...data,
                _method: 'put'
            }, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
                preserveScroll: true,
            });
        } else {
            post('/meetings', {
                onSuccess: () => reset(),
                preserveScroll: true,
            });
        }
    };

    const deleteMeeting = (id: number, agenda: string) => {
        confirmDelete(`Hapus notulensi untuk agenda: ${agenda}?`, () => {
            router.delete(`/meetings/${id}`);
        });
    };

    return (
        <DashboardLayout>
            <Head title="Notulensi Rapat" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notulensi Rapat</h1>
                    <p className="text-slate-500 mt-1">Catat keputusan dan tindak lanjut dari setiap pertemuan komite.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {canManageMeeting && (
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Note weight="duotone" className="w-5 h-5 text-blue-600" />
                                {isEditing ? 'Edit Notulensi' : 'Catat Notulensi'}
                            </h2>
                            {isEditing && (
                                <button onClick={openCreate} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Batal</button>
                            )}
                        </div>
                        
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
                                <input
                                    type={data.date ? "date" : "text"}
                                    placeholder="dd/mm/yyyy"
                                    value={data.date}
                                    onFocus={(e) => {
                                        e.target.type = 'date';

                                        if (e.target.showPicker) {
e.target.showPicker();
}
                                    }}
                                    onBlur={(e) => {
                                        if (!e.target.value) {
e.target.type = 'text';
}
                                    }}
                                    onClick={(e) => {
                                        if (e.target.type === 'date' && e.target.showPicker) {
e.target.showPicker();
}
                                    }}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                                {errors.date && <div className="text-rose-500 text-xs mt-1">{errors.date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agenda Utama</label>
                                <input
                                    type="text"
                                    value={data.agenda}
                                    onChange={e => setData('agenda', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors"
                                    placeholder="Contoh: Rapat Koordinasi Tahunan"
                                    required
                                />
                                {errors.agenda && <div className="text-rose-500 text-xs mt-1">{errors.agenda}</div>}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Daftar Hadir</label>
                                
                                <div 
                                    className={`w-full min-h-[46px] px-3 py-2 border rounded-xl bg-slate-50 hover:bg-white transition-colors cursor-text flex flex-wrap gap-2 items-center ${isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300'}`}
                                    onClick={() => setIsDropdownOpen(true)}
                                >
                                    {selectedAttendees.length === 0 && (
                                        <span className="text-slate-400 text-sm ml-1">Pilih pengurus yang hadir...</span>
                                    )}
                                    
                                    {selectedAttendees.map(name => (
                                        <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200/60 shadow-sm">
                                            {name}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleAttendee(name);
                                                }}
                                                className="p-0.5 hover:bg-blue-200/50 hover:text-blue-900 rounded-md transition-colors focus:outline-none"
                                            >
                                                <X weight="bold" className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}

                                    <div className="ml-auto pl-2 text-slate-400">
                                        <CaretDown weight="bold" className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                        <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1.5">
                                            {COMMITTEE_MEMBERS.map(name => {
                                                const isSelected = selectedAttendees.includes(name);

                                                return (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!isSelected) {
                                                                toggleAttendee(name);
                                                            }

                                                            setIsDropdownOpen(false);
                                                        }}
                                                        disabled={isSelected}
                                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                                                            isSelected 
                                                                ? 'bg-slate-50/50 text-slate-400 cursor-not-allowed' 
                                                                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                                        }`}
                                                    >
                                                        {name}
                                                        {isSelected && <CheckCircle weight="fill" className="w-4 h-4 text-slate-300" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keputusan</label>
                                <textarea
                                    value={data.decisions}
                                    onChange={e => setData('decisions', e.target.value)}
                                    rows={3}
                                    placeholder="Tuliskan hasil atau keputusan rapat..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors resize-none"
                                    required
                                ></textarea>
                                {errors.decisions && <div className="text-rose-500 text-xs mt-1">{errors.decisions}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tindak Lanjut</label>
                                <textarea
                                    value={data.follow_up}
                                    onChange={e => setData('follow_up', e.target.value)}
                                    rows={2}
                                    placeholder="Siapa melakukan apa..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-white transition-colors resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Lampiran Dokumen <span className="text-slate-400 font-normal">(Opsional)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={e => setData('documents', Array.from(e.target.files || []))}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors border border-slate-200 rounded-xl bg-slate-50"
                                    />
                                </div>
                                {isEditing && (
                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        <Note weight="bold" className="text-blue-500" />
                                        Upload file baru akan ditambahkan ke lampiran yang sudah ada. Maks 5MB/file.
                                    </p>
                                )}
                                {!isEditing && (
                                    <p className="text-xs text-slate-400 mt-2">Maksimal 5MB/file (PDF, JPG, PNG).</p>
                                )}
                                {errors.documents && <div className="text-rose-500 text-xs mt-1">{errors.documents}</div>}
                                {/* Show validation errors for array items if any */}
                                {Object.keys(errors).filter(key => key.startsWith('documents.')).map(key => (
                                    <div key={key} className="text-rose-500 text-xs mt-1">{errors[key as keyof typeof errors]}</div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm mt-2"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Notulensi'}
                            </button>
                        </form>
                    </div>
                </div>
                )}

                <div className={canManageMeeting ? "lg:col-span-2" : "lg:col-span-3"}>
                    {isAnggota ? (
                        <div className="space-y-6">
                            {meetings.data.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
                                    <UsersThree weight="duotone" className="w-16 h-16 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-700">Belum Ada Notulensi</h3>
                                    <p className="text-slate-500 mt-2">Belum ada catatan rapat komite yang dipublikasikan.</p>
                                </div>
                            ) : (
                                <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-6 space-y-10 py-4">
                                    {meetings.data.map((meeting: any) => (
                                        <div key={meeting.id} className="relative pl-6 sm:pl-10 group">
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[11px] sm:-left-[11px] top-1.5 w-5 h-5 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white"></div>
                                            </div>
                                            
                                            {/* Date Badge */}
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                                <CalendarBlank weight="bold" />
                                                {meeting.date ? new Date(meeting.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                            </div>

                                            {/* Content Card */}
                                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 p-5 sm:p-7 transition-all duration-300">
                                                <h3 className="text-xl font-bold text-slate-900 mb-4">{meeting.agenda}</h3>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500" />
                                                            <h4 className="font-bold text-emerald-900 text-sm">Hasil Keputusan</h4>
                                                        </div>
                                                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{meeting.decisions}</p>
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        {meeting.follow_up && (
                                                            <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100/50">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <ListChecks weight="fill" className="w-5 h-5 text-orange-500" />
                                                                    <h4 className="font-bold text-orange-900 text-sm">Tindak Lanjut</h4>
                                                                </div>
                                                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{meeting.follow_up}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {meeting.attendees && (
                                                            <div className="flex items-start gap-2 text-sm text-slate-500 mt-2">
                                                                <UsersThree weight="duotone" className="w-5 h-5 shrink-0" />
                                                                <div>
                                                                    <span className="font-semibold text-slate-700 block mb-1">Daftar Hadir:</span>
                                                                    <span className="leading-relaxed">{meeting.attendees}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {meeting.documents && meeting.documents.length > 0 && (
                                                            <div className="flex items-start gap-2 text-sm mt-3 pt-3 border-t border-slate-100">
                                                                <Paperclip weight="duotone" className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
                                                                <div className="w-full">
                                                                    <span className="font-semibold text-slate-700 block mb-2">Lampiran Dokumen:</span>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {meeting.documents.map((doc: any) => (
                                                                            <a 
                                                                                key={doc.id}
                                                                                href={`/storage/${doc.file_path}`} 
                                                                                target="_blank" 
                                                                                rel="noreferrer"
                                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors text-xs font-semibold"
                                                                            >
                                                                                {doc.file_type.toLowerCase() === 'pdf' ? <FilePdf weight="fill" className="w-4 h-4 text-rose-500" /> : <ImageIcon weight="fill" className="w-4 h-4 text-blue-500" />}
                                                                                File {doc.file_type.toUpperCase()}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {meetings.links && meetings.links.length > 3 && (
                                <div className="mt-8 flex flex-wrap justify-center gap-1.5">
                                    {meetings.links.map((link: any, k: number) => (
                                        link.url ? (
                                            <Link
                                                key={k}
                                                href={link.url}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-blue-600'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={k}
                                                className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-400 bg-slate-50 border border-slate-100"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                            {meetings.total > 0 && (
                                <div className="text-center mt-4">
                                    <div className="inline-block px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-500 rounded-full">
                                        Menampilkan {(meetings.current_page - 1) * meetings.per_page + 1} - {Math.min(meetings.current_page * meetings.per_page, meetings.total)} dari {meetings.total} catatan
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-hidden md:overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 block md:table">
                                <thead className="bg-slate-50 hidden md:table-header-group">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Agenda</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keputusan</th>
                                        {canManageMeeting && (
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100 block md:table-row-group">
                                    {meetings.data.length === 0 && (
                                        <tr className="block md:table-row">
                                            <td colSpan={canManageMeeting ? 3 : 2} className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <UsersThree weight="duotone" className="w-12 h-12 text-slate-300 mb-3" />
                                                    <p>Belum ada data notulensi rapat.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {meetings.data.map((meeting: any) => (
                                        <tr key={meeting.id} className="hover:bg-slate-50/80 transition-colors block md:table-row p-5 md:p-0 border-b border-slate-100 md:border-0 last:border-0">
                                            <td className="block md:table-cell px-0 md:px-6 py-2 md:py-4 align-top">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                    <CalendarBlank weight="bold" />
                                                    {meeting.date ? new Date(meeting.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                </div>
                                                <div className="text-sm font-bold text-slate-900 leading-snug">{meeting.agenda}</div>
                                                {meeting.attendees && (
                                                    <div className="text-xs text-slate-500 mt-2 flex items-start gap-1.5">
                                                        <UsersThree weight="bold" className="shrink-0 mt-0.5 text-slate-400" />
                                                        <span className="whitespace-pre-wrap leading-relaxed">{meeting.attendees}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="block md:table-cell px-0 md:px-6 py-2 md:py-4 align-top mt-3 md:mt-0">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{meeting.decisions}</div>
                                                </div>
                                                {meeting.follow_up && (
                                                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-100">
                                                        <ListChecks weight="bold" className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                                        <div className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{meeting.follow_up}</div>
                                                    </div>
                                                )}
                                                {meeting.documents && meeting.documents.length > 0 && (
                                                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-100">
                                                        <Paperclip weight="bold" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                                        <div className="flex flex-wrap gap-2">
                                                            {meeting.documents.map((doc: any) => (
                                                                <a 
                                                                    key={doc.id}
                                                                    href={`/storage/${doc.file_path}`} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-md border border-slate-200 transition-colors text-xs font-semibold"
                                                                >
                                                                    {doc.file_type.toLowerCase() === 'pdf' ? <FilePdf weight="fill" className="text-rose-500" /> : <ImageIcon weight="fill" className="text-blue-500" />}
                                                                    Lihat Lampiran
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            {canManageMeeting && (
                                            <td className="block md:table-cell px-0 md:px-6 pt-4 md:py-4 whitespace-nowrap text-right align-top mt-4 md:mt-0 border-t border-slate-100 md:border-0">
                                                <div className="grid grid-cols-2 md:flex md:justify-end gap-3 md:gap-2">
                                                    <button 
                                                        onClick={() => openEdit(meeting)} 
                                                        className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2.5 md:p-2 text-sm font-semibold text-slate-600 md:text-slate-400 hover:text-blue-600 bg-slate-100 md:bg-transparent hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Edit Notulensi"
                                                    >
                                                        <PencilSimple weight="bold" className="w-4 h-4" />
                                                        <span className="md:hidden">Edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteMeeting(meeting.id, meeting.agenda)} 
                                                        className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2.5 md:p-2 text-sm font-semibold text-slate-600 md:text-slate-400 hover:text-rose-600 bg-slate-100 md:bg-transparent hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Hapus Notulensi"
                                                    >
                                                        <Trash weight="bold" className="w-4 h-4" />
                                                        <span className="md:hidden">Hapus</span>
                                                    </button>
                                                </div>
                                            </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {meetings.links && meetings.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-wrap justify-center sm:justify-start gap-1.5">
                                {meetings.links.map((link: any, k: number) => (
                                    link.url ? (
                                        <Link
                                            key={k}
                                            href={link.url}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-blue-600'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={k}
                                            className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-400 bg-slate-50 border border-slate-100"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                        {meetings.total > 0 && (
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs font-medium text-slate-500 text-center sm:text-left">
                                Menampilkan {(meetings.current_page - 1) * meetings.per_page + 1} - {Math.min(meetings.current_page * meetings.per_page, meetings.total)} dari total {meetings.total} notulensi
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
