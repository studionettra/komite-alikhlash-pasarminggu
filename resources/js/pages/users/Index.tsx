import { Head, useForm, router } from '@inertiajs/react';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/alertManager';

export default function UsersIndex({
    users,
    roles,
}: {
    users: any;
    roles: any[];
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            password: '',
            role: '',
        });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const openEdit = (user: any) => {
        setIsEditing(true);
        setEditingId(user.id);
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles[0]?.name || '',
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing && editingId) {
            put(`/users/${editingId}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditingId(null);
                },
            });
        } else {
            post('/users', {
                onSuccess: () => reset(),
            });
        }
    };

    const deleteUser = (id: number, name: string) => {
        confirmDelete(`Hapus pengguna ${name}?`, () => {
            router.delete(`/users/${id}`);
        });
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Pengguna" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Manajemen Pengguna
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {isEditing
                                    ? 'Edit Pengguna'
                                    : 'Tambah Pengguna'}
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
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.name && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.email && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Password{' '}
                                    {isEditing && (
                                        <span className="font-normal text-gray-400">
                                            (Kosongkan jika tidak diubah)
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required={!isEditing}
                                />
                                {errors.password && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.password}
                                    </div>
                                )}
                            </div>
                            <div className="relative z-20">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <Select
                                    value={data.role}
                                    onChange={(val) =>
                                        setData('role', val as string)
                                    }
                                    options={[
                                        { value: '', label: 'Pilih Role...' },
                                        ...roles.map((r) => ({
                                            value: r.name,
                                            label: r.name,
                                        })),
                                    ]}
                                    placeholder="Pilih Role..."
                                />
                                {errors.role && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.role}
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
                                    : 'Simpan Pengguna'}
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
                                            Nama
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Email
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                        >
                                            Role
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
                                    {users.data.map((user: any) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-slate-50/80"
                                        >
                                            <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                                                    {user.roles[0]?.name || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                        className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                                                        title="Edit Pengguna"
                                                    >
                                                        <PencilSimple
                                                            weight="bold"
                                                            className="h-4 w-4"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteUser(
                                                                user.id,
                                                                user.name,
                                                            )
                                                        }
                                                        className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash
                                                            weight="bold"
                                                            className="h-4 w-4"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500">
                            Menampilkan {users.data.length} dari total{' '}
                            {users.total} data.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
