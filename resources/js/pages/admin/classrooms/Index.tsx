import { Head, useForm, router } from '@inertiajs/react';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import Select from '../../../components/ui/Select';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { confirmDelete } from '../../../utils/alertManager';

export default function ClassroomsIndex({
    classrooms,
    korlasUsers,
}: {
    classrooms: any[];
    korlasUsers: any[];
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            korlas_id: '',
        });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (classroom: any) => {
        setIsEditing(true);
        setEditingId(classroom.id);
        clearErrors();
        setData({
            name: classroom.name,
            korlas_id: classroom.korlas_id ? String(classroom.korlas_id) : '',
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            put(`/admin/classrooms/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
            });
        } else {
            post('/admin/classrooms', {
                onSuccess: () => reset(),
            });
        }
    };

    const deleteClassroom = (id: number, name: string) => {
        confirmDelete(`Hapus kelas ${name}? Data siswa dan setoran terkait juga akan terhapus.`, () => {
            router.delete(`/admin/classrooms/${id}`);
        });
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Kelas" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">
                    Manajemen Kelas
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {isEditing
                                    ? 'Edit Kelas'
                                    : 'Tambah Kelas'}
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
                                    Nama Kelas
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                    placeholder="Contoh: A1"
                                />
                                {errors.name && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            
                            <div className="relative z-20">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Koordinator Kelas (Korlas)
                                </label>
                                <Select
                                    value={data.korlas_id}
                                    onChange={(val) =>
                                        setData('korlas_id', val as string)
                                    }
                                    options={[
                                        { value: '', label: 'Kosong / Belum Ada' },
                                        ...korlasUsers.map((r) => ({
                                            value: String(r.id),
                                            label: r.name,
                                        })),
                                    ]}
                                    placeholder="Pilih Korlas..."
                                />
                                {errors.korlas_id && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.korlas_id}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-70"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Kelas'}
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
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Nama Kelas
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Koordinator Kelas
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {classrooms.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                                                Belum ada data kelas.
                                            </td>
                                        </tr>
                                    ) : (
                                        classrooms.map((classroom: any) => (
                                            <tr
                                                key={classroom.id}
                                                className="transition-colors hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900">
                                                    {classroom.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                    {classroom.korlas ? (
                                                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                                                            {classroom.korlas.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Belum Ada Korlas</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEdit(classroom)
                                                            }
                                                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                                                            title="Edit Kelas"
                                                        >
                                                            <PencilSimple
                                                                weight="bold"
                                                                className="h-4 w-4"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                deleteClassroom(
                                                                    classroom.id,
                                                                    classroom.name,
                                                                )
                                                            }
                                                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                            title="Hapus Kelas"
                                                        >
                                                            <Trash
                                                                weight="bold"
                                                                className="h-4 w-4"
                                                            />
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
                            Total {classrooms.length} Kelas
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
