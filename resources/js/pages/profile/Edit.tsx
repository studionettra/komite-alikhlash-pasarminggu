import { Head, useForm, usePage } from '@inertiajs/react';
import { User, LockKey, FloppyDisk } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function Edit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean, status?: string }) {
    const user = usePage().props.auth.user as any;

    const { data: profileData, setData: setProfileData, patch: patchProfile, errors: profileErrors, processing: profileProcessing, recentlySuccessful: profileSuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const { data: passwordData, setData: setPasswordData, patch: patchPassword, errors: passwordErrors, processing: passwordProcessing, recentlySuccessful: passwordSuccessful, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patchProfile(route('profile.update'));
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        patchPassword(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Profil Saya" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
                <p className="mt-1 text-sm text-slate-500">Kelola informasi profil dan keamanan akun Anda.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                
                {/* Informasi Profil */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <User weight="fill" className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Informasi Profil</h2>
                            <p className="text-sm text-slate-500">Perbarui nama dan alamat email akun Anda.</p>
                        </div>
                    </div>

                    <form onSubmit={submitProfile} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData('name', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            {profileErrors.name && <p className="mt-1.5 text-sm text-red-500">{profileErrors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Alamat Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData('email', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            {profileErrors.email && <p className="mt-1.5 text-sm text-red-500">{profileErrors.email}</p>}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={profileProcessing}
                                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-70"
                            >
                                <FloppyDisk weight="bold" className="h-4 w-4" />
                                {profileProcessing ? 'Menyimpan...' : 'Simpan Profil'}
                            </button>
                            
                            {profileSuccessful && (
                                <span className="text-sm font-medium text-emerald-600">Tersimpan!</span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Ubah Password */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                            <LockKey weight="fill" className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Ubah Password</h2>
                            <p className="text-sm text-slate-500">Pastikan akun Anda menggunakan password yang aman.</p>
                        </div>
                    </div>

                    <form onSubmit={submitPassword} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password Saat Ini</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            {passwordErrors.current_password && <p className="mt-1.5 text-sm text-red-500">{passwordErrors.current_password}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password Baru</label>
                            <input
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData('password', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            {passwordErrors.password && <p className="mt-1.5 text-sm text-red-500">{passwordErrors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            {passwordErrors.password_confirmation && <p className="mt-1.5 text-sm text-red-500">{passwordErrors.password_confirmation}</p>}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={passwordProcessing}
                                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-70"
                            >
                                <LockKey weight="bold" className="h-4 w-4" />
                                {passwordProcessing ? 'Menyimpan...' : 'Simpan Password'}
                            </button>
                            
                            {passwordSuccessful && (
                                <span className="text-sm font-medium text-emerald-600">Tersimpan!</span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
