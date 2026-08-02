import { Head, useForm, router } from '@inertiajs/react';
import { UploadSimple, CheckCircle, ClockCounterClockwise, CurrencyCircleDollar, HandHeart } from '@phosphor-icons/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

export default function CollectionsIndex({
    classroom,
    collection,
    details,
    totals,
    history
}: {
    classroom: any;
    collection: any;
    details: any[];
    totals: any;
    history: any[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        transfer_proof: null as File | null,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleUpdateDetail = (detail: any, field: string, value: any) => {
        router.put(`/korlas/collections/detail/${detail.id}`, {
            is_paid: field === 'is_paid' ? value : detail.is_paid,
            kas_amount: field === 'kas_amount' ? value : detail.kas_amount,
            jumat_berkah_amount: field === 'jumat_berkah_amount' ? value : detail.jumat_berkah_amount,
        }, {
            preserveScroll: true
        });
    };

    const submitCollection: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.transfer_proof) {
return alert('Pilih file bukti transfer terlebih dahulu');
}
        
        post(`/korlas/collections/${collection.id}/submit`, {
            preserveScroll: true
        });
    };

    const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <DashboardLayout>
            <Head title={`Setoran Kelas - ${classroom.name}`} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Setoran Uang Kas & Donasi
                </h1>
                <p className="mt-1 text-sm text-slate-500">Kelas: {classroom.name} | Periode: {monthNames[collection.month]} {collection.year}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <h2 className="font-semibold text-slate-800">Daftar Tagihan Siswa</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">Siswa</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Uang Kas (Tagihan)</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Jumat Berbagi</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">Status Bayar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {details.map((detail) => (
                                        <tr key={detail.id} className="transition-colors hover:bg-slate-50/80">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                {detail.student.name}
                                                {detail.kas_amount > 75000 && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                                                        Ada Tunggakan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                                {collection.status === 'draft' ? (
                                                    <input 
                                                        type="number"
                                                        value={detail.kas_amount}
                                                        onChange={(e) => handleUpdateDetail(detail, 'kas_amount', e.target.value)}
                                                        className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    formatCurrency(detail.kas_amount)
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                                {collection.status === 'draft' ? (
                                                    <input 
                                                        type="number"
                                                        value={detail.jumat_berkah_amount}
                                                        onChange={(e) => handleUpdateDetail(detail, 'jumat_berkah_amount', e.target.value)}
                                                        className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    formatCurrency(detail.jumat_berkah_amount)
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm">
                                                {collection.status === 'draft' ? (
                                                    <label className="relative inline-flex cursor-pointer items-center">
                                                        <input 
                                                            type="checkbox" 
                                                            className="peer sr-only"
                                                            checked={detail.is_paid}
                                                            onChange={(e) => handleUpdateDetail(detail, 'is_paid', e.target.checked)}
                                                        />
                                                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                                                    </label>
                                                ) : (
                                                    detail.is_paid ? 
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Lunas</span> : 
                                                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Belum</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {/* Rekap Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Rekapitulasi</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <CurrencyCircleDollar className="h-5 w-5" />
                                    <span>Total Uang Kas</span>
                                </div>
                                <span className="font-semibold text-slate-800">{formatCurrency(totals.kas)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <HandHeart className="h-5 w-5" />
                                    <span>Total Jumat Berbagi</span>
                                </div>
                                <span className="font-semibold text-slate-800">{formatCurrency(totals.jumat)}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800">Total Setoran</span>
                                    <span className="text-xl font-bold text-blue-600">{formatCurrency(totals.kas + totals.jumat)}</span>
                                </div>
                            </div>
                        </div>

                        {collection.status === 'draft' ? (
                            <form onSubmit={submitCollection} className="mt-6 border-t border-slate-100 pt-6">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Upload Bukti Transfer</label>
                                <input 
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={e => setData('transfer_proof', e.target.files ? e.target.files[0] : null)}
                                    className="mb-4 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {errors.transfer_proof && <p className="mb-4 text-sm text-red-600">{errors.transfer_proof}</p>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-70"
                                >
                                    <UploadSimple weight="bold" className="h-5 w-5" />
                                    {processing ? 'Memproses...' : 'Setorkan ke Bendahara'}
                                </button>
                                <p className="mt-2 text-center text-xs text-slate-500">
                                    Pastikan nominal transfer sesuai dengan total setoran.
                                </p>
                            </form>
                        ) : (
                            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-slate-600 border border-slate-200">
                                {collection.status === 'submitted' ? (
                                    <>
                                        <ClockCounterClockwise weight="bold" className="h-5 w-5 text-amber-500" />
                                        <span className="font-medium text-amber-700">Menunggu Verifikasi Bendahara</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle weight="bold" className="h-5 w-5 text-emerald-500" />
                                        <span className="font-medium text-emerald-700">Telah Diverifikasi</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
