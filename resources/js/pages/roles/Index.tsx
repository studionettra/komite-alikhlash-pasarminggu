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
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Role</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Role Baru</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nama Role</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Role'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Role</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{role.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{role.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                                            {role.name !== 'Superadmin' && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => deleteRole(role.id, role.name)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Hapus Role"
                                                    >
                                                        <Trash weight="bold" className="w-4 h-4" />
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
