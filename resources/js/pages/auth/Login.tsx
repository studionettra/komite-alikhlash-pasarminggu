import { useForm, Head } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import appLogo from '../../../images/logo/logo-komite-alikhlash-jatipadang.png';
import PublicLayout from '../../layouts/PublicLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <PublicLayout>
            <Head title="Login Pengurus" />
            <div className="flex justify-center items-center py-20 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                    <div className="text-center mb-8 flex flex-col items-center">
                        <img src={appLogo} alt="Logo Komite" className="w-16 h-16 mb-4 object-contain" />
                        <h2 className="text-2xl font-bold text-gray-900">Login Pengurus</h2>
                        <p className="text-gray-500 mt-2 text-sm">Masuk ke Dashboard Komite</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {errors.email && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-start gap-3 border border-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.email}</span>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                required
                                autoFocus
                                autoComplete="username"
                            />
                            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                required
                                autoComplete="current-password"
                            />
                            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Ingat Saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
