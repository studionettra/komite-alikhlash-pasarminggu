import { Head, useForm, Link } from '@inertiajs/react';
import { CaretLeft, CheckCircle, WarningCircle, Receipt, ArrowRight } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

export default function AdminCollectionsShow({ collection }: { collection: any }) {
    const { post, processing } = useForm();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const submitVerification: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/collections/${collection.id}/verify`);
    };

    const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <DashboardLayout>
            <Head title={`Detail Setoran - ${collection.classroom.name}`} />

            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/admin/collections"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700"
                >
                    <CaretLeft weight="bold" className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Detail Setoran Kelas
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">Kelas: {collection.classroom.name} | Periode: {monthNames[collection.month]} {collection.year}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800">Rincian Pembayaran Siswa</h2>
                            <span className="text-sm text-slate-500">Total {collection.details.length} Data</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">Siswa</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Uang Kas</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Jumat Berkah</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {collection.details.map((detail: any) => (
                                        <tr key={detail.id} className="transition-colors hover:bg-slate-50/80">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{detail.student.name}</td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-700">{formatCurrency(detail.kas_amount)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-700">{formatCurrency(detail.jumat_berkah_amount)}</td>
                                            <td className="px-6 py-4 text-center text-sm">
                                                {detail.is_paid ? 
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Lunas</span> : 
                                                <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Belum</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Rekap & Verifikasi</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Total Uang Kas</span>
                                <span className="font-semibold text-slate-800">{formatCurrency(collection.total_kas)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Total Jumat Berkah</span>
                                <span className="font-semibold text-slate-800">{formatCurrency(collection.total_jumat_berkah)}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800">Total Transfer</span>
                                    <span className="text-xl font-bold text-blue-600">{formatCurrency(parseFloat(collection.total_kas) + parseFloat(collection.total_jumat_berkah))}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Receipt className="h-5 w-5 text-slate-500" />
                                <span className="font-semibold text-slate-700">Bukti Transfer</span>
                            </div>
                            {collection.transfer_proof ? (
                                <a href={`/storage/${collection.transfer_proof}`} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-slate-200 bg-white group relative">
                                    <div className="absolute inset-0 bg-slate-900/0 transition-colors group-hover:bg-slate-900/10 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Lihat Penuh</span>
                                    </div>
                                    <img src={`/storage/${collection.transfer_proof}`} alt="Bukti Transfer" className="w-full object-cover" />
                                </a>
                            ) : (
                                <div className="text-center text-sm text-slate-500 py-4">Tidak ada lampiran bukti.</div>
                            )}
                        </div>

                        {collection.status === 'submitted' ? (
                            <form onSubmit={submitVerification}>
                                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 text-amber-800">
                                    <WarningCircle weight="fill" className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p className="text-sm">Pastikan mutasi di rekening sesuai dengan total transfer sebelum melakukan verifikasi.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-70"
                                >
                                    <CheckCircle weight="bold" className="h-5 w-5" />
                                    {processing ? 'Memproses...' : 'Verifikasi & Masukkan ke Saldo'}
                                </button>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3 text-emerald-700">
                                <CheckCircle weight="fill" className="h-5 w-5" />
                                <div className="text-sm">
                                    <span className="block font-bold">Telah Diverifikasi</span>
                                    {collection.verifier && <span className="block text-emerald-600/80">Oleh: {collection.verifier.name}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
