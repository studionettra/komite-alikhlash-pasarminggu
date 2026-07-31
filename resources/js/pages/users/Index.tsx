import { Head, useForm, router } from '@inertiajs/react';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import Select from '../../components/ui/Select';
import DashboardLayout from '../../layouts/DashboardLayout';
import { confirmDelete } from '../../utils/confirmToast';

export default function UsersIndex({ users, roles }: { users: any, roles: any[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
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
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}
                            </h2>
                            {isEditing && (
                                <button onClick={openCreate} className="text-sm text-blue-600 hover:underline">Batal Edit</button>
                            )}
                        </div>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {isEditing && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required={!isEditing}
                                />
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>
                            <div className="relative z-20">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <Select
                                    value={data.role}
                                    onChange={val => setData('role', val as string)}
                                    options={[
                                        { value: '', label: 'Pilih Role...' },
                                        ...roles.map(r => ({ value: r.name, label: r.name }))
                                    ]}
                                    placeholder="Pilih Role..."
                                />
                                {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 mt-4"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {users.data.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {user.roles[0]?.name || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => openEdit(user)} 
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Edit Pengguna"
                                                    >
                                                        <PencilSimple weight="bold" className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteUser(user.id, user.name)} 
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash weight="bold" className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                            Menampilkan {users.data.length} dari total {users.total} data.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
