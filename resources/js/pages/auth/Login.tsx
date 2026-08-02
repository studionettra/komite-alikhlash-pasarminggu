import { useForm, Head } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import appLogo from '../../../images/logo/logo-komite-alikhlash-jatipadang.png';
import PublicLayout from '../../layouts/PublicLayout';

export default function Login() {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        clearErrors();
        let hasError = false;

        if (!data.email) {
            setError('email', 'Email wajib diisi untuk login.');
            hasError = true;
        }

        if (!data.password) {
            setError('password', 'Password wajib diisi untuk login.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        post('/login');
    };

    return (
        <PublicLayout>
            <Head title="Login Pengurus" />
            <div className="flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <img
                            src={appLogo}
                            alt="Logo Komite"
                            className="mb-4 h-16 w-16 object-contain"
                        />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Login Pengurus
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Masuk ke Dashboard Komite
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6" noValidate>
                        {errors.email && (
                            <div className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="mt-0.5 h-5 w-5 shrink-0"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{errors.email}</span>
                            </div>
                        )}
                        <div>
                            <label
                                className="mb-1 block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className={`w-full rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                required
                                autoFocus
                                autoComplete="username"
                            />
                            {errors.email && (
                                <div className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                className="mb-1 block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className={`w-full rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                required
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <div className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Ingat Saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
