import { Head, useForm, router } from '@inertiajs/react';
import { Trash } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

export default function RolesIndex({ roles }: { roles: any[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/roles', {
            onSuccess: () => reset('name'),
        });
    };

    const deleteRole = (id: number, name: string) => {
        confirmDelete(`Apakah Anda yakin ingin menghapus role ${name}?`, () => {
            router.delete(`/roles/${id}`);
        });
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Role" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Manajemen Role
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Tambah Role Baru
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                    htmlFor="name"
                                >
                                    Nama Role
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={`w-full rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    required
                                />
                                {errors.name && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-70"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Role'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                    >
                                        ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
                                    >
                                        Nama Role
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
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                            {role.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900">
                                            {role.name}
                                        </td>
                                        <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                            {role.name !== 'Superadmin' && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() =>
                                                            deleteRole(
                                                                role.id,
                                                                role.name,
                                                            )
                                                        }
                                                        className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus Role"
                                                    >
                                                        <Trash
                                                            weight="bold"
                                                            className="h-4 w-4"
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
