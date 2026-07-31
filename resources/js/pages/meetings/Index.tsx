import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import {
    UsersThree,
    CalendarBlank,
    ListChecks,
    PencilSimple,
    Trash,
    Note,
    CheckCircle,
    X,
    CaretDown,
    Paperclip,
    FilePdf,
    Image as ImageIcon,
} from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
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

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            date: '',
            agenda: '',
            attendees: '',
            decisions: '',
            follow_up: '',
            documents: [] as File[],
        });

    const selectedAttendees = data.attendees
        ? data.attendees
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
        : [];

    const toggleAttendee = (name: string) => {
        let newSelected;

        if (selectedAttendees.includes(name)) {
            newSelected = selectedAttendees.filter((a) => a !== name);
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
            router.post(
                `/meetings/${editingId}`,
                {
                    ...data,
                    _method: 'put',
                },
                {
                    onSuccess: () => {
                        reset();
                        setIsEditing(false);
                        setEditingId(null);
                    },
                    preserveScroll: true,
                },
            );
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

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Notulensi Rapat
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Catat keputusan dan tindak lanjut dari setiap pertemuan
                        komite.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {canManageMeeting && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <Note
                                        weight="duotone"
                                        className="h-5 w-5 text-blue-600"
                                    />
                                    {isEditing
                                        ? 'Edit Notulensi'
                                        : 'Catat Notulensi'}
                                </h2>
                                {isEditing && (
                                    <button
                                        onClick={openCreate}
                                        className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Tanggal
                                    </label>
                                    <input
                                        type={data.date ? 'date' : 'text'}
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
                                            if (
                                                e.target.type === 'date' &&
                                                e.target.showPicker
                                            ) {
                                                e.target.showPicker();
                                            }
                                        }}
                                        onChange={(e) =>
                                            setData('date', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.date && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.date}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Agenda Utama
                                    </label>
                                    <input
                                        type="text"
                                        value={data.agenda}
                                        onChange={(e) =>
                                            setData('agenda', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Contoh: Rapat Koordinasi Tahunan"
                                        required
                                    />
                                    {errors.agenda && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.agenda}
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Daftar Hadir
                                    </label>

                                    <div
                                        className={`flex min-h-[46px] w-full cursor-text flex-wrap items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 transition-colors hover:bg-white ${isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300'}`}
                                        onClick={() => setIsDropdownOpen(true)}
                                    >
                                        {selectedAttendees.length === 0 && (
                                            <span className="ml-1 text-sm text-slate-400">
                                                Pilih pengurus yang hadir...
                                            </span>
                                        )}

                                        {selectedAttendees.map((name) => (
                                            <span
                                                key={name}
                                                className="inline-flex items-center gap-1 rounded-lg border border-blue-200/60 bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 shadow-sm"
                                            >
                                                {name}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleAttendee(name);
                                                    }}
                                                    className="rounded-md p-0.5 transition-colors hover:bg-blue-200/50 hover:text-blue-900 focus:outline-none"
                                                >
                                                    <X
                                                        weight="bold"
                                                        className="h-3 w-3"
                                                    />
                                                </button>
                                            </span>
                                        ))}

                                        <div className="ml-auto pl-2 text-slate-400">
                                            <CaretDown
                                                weight="bold"
                                                className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    </div>

                                    {isDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            ></div>
                                            <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                                                {COMMITTEE_MEMBERS.map(
                                                    (name) => {
                                                        const isSelected =
                                                            selectedAttendees.includes(
                                                                name,
                                                            );

                                                        return (
                                                            <button
                                                                key={name}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (
                                                                        !isSelected
                                                                    ) {
                                                                        toggleAttendee(
                                                                            name,
                                                                        );
                                                                    }

                                                                    setIsDropdownOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                                disabled={
                                                                    isSelected
                                                                }
                                                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                                                                    isSelected
                                                                        ? 'cursor-not-allowed bg-slate-50/50 text-slate-400'
                                                                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                                                }`}
                                                            >
                                                                {name}
                                                                {isSelected && (
                                                                    <CheckCircle
                                                                        weight="fill"
                                                                        className="h-4 w-4 text-slate-300"
                                                                    />
                                                                )}
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Keputusan
                                    </label>
                                    <textarea
                                        value={data.decisions}
                                        onChange={(e) =>
                                            setData('decisions', e.target.value)
                                        }
                                        rows={3}
                                        placeholder="Tuliskan hasil atau keputusan rapat..."
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    ></textarea>
                                    {errors.decisions && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.decisions}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Tindak Lanjut
                                    </label>
                                    <textarea
                                        value={data.follow_up}
                                        onChange={(e) =>
                                            setData('follow_up', e.target.value)
                                        }
                                        rows={2}
                                        placeholder="Siapa melakukan apa..."
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 transition-colors hover:bg-white focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Lampiran Dokumen{' '}
                                        <span className="font-normal text-slate-400">
                                            (Opsional)
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) =>
                                                setData(
                                                    'documents',
                                                    Array.from(
                                                        e.target.files || [],
                                                    ),
                                                )
                                            }
                                            className="block w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 transition-colors file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                    {isEditing && (
                                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                            <Note
                                                weight="bold"
                                                className="text-blue-500"
                                            />
                                            Upload file baru akan ditambahkan ke
                                            lampiran yang sudah ada. Maks
                                            5MB/file.
                                        </p>
                                    )}
                                    {!isEditing && (
                                        <p className="mt-2 text-xs text-slate-400">
                                            Maksimal 5MB/file (PDF, JPG, PNG).
                                        </p>
                                    )}
                                    {errors.documents && (
                                        <div className="mt-1 text-xs text-rose-500">
                                            {errors.documents}
                                        </div>
                                    )}
                                    {/* Show validation errors for array items if any */}
                                    {Object.keys(errors)
                                        .filter((key) =>
                                            key.startsWith('documents.'),
                                        )
                                        .map((key) => (
                                            <div
                                                key={key}
                                                className="mt-1 text-xs text-rose-500"
                                            >
                                                {
                                                    errors[
                                                        key as keyof typeof errors
                                                    ]
                                                }
                                            </div>
                                        ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Notulensi'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div
                    className={
                        canManageMeeting ? 'lg:col-span-2' : 'lg:col-span-3'
                    }
                >
                    {isAnggota ? (
                        <div className="space-y-6">
                            {meetings.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                                    <UsersThree
                                        weight="duotone"
                                        className="mb-4 h-16 w-16 text-slate-300"
                                    />
                                    <h3 className="text-lg font-bold text-slate-700">
                                        Belum Ada Notulensi
                                    </h3>
                                    <p className="mt-2 text-slate-500">
                                        Belum ada catatan rapat komite yang
                                        dipublikasikan.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative ml-3 space-y-10 border-l-2 border-slate-200 py-4 sm:ml-6">
                                    {meetings.data.map((meeting: any) => (
                                        <div
                                            key={meeting.id}
                                            className="group relative pl-6 sm:pl-10"
                                        >
                                            {/* Timeline dot */}
                                            <div className="absolute top-1.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-blue-100 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500 sm:-left-[11px]">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 group-hover:bg-white"></div>
                                            </div>

                                            {/* Date Badge */}
                                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider text-slate-600 uppercase">
                                                <CalendarBlank weight="bold" />
                                                {meeting.date
                                                    ? new Date(
                                                          meeting.date,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '-'}
                                            </div>

                                            {/* Content Card */}
                                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:p-7">
                                                <h3 className="mb-4 text-xl font-bold text-slate-900">
                                                    {meeting.agenda}
                                                </h3>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="rounded-xl border border-emerald-100/50 bg-emerald-50/50 p-4">
                                                        <div className="mb-3 flex items-center gap-2">
                                                            <CheckCircle
                                                                weight="fill"
                                                                className="h-5 w-5 text-emerald-500"
                                                            />
                                                            <h4 className="text-sm font-bold text-emerald-900">
                                                                Hasil Keputusan
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                                                            {meeting.decisions}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {meeting.follow_up && (
                                                            <div className="rounded-xl border border-orange-100/50 bg-orange-50/50 p-4">
                                                                <div className="mb-3 flex items-center gap-2">
                                                                    <ListChecks
                                                                        weight="fill"
                                                                        className="h-5 w-5 text-orange-500"
                                                                    />
                                                                    <h4 className="text-sm font-bold text-orange-900">
                                                                        Tindak
                                                                        Lanjut
                                                                    </h4>
                                                                </div>
                                                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                                                                    {
                                                                        meeting.follow_up
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}

                                                        {meeting.attendees && (
                                                            <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                                                                <UsersThree
                                                                    weight="duotone"
                                                                    className="h-5 w-5 shrink-0"
                                                                />
                                                                <div>
                                                                    <span className="mb-1 block font-semibold text-slate-700">
                                                                        Daftar
                                                                        Hadir:
                                                                    </span>
                                                                    <span className="leading-relaxed">
                                                                        {
                                                                            meeting.attendees
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {meeting.documents &&
                                                            meeting.documents
                                                                .length > 0 && (
                                                                <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3 text-sm">
                                                                    <Paperclip
                                                                        weight="duotone"
                                                                        className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                                                                    />
                                                                    <div className="w-full">
                                                                        <span className="mb-2 block font-semibold text-slate-700">
                                                                            Lampiran
                                                                            Dokumen:
                                                                        </span>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {meeting.documents.map(
                                                                                (
                                                                                    doc: any,
                                                                                ) => (
                                                                                    <a
                                                                                        key={
                                                                                            doc.id
                                                                                        }
                                                                                        href={`/storage/${doc.file_path}`}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                                                    >
                                                                                        {doc.file_type.toLowerCase() ===
                                                                                        'pdf' ? (
                                                                                            <FilePdf
                                                                                                weight="fill"
                                                                                                className="h-4 w-4 text-rose-500"
                                                                                            />
                                                                                        ) : (
                                                                                            <ImageIcon
                                                                                                weight="fill"
                                                                                                className="h-4 w-4 text-blue-500"
                                                                                            />
                                                                                        )}
                                                                                        File{' '}
                                                                                        {doc.file_type.toUpperCase()}
                                                                                    </a>
                                                                                ),
                                                                            )}
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
                                    {meetings.links.map(
                                        (link: any, k: number) =>
                                            link.url ? (
                                                <Link
                                                    key={k}
                                                    href={link.url}
                                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={k}
                                                    className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-400"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ),
                                    )}
                                </div>
                            )}
                            {meetings.total > 0 && (
                                <div className="mt-4 text-center">
                                    <div className="inline-block rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                                        Menampilkan{' '}
                                        {(meetings.current_page - 1) *
                                            meetings.per_page +
                                            1}{' '}
                                        -{' '}
                                        {Math.min(
                                            meetings.current_page *
                                                meetings.per_page,
                                            meetings.total,
                                        )}{' '}
                                        dari {meetings.total} catatan
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-hidden md:overflow-x-auto">
                                <table className="block min-w-full divide-y divide-slate-200 md:table">
                                    <thead className="hidden bg-slate-50 md:table-header-group">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                            >
                                                Tanggal & Agenda
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                            >
                                                Keputusan
                                            </th>
                                            {canManageMeeting && (
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                                >
                                                    Aksi
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="block divide-y divide-slate-100 bg-white md:table-row-group">
                                        {meetings.data.length === 0 && (
                                            <tr className="block md:table-row">
                                                <td
                                                    colSpan={
                                                        canManageMeeting ? 3 : 2
                                                    }
                                                    className="px-6 py-12 text-center text-slate-500"
                                                >
                                                    <div className="flex flex-col items-center justify-center">
                                                        <UsersThree
                                                            weight="duotone"
                                                            className="mb-3 h-12 w-12 text-slate-300"
                                                        />
                                                        <p>
                                                            Belum ada data
                                                            notulensi rapat.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {meetings.data.map((meeting: any) => (
                                            <tr
                                                key={meeting.id}
                                                className="block border-b border-slate-100 p-5 transition-colors last:border-0 hover:bg-slate-50/80 md:table-row md:border-0 md:p-0"
                                            >
                                                <td className="block px-0 py-2 align-top md:table-cell md:px-6 md:py-4">
                                                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                                        <CalendarBlank weight="bold" />
                                                        {meeting.date
                                                            ? new Date(
                                                                  meeting.date,
                                                              ).toLocaleDateString(
                                                                  'id-ID',
                                                                  {
                                                                      day: 'numeric',
                                                                      month: 'short',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : ''}
                                                    </div>
                                                    <div className="text-sm leading-snug font-bold text-slate-900">
                                                        {meeting.agenda}
                                                    </div>
                                                    {meeting.attendees && (
                                                        <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                                                            <UsersThree
                                                                weight="bold"
                                                                className="mt-0.5 shrink-0 text-slate-400"
                                                            />
                                                            <span className="leading-relaxed whitespace-pre-wrap">
                                                                {
                                                                    meeting.attendees
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="mt-3 block px-0 py-2 align-top md:mt-0 md:table-cell md:px-6 md:py-4">
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle
                                                            weight="fill"
                                                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                                                        />
                                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                                                            {meeting.decisions}
                                                        </div>
                                                    </div>
                                                    {meeting.follow_up && (
                                                        <div className="mt-2 flex items-start gap-2 border-t border-slate-100 pt-2">
                                                            <ListChecks
                                                                weight="bold"
                                                                className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                                                            />
                                                            <div className="text-xs leading-relaxed font-medium whitespace-pre-wrap text-slate-600">
                                                                {
                                                                    meeting.follow_up
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                    {meeting.documents &&
                                                        meeting.documents
                                                            .length > 0 && (
                                                            <div className="mt-2 flex items-start gap-2 border-t border-slate-100 pt-2">
                                                                <Paperclip
                                                                    weight="bold"
                                                                    className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                                                                />
                                                                <div className="flex flex-wrap gap-2">
                                                                    {meeting.documents.map(
                                                                        (
                                                                            doc: any,
                                                                        ) => (
                                                                            <a
                                                                                key={
                                                                                    doc.id
                                                                                }
                                                                                href={`/storage/${doc.file_path}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                                            >
                                                                                {doc.file_type.toLowerCase() ===
                                                                                'pdf' ? (
                                                                                    <FilePdf
                                                                                        weight="fill"
                                                                                        className="text-rose-500"
                                                                                    />
                                                                                ) : (
                                                                                    <ImageIcon
                                                                                        weight="fill"
                                                                                        className="text-blue-500"
                                                                                    />
                                                                                )}
                                                                                Lihat
                                                                                Lampiran
                                                                            </a>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                </td>
                                                {canManageMeeting && (
                                                    <td className="mt-4 block border-t border-slate-100 px-0 pt-4 text-right align-top whitespace-nowrap md:mt-0 md:table-cell md:border-0 md:px-6 md:py-4">
                                                        <div className="grid grid-cols-2 gap-3 md:flex md:justify-end md:gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    openEdit(
                                                                        meeting,
                                                                    )
                                                                }
                                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600 md:w-auto md:bg-transparent md:p-2 md:text-slate-400"
                                                                title="Edit Notulensi"
                                                            >
                                                                <PencilSimple
                                                                    weight="bold"
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="md:hidden">
                                                                    Edit
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteMeeting(
                                                                        meeting.id,
                                                                        meeting.agenda,
                                                                    )
                                                                }
                                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-rose-50 hover:text-rose-600 md:w-auto md:bg-transparent md:p-2 md:text-slate-400"
                                                                title="Hapus Notulensi"
                                                            >
                                                                <Trash
                                                                    weight="bold"
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="md:hidden">
                                                                    Hapus
                                                                </span>
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
                                <div className="flex flex-wrap justify-center gap-1.5 border-t border-slate-100 bg-white px-6 py-4 sm:justify-start">
                                    {meetings.links.map(
                                        (link: any, k: number) =>
                                            link.url ? (
                                                <Link
                                                    key={k}
                                                    href={link.url}
                                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${link.active ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={k}
                                                    className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-400"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ),
                                    )}
                                </div>
                            )}
                            {meetings.total > 0 && (
                                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-xs font-medium text-slate-500 sm:text-left">
                                    Menampilkan{' '}
                                    {(meetings.current_page - 1) *
                                        meetings.per_page +
                                        1}{' '}
                                    -{' '}
                                    {Math.min(
                                        meetings.current_page *
                                            meetings.per_page,
                                        meetings.total,
                                    )}{' '}
                                    dari total {meetings.total} notulensi
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
