import { Head, useForm, router } from '@inertiajs/react';
import { PencilSimple, Trash, ToggleLeft, ToggleRight } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { confirmDelete } from '../../../utils/alertManager';

export default function StudentsIndex({
    classroom,
    students,
}: {
    classroom: any;
    students: any[];
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            parent_name: '',
            is_active: true,
        });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (student: any) => {
        setIsEditing(true);
        setEditingId(student.id);
        clearErrors();
        setData({
            name: student.name,
            parent_name: student.parent_name || '',
            is_active: student.is_active,
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            put(`/korlas/students/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
            });
        } else {
            post('/korlas/students', {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        }
    };

    const toggleStatus = (student: any) => {
        router.put(`/korlas/students/${student.id}`, {
            name: student.name,
            parent_name: student.parent_name,
            is_active: !student.is_active,
        });
    };

    const deleteStudent = (id: number, name: string) => {
        confirmDelete(`Hapus siswa ${name}? Data pembayaran yang terkait juga mungkin akan terhapus.`, () => {
            router.delete(`/korlas/students/${id}`);
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Kelola Siswa - ${classroom.name}`} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Siswa
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">Kelas: {classroom.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {isEditing ? 'Edit Siswa' : 'Tambah Siswa Baru'}
                            </h2>
                            {isEditing && (
                                <button
                                    onClick={openCreate}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Batal Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Nama Anak / Siswa
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                    placeholder="Contoh: Budi Santoso"
                                />
                                {errors.name && (
                                    <div className="mt-1 text-xs text-red-500">{errors.name}</div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Nama Orang Tua / Wali
                                </label>
                                <input
                                    type="text"
                                    value={data.parent_name}
                                    onChange={(e) => setData('parent_name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Contoh: Bapak Andi (Opsional)"
                                />
                                {errors.parent_name && (
                                    <div className="mt-1 text-xs text-red-500">{errors.parent_name}</div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-70"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Siswa'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                                            Nama Siswa
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                                            Orang Tua / Wali
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                                                Belum ada data siswa di kelas ini. Silakan tambah data siswa di form samping.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student: any) => (
                                            <tr key={student.id} className={`transition-colors hover:bg-slate-50/80 ${!student.is_active ? 'opacity-60 bg-slate-50' : ''}`}>
                                                <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                    {student.parent_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                    <button 
                                                        onClick={() => toggleStatus(student)}
                                                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                                        title="Klik untuk mengubah status aktif/non-aktif"
                                                    >
                                                        {student.is_active ? (
                                                            <>
                                                                <ToggleRight weight="fill" className="h-6 w-6 text-emerald-500" />
                                                                <span className="text-emerald-700 font-medium">Aktif</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleLeft weight="fill" className="h-6 w-6 text-slate-400" />
                                                                <span className="text-slate-500 font-medium">Non-Aktif</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEdit(student)}
                                                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                                                            title="Edit Siswa"
                                                        >
                                                            <PencilSimple weight="bold" className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteStudent(student.id, student.name)}
                                                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                            title="Hapus Siswa"
                                                        >
                                                            <Trash weight="bold" className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500">
                            Total {students.length} Siswa
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
