import { Head, usePage } from '@inertiajs/react';
import bannerImage from '../../images/banners/image-banner-dashboard-komite.png';
import AnggotaDashboard from '../components/dashboard/AnggotaDashboard';
import BendaharaDashboard from '../components/dashboard/BendaharaDashboard';
import KorlasDashboard from '../components/dashboard/KorlasDashboard';
import SekretarisDashboard from '../components/dashboard/SekretarisDashboard';
import SuperadminDashboard from '../components/dashboard/SuperadminDashboard';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Dashboard(props: any) {
    const { auth } = usePage().props as any;
    const { role } = props;

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const renderDashboard = () => {
        switch (role) {
            case 'Superadmin':
                return (
                    <SuperadminDashboard
                        {...props}
                        formatRupiah={formatRupiah}
                    />
                );
            case 'Bendahara':
                return (
                    <BendaharaDashboard
                        {...props}
                        formatRupiah={formatRupiah}
                    />
                );
            case 'Sekretaris':
                return (
                    <SekretarisDashboard
                        {...props}
                        formatRupiah={formatRupiah}
                    />
                );
            case 'Korlas':
                return (
                    <KorlasDashboard
                        {...props}
                        formatRupiah={formatRupiah}
                    />
                );
            default:
                return (
                    <AnggotaDashboard {...props} formatRupiah={formatRupiah} />
                );
        }
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard Komite" />

            <div className="w-full space-y-8">
                {/* Hero / Greeting Section */}
                <div className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-sm sm:p-12">
                    {/* Subtle background glow */}
                    <div className="pointer-events-none absolute top-0 right-0 z-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
                    <div className="pointer-events-none absolute bottom-0 left-0 z-0 -mb-16 -ml-16 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>

                    {/* Integrated Banner Image (Photo Background Style) */}
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-full md:block md:w-1/2 lg:w-5/12"
                        style={{
                            WebkitMaskImage:
                                'linear-gradient(to right, transparent 10%, black 30%, black 100%)',
                            maskImage:
                                'linear-gradient(to right, transparent 5%, black 30%, black 100%)',
                        }}
                    >
                        <img
                            src={bannerImage}
                            alt="Dashboard Banner"
                            className="h-full w-full object-cover object-right-top opacity-30 mix-blend-luminosity transition-all duration-1000 hover:opacity-60 hover:mix-blend-overlay"
                        />
                    </div>

                    <div className="relative z-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl font-semibold text-white shadow-inner backdrop-blur-md">
                            {auth?.user?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 shadow-sm backdrop-blur-md">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
                                Logged in as{' '}
                                {auth?.user?.roles?.[0]?.name || 'Admin'}
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
                                Selamat Datang, {auth?.user?.name || 'Pengurus'}
                            </h1>
                            <p className="mt-2.5 max-w-lg leading-relaxed font-medium text-slate-300">
                                {role === 'Bendahara'
                                    ? 'Kelola arus kas, pantau pemasukan dan pengeluaran, serta pastikan transparansi keuangan komite terjaga.'
                                    : role === 'Sekretaris'
                                      ? 'Kelola administrasi, catat notulensi rapat, dan pastikan seluruh dokumen program kerja terarsip dengan baik.'
                                      : role === 'Superadmin'
                                        ? 'Pantau dan kelola seluruh aktivitas, program kerja, serta transparansi kas Komite dengan mudah dari panel ini.'
                                        : role === 'Korlas'
                                          ? 'Kelola pendataan siswa dan proses pengumpulan uang kas/donasi kelas Anda dengan efisien.'
                                          : 'Pantau transparansi kas, agenda program kerja, dan hasil keputusan rapat secara mudah di sini.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Role Specific Dashboard */}
                {renderDashboard()}
            </div>
        </DashboardLayout>
    );
}
