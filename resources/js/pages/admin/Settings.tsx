import { Head, useForm } from '@inertiajs/react';
import { Gear, FloppyDisk, Link as LinkIcon, Info } from '@phosphor-icons/react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function Settings({ settings }: any) {
    const { data, setData, post, processing, errors } = useForm({
        google_spreadsheet_url: settings?.google_spreadsheet_url || '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post('/settings', {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title="Pengaturan Aplikasi" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Pengaturan Aplikasi
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola konfigurasi sistem dan integrasi pihak ketiga.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Gear weight="duotone" className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Integrasi Google Sheets
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Atur tautan Spreadsheet untuk fitur Ekspor Transaksi.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex gap-3">
                                <Info weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Cara Mengatur Google Sheet:</p>
                                    <ol className="list-decimal ml-4 space-y-1 opacity-90">
                                        <li>Buat Google Sheet baru di Google Drive Anda.</li>
                                        <li>Klik tombol <strong>Share (Bagikan)</strong> di pojok kanan atas.</li>
                                        <li>Bagikan ke email: <strong>komite-keuangan@keungan-komite-al-ikhlash.iam.gserviceaccount.com</strong> dengan akses <strong>Editor</strong>.</li>
                                        <li>Salin <em>link</em> Google Sheet tersebut dan <em>paste</em> di bawah ini.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tautan (Link) Google Sheet
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <LinkIcon className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="url"
                                        value={data.google_spreadsheet_url}
                                        onChange={(e) => setData('google_spreadsheet_url', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pr-4 pl-11 transition-colors hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFM..."
                                        required
                                    />
                                </div>
                                {errors.google_spreadsheet_url && (
                                    <p className="mt-1.5 text-sm font-medium text-rose-500">
                                        {errors.google_spreadsheet_url}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98] disabled:opacity-70"
                                >
                                    <FloppyDisk weight="bold" className="h-5 w-5" />
                                    {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
