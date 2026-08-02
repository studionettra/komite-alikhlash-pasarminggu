import { Head, Link } from '@inertiajs/react';
import { Eye, CheckCircle, ClockCounterClockwise } from '@phosphor-icons/react';
import DashboardLayout from '../../../layouts/DashboardLayout';

export default function AdminCollectionsIndex({ collections }: { collections: any }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <DashboardLayout>
            <Head title="Verifikasi Setoran Kelas" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Verifikasi Setoran Kelas
                </h1>
                <p className="mt-1 text-sm text-slate-500">Daftar laporan pengumpulan dana kas dan donasi dari Koordinator Kelas.</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">Periode & Kelas</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Total Setoran</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {collections.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                                        Belum ada setoran masuk dari Korlas.
                                    </td>
                                </tr>
                            ) : (
                                collections.data.map((collection: any) => (
                                    <tr key={collection.id} className="transition-colors hover:bg-slate-50/80">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900">{collection.classroom.name}</div>
                                            <div className="text-sm text-slate-500">{monthNames[collection.month]} {collection.year}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900">{formatCurrency(parseFloat(collection.total_kas) + parseFloat(collection.total_jumat_berkah))}</div>
                                            <div className="text-xs text-slate-500">Kas: {formatCurrency(collection.total_kas)} | Jumat: {formatCurrency(collection.total_jumat_berkah)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {collection.status === 'submitted' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                                    <ClockCounterClockwise weight="bold" /> Menunggu Verifikasi
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                                    <CheckCircle weight="bold" /> Terverifikasi
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link
                                                href={`/admin/collections/${collection.id}`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                                            >
                                                <Eye weight="bold" />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
